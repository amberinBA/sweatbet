import { http, createConfig } from 'wagmi';
import { celoAlfajores, celo } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [celoAlfajores, celo],
  connectors: [
    injected(),
  ],
  transports: {
    [celoAlfajores.id]: http(),
    [celo.id]: http(),
  },
  ssr: true,
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}