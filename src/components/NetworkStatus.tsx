import { useAccount, useChainId } from 'wagmi'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertTriangle } from 'lucide-react'
import { plasma } from '../config/web3'

export const NetworkStatus = () => {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  
  if (!isConnected) {
    return null
  }

  const isOnPlasma = chainId === plasma.id

  return (
    <div className="flex items-center gap-2">
      {isOnPlasma ? (
        <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
          <CheckCircle className="w-3 h-3 mr-1" />
          Plasma Network
        </Badge>
      ) : (
        <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-600 border-orange-500/20">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Wrong Network
        </Badge>
      )}
    </div>
  )
}
