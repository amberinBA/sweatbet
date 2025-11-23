// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BettingEscrow
 * @dev Escrow contract for SweatBet with ZK proof verification
 */
contract BettingEscrow is ReentrancyGuard, Ownable {
    IERC20 public cUSD;
    address public treasury;
    uint256 public constant PROTOCOL_FEE_PERCENT = 2; // 2%
    
    struct Bet {
        uint256 betId;
        uint256 betAmount;
        uint256 targetDistance; // in meters
        uint256 deadline;
        address[] participants;
        mapping(address => bool) hasBet;
        mapping(address => bool) hasProved;
        mapping(address => bytes32) zkProofHashes;
        uint256 totalPool;
        bool isActive;
        bool isSettled;
        uint256 winnerCount;
    }
    
    struct Challenge {
        string activityType; // "Run", "Ride", etc.
        uint256 targetDistance;
        uint256 deadline;
        uint256 betAmount;
    }
    
    mapping(uint256 => Bet) public bets;
    mapping(uint256 => Challenge) public challenges;
    uint256 public betCounter;
    
    event BetCreated(uint256 indexed betId, uint256 betAmount, uint256 deadline, uint256 targetDistance);
    event BetPlaced(uint256 indexed betId, address indexed participant, uint256 amount);
    event ProofSubmitted(uint256 indexed betId, address indexed participant, bytes32 proofHash);
    event WinningsClaimed(uint256 indexed betId, address indexed winner, uint256 amount);
    event BetSettled(uint256 indexed betId, uint256 winnerCount, uint256 totalPayout);
    
    constructor(address _cUSD, address _treasury) {
        cUSD = IERC20(_cUSD);
        treasury = _treasury;
    }
    
    /**
     * @dev Create a new bet challenge
     */
    function createBet(
        uint256 _betAmount,
        uint256 _targetDistance,
        uint256 _deadline,
        string memory _activityType
    ) external returns (uint256) {
        require(_betAmount > 0, "Bet amount must be positive");
        require(_deadline > block.timestamp, "Deadline must be in future");
        require(_targetDistance > 0, "Distance must be positive");
        
        betCounter++;
        uint256 betId = betCounter;
        
        Bet storage newBet = bets[betId];
        newBet.betId = betId;
        newBet.betAmount = _betAmount;
        newBet.targetDistance = _targetDistance;
        newBet.deadline = _deadline;
        newBet.isActive = true;
        newBet.isSettled = false;
        
        challenges[betId] = Challenge({
            activityType: _activityType,
            targetDistance: _targetDistance,
            deadline: _deadline,
            betAmount: _betAmount
        });
        
        emit BetCreated(betId, _betAmount, _deadline, _targetDistance);
        return betId;
    }
    
    /**
     * @dev Place a bet by depositing cUSD
     */
    function placeBet(uint256 _betId) external nonReentrant {
        Bet storage bet = bets[_betId];
        require(bet.isActive, "Bet not active");
        require(block.timestamp < bet.deadline, "Bet deadline passed");
        require(!bet.hasBet[msg.sender], "Already placed bet");
        
        require(
            cUSD.transferFrom(msg.sender, address(this), bet.betAmount),
            "Transfer failed"
        );
        
        bet.participants.push(msg.sender);
        bet.hasBet[msg.sender] = true;
        bet.totalPool += bet.betAmount;
        
        emit BetPlaced(_betId, msg.sender, bet.betAmount);
    }
    
    /**
     * @dev Submit ZK proof from VLayer
     */
    function submitZKProof(
        uint256 _betId,
        bytes memory _zkProof,
        uint256 _claimedDistance
    ) external {
        Bet storage bet = bets[_betId];
        require(bet.hasBet[msg.sender], "Not a participant");
        require(!bet.hasProved[msg.sender], "Already submitted proof");
        require(block.timestamp >= bet.deadline, "Deadline not reached");
        require(bet.isActive, "Bet not active");
        
        // Verify proof hash and claimed distance
        bytes32 proofHash = keccak256(_zkProof);
        require(_claimedDistance >= bet.targetDistance, "Distance not met");
        
        bet.hasProved[msg.sender] = true;
        bet.zkProofHashes[msg.sender] = proofHash;
        bet.winnerCount++;
        
        emit ProofSubmitted(_betId, msg.sender, proofHash);
    }
    
    /**
     * @dev Claim winnings after successful proof
     */
    function claimWinnings(uint256 _betId) external nonReentrant {
        Bet storage bet = bets[_betId];
        require(bet.hasProved[msg.sender], "No valid proof submitted");
        require(!bet.isSettled || bet.winnerCount > 0, "Bet not settled or no winners");
        
        if (!bet.isSettled) {
            _settleBet(_betId);
        }
        
        uint256 payout = _calculatePayout(_betId, msg.sender);
        require(payout > 0, "No payout available");
        
        // Reset to prevent double claiming
        bet.hasProved[msg.sender] = false;
        
        require(cUSD.transfer(msg.sender, payout), "Transfer failed");
        
        emit WinningsClaimed(_betId, msg.sender, payout);
    }
    
    /**
     * @dev Settle bet and calculate payouts
     */
    function _settleBet(uint256 _betId) internal {
        Bet storage bet = bets[_betId];
        require(!bet.isSettled, "Already settled");
        
        bet.isSettled = true;
        bet.isActive = false;
        
        // If no winners, protocol keeps the pool (edge case)
        if (bet.winnerCount == 0) {
            uint256 poolAmount = bet.totalPool;
            require(cUSD.transfer(treasury, poolAmount), "Transfer to treasury failed");
        }
        
        emit BetSettled(_betId, bet.winnerCount, bet.totalPool);
    }
    
    /**
     * @dev Calculate payout for a winner
     */
    function _calculatePayout(uint256 _betId, address _participant) internal view returns (uint256) {
        Bet storage bet = bets[_betId];
        
        if (!bet.hasProved[_participant] || bet.winnerCount == 0) {
            return 0;
        }
        
        // Calculate protocol fee
        uint256 protocolFee = (bet.totalPool * PROTOCOL_FEE_PERCENT) / 100;
        uint256 payoutPool = bet.totalPool - protocolFee;
        
        // Split evenly among winners
        uint256 payout = payoutPool / bet.winnerCount;
        
        return payout;
    }
    
    /**
     * @dev Admin function to withdraw protocol fees
     */
    function withdrawFees(uint256 _betId) external onlyOwner {
        Bet storage bet = bets[_betId];
        require(bet.isSettled, "Bet not settled");
        
        uint256 protocolFee = (bet.totalPool * PROTOCOL_FEE_PERCENT) / 100;
        require(cUSD.transfer(treasury, protocolFee), "Transfer failed");
    }
    
    /**
     * @dev Get bet details
     */
    function getBetDetails(uint256 _betId) external view returns (
        uint256 betAmount,
        uint256 targetDistance,
        uint256 deadline,
        address[] memory participants,
        uint256 totalPool,
        bool isActive,
        uint256 winnerCount
    ) {
        Bet storage bet = bets[_betId];
        return (
            bet.betAmount,
            bet.targetDistance,
            bet.deadline,
            bet.participants,
            bet.totalPool,
            bet.isActive,
            bet.winnerCount
        );
    }
    
    /**
     * @dev Check if address has proved
     */
    function hasProof(uint256 _betId, address _participant) external view returns (bool) {
        return bets[_betId].hasProved[_participant];
    }
    
    /**
     * @dev Update treasury address
     */
    function updateTreasury(address _newTreasury) external onlyOwner {
        require(_newTreasury != address(0), "Invalid address");
        treasury = _newTreasury;
    }
}
