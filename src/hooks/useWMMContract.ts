import { useReadContract, useWriteContract, useAccount } from 'wagmi'
import { useCallback } from 'react'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/web3'

export const useWMMContract = () => {
  const { address } = useAccount()
  const { writeContract } = useWriteContract()
  
  const CACHE_DURATION = 30000 
  const POLL_INTERVAL = 60000 

  const { data: currentTokenId } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getCurrentTokenId',
    query: {
      refetchInterval: POLL_INTERVAL,
      staleTime: CACHE_DURATION,
    }
  })

  const { data: userMintedCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getUserMintedCount',
    args: address ? [address] : undefined,
    query: {
      refetchInterval: address ? POLL_INTERVAL : false,
      staleTime: CACHE_DURATION,
      enabled: !!address,
    }
  })

  const mintRandomEditions = async (quantity: number) => {
    if (!address) throw new Error('Wallet not connected')
    
    const hash = await writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'mintRandomEditions',
      args: [BigInt(quantity)],
    } as any)
    
    return hash
  }

  const refreshSupplyData = useCallback(() => {
    console.log('Supply data refresh requested - handled by automatic polling');
  }, []);

  const totalMinted = currentTokenId ? Number(currentTokenId) : 0;
  const maxSupply = 6969; 
  const maxMintsPerWallet = 3;  
  const canUserMint = userMintedCount ? Number(userMintedCount) < maxMintsPerWallet : true;

  return {
    totalMinted,
    maxSupply,
    userMintedCount: userMintedCount ? Number(userMintedCount) : 0,
    maxMintsPerWallet,
    canUserMint,
    
    mintRandomEditions,
    refreshSupplyData,
    
    contractAddress: CONTRACT_ADDRESS,
  }
}
