import { http, createConfig } from 'wagmi';
import { celo } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Celo Sepolia testnet
export const celoSepolia = {
  id: 44787,
  name: 'Celo Alfajores Testnet',
  network: 'celo-alfajores',
  nativeCurrency: {
    decimals: 18,
    name: 'CELO',
    symbol: 'CELO',
  },
  rpcUrls: {
    default: {
      http: ['https://alfajores-forno.celo-testnet.org'],
    },
    public: {
      http: ['https://alfajores-forno.celo-testnet.org'],
    },
  },
  blockExplorers: {
    default: { name: 'CeloScan', url: 'https://explorer.celo.org/alfajores' },
  },
  testnet: true,
} as const;

export const config = createConfig({
  chains: [celoSepolia, celo],
  connectors: [
    injected(),
  ],
  transports: {
    [celoSepolia.id]: http(),
    [celo.id]: http(),
  },
  ssr: true,
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}