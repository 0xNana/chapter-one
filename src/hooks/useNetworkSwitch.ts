import { useAccount, useSwitchChain } from 'wagmi'
import { plasma } from '../config/web3'

export const useNetworkSwitch = () => {
  const { chainId, isConnected } = useAccount()
  const { switchChain, isPending: isSwitching } = useSwitchChain()

  const isOnPlasma = chainId === plasma.id && chainId !== undefined

  const switchToPlasma = async () => {
    if (!isConnected) {
      throw new Error('Wallet not connected')
    }

    if (isOnPlasma) {
      return;
    }

    try {
      await switchChain({ chainId: plasma.id })
    } catch (error) {
      console.error('Failed to switch to Plasma:', error)
      throw error
    }
  }

  const ensurePlasmaNetwork = async () => {
    if (!isConnected) {
      throw new Error('Wallet not connected')
    }

    if (!isOnPlasma) {
      await switchToPlasma()
    }
  }

  return {
    isOnPlasma,
    isSwitching,
    switchToPlasma,
    ensurePlasmaNetwork,
    plasmaChainId: plasma.id,
  }
}
