const hre = require('hardhat');

/**
 * Helper script to create a new bet on the deployed contract
 * 
 * Usage:
 * node scripts/create-bet.js
 */

async function main() {
  const [creator] = await hre.ethers.getSigners();
  
  // Get deployed contract address from environment or command line
  const network = hre.network.name;
  const escrowAddress = network === 'celo'
    ? process.env.NEXT_PUBLIC_ESCROW_CONTRACT_MAINNET
    : process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ALFAJORES;
  
  if (!escrowAddress) {
    console.error('❌ Contract address not found in environment variables');
    process.exit(1);
  }
  
  console.log('Creating bet on', network);
  console.log('Contract:', escrowAddress);
  console.log('Creator:', creator.address);
  
  const BettingEscrow = await hre.ethers.getContractFactory('BettingEscrow');
  const escrow = BettingEscrow.attach(escrowAddress);
  
  // Bet parameters
  const betAmount = hre.ethers.utils.parseEther('10'); // 10 cUSD
  const targetDistance = 5000; // 5 km in meters
  const deadline = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days from now
  const activityType = 'Run';
  
  console.log('\nBet Details:');
  console.log('- Amount:', hre.ethers.utils.formatEther(betAmount), 'cUSD');
  console.log('- Target:', (targetDistance / 1000).toFixed(1), 'km');
  console.log('- Deadline:', new Date(deadline * 1000).toLocaleString());
  console.log('- Type:', activityType);
  
  console.log('\nCreating bet...');
  
  const tx = await escrow.createBet(
    betAmount,
    targetDistance,
    deadline,
    activityType
  );
  
  console.log('Transaction hash:', tx.hash);
  console.log('Waiting for confirmation...');
  
  const receipt = await tx.wait();
  
  // Extract bet ID from event
  const betCreatedEvent = receipt.events?.find(e => e.event === 'BetCreated');
  const betId = betCreatedEvent?.args?.betId;
  
  console.log('\n✅ Bet created successfully!');
  console.log('Bet ID:', betId.toString());
  console.log('\nShare this URL on Farcaster:');
  console.log(`${process.env.NEXT_PUBLIC_APP_URL}/?usernames=alice,bob,charlie&betId=${betId.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
