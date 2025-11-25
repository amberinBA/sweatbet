import { parseUnits, formatUnits } from 'viem';

export const BETTING_ESCROW_ABI = [
  {
    inputs: [
      { name: '_betAmount', type: 'uint256' },
      { name: '_targetDistance', type: 'uint256' },
      { name: '_deadline', type: 'uint256' },
      { name: '_activityType', type: 'string' },
    ],
    name: 'createBet',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: '_betId', type: 'uint256' }],
    name: 'placeBet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: '_betId', type: 'uint256' },
      { name: '_zkProof', type: 'bytes' },
      { name: '_claimedDistance', type: 'uint256' },
    ],
    name: 'submitZKProof',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: '_betId', type: 'uint256' }],
    name: 'claimWinnings',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: '_betId', type: 'uint256' }],
    name: 'getBetDetails',
    outputs: [
      { name: 'betAmount', type: 'uint256' },
      { name: 'targetDistance', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
      { name: 'participants', type: 'address[]' },
      { name: 'totalPool', type: 'uint256' },
      { name: 'isActive', type: 'bool' },
      { name: 'winnerCount', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: '_betId', type: 'uint256' },
      { name: '_participant', type: 'address' },
    ],
    name: 'hasProof',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const ERC20_ABI = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

/**
 * Helper to format cUSD amount
 */
export function formatCUSD(amount: bigint): string {
  return formatUnits(amount, 18);
}

/**
 * Helper to parse cUSD amount
 */
export function parseCUSD(amount: string): bigint {
  return parseUnits(amount, 18);
}

/**
 * Get contract addresses based on chain
 */
export function getContractAddresses(chainId: number) {
  // Celo Sepolia/Alfajores = 44787
  // Celo Mainnet = 42220

  if (chainId === 44787) {
    // Celo Sepolia
    return {
      escrow: (process.env.NEXT_PUBLIC_ESCROW_CONTRACT_SEPOLIA as `0x${string}`),
      cUSD: (process.env.NEXT_PUBLIC_CUSD_SEPOLIA as `0x${string}`),
    };
  } else if (chainId === 42220) {
    // Celo Mainnet
    return {
      escrow: (process.env.NEXT_PUBLIC_ESCROW_CONTRACT_MAINNET as `0x${string}`),
      cUSD: (process.env.NEXT_PUBLIC_CUSD_MAINNET as `0x${string}`),
    };
  }

  // Default to Sepolia
  return {
    escrow: (process.env.NEXT_PUBLIC_ESCROW_CONTRACT_SEPOLIA as `0x${string}`),
    cUSD: (process.env.NEXT_PUBLIC_CUSD_SEPOLIA as `0x${string}`),
  };
}