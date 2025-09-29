import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Wallet, LogOut, AlertTriangle } from 'lucide-react'
import { useNetworkSwitch } from '@/hooks/useNetworkSwitch'
import { useToast } from '@/hooks/use-toast'

export const WalletConnect = () => {
  const { address, isConnected, chainId } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { isOnPlasma, isSwitching, switchToPlasma } = useNetworkSwitch()
  const { toast } = useToast()

  const handleSwitchToPlasma = async () => {
    try {
      await switchToPlasma()
      toast({
        title: "Network Switched",
        description: "Successfully switched to Plasma network",
      })
    } catch (error) {
      console.error('Failed to switch network:', error)
      toast({
        title: "Network Switch Failed",
        description: "Please manually switch to Plasma network in your wallet",
        variant: "destructive",
      })
    }
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-sm text-muted-foreground">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
        
        {!isOnPlasma && chainId !== undefined && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleSwitchToPlasma}
            disabled={isSwitching}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            {isSwitching ? 'Switching...' : 'Switch to Plasma'}
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => disconnect()}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </Button>
      </div>
    )
  }
  
  const primaryConnector = connectors[0]

  return (
    <Button
      onClick={() => connect({ connector: primaryConnector })}
      disabled={isPending}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Wallet className="w-4 h-4" />
      {isPending ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  )
}
