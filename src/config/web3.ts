import { createConfig, http } from 'wagmi'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'


export const plasma = {
  id: 9745,
  name: 'Plasma',
  network: 'plasma',
  nativeCurrency: {
    decimals: 18,
    name: 'Plasma',
    symbol: 'XPL',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.plasma.to'],
    },
    public: {
      http: ['https://rpc.plasma.to'],
    },
  },
  blockExplorers: {
    default: {
      name: 'PlasmaScan',
      url: 'https://plasmascan.to',
    },
  },
} as const


export const CONTRACT_ADDRESS = '0xCBE6dF9722be9c40d18ed3d6263e42C74312C441' // Deployed contract address
export const CONTRACT_ABI = [

  {
    "inputs": [],
    "name": "getCurrentTokenId",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "quantity", "type": "uint256"}],
    "name": "mintRandomEditions",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserMintedCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const


export const config = createConfig({
  chains: [plasma],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId: import.meta.env.VITE_PROJECT_ID || '',
    }),
  ],
  transports: {
    [plasma.id]: http(),
  },
})

export default config
