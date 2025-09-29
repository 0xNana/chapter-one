import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWMMContract } from "@/hooks/useWMMContract";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { useNetworkSwitch } from "@/hooks/useNetworkSwitch";

interface ClaimFlowProps {
  open: boolean;
  onClose: () => void;
  quantity?: number;
}

export const ClaimFlow = ({ open, onClose, quantity = 1 }: ClaimFlowProps) => {
  const { toast } = useToast();
  const [mintStep, setMintStep] = useState<'selected' | 'claim'>('selected');
  const [isMinting, setIsMinting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [initialMintCount, setInitialMintCount] = useState<number>(0);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
  const { isConnected } = useAccount();
  const { mintRandomEditions, maxMintsPerWallet, userMintedCount, refreshSupplyData } = useWMMContract();
  const { isOnPlasma, ensurePlasmaNetwork } = useNetworkSwitch();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: confirmError } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}` | undefined,
    query: {
      enabled: !!txHash && !!txHash.startsWith('0x'),
    }
  });

  useEffect(() => {
    if (open) {
      setMintStep('selected');
      setIsMinting(false);
      setTxHash(null);
      setInitialMintCount(userMintedCount);
      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
    }
  }, [open, userMintedCount, timeoutId]);

  // Check if minting was successful by comparing mint counts
  useEffect(() => {
    if (isMinting && txHash && userMintedCount > initialMintCount) {
      // Mint count increased, transaction was successful
      toast({
        title: "Minting Complete!",
        description: `Successfully minted ${quantity} edition${quantity > 1 ? 's' : ''} from Chapter 1`,
      });
      
      setTimeout(() => {
        refreshSupplyData();
      }, 1000);
      
      handleClose();
    }
  }, [isMinting, txHash, userMintedCount, initialMintCount, quantity, toast, refreshSupplyData]);

  useEffect(() => {
    if (isConfirmed && txHash) {
      toast({
        title: "Minting Complete!",
        description: `Successfully minted ${quantity} edition${quantity > 1 ? 's' : ''} from Chapter 1`,
      });
      
      setTimeout(() => {
        refreshSupplyData();
      }, 1000);
      
      handleClose();
    }
  }, [isConfirmed, txHash, quantity, toast, refreshSupplyData]);

  useEffect(() => {
    if (confirmError) {
      console.error('Transaction confirmation failed:', confirmError);
      toast({
        title: "Transaction Failed",
        description: "Your transaction was not confirmed on the blockchain",
        variant: "destructive",
      });
      setIsMinting(false);
      setMintStep('selected');
      setTxHash(null);
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
    }
  }, [confirmError, toast, timeoutId]);

  const handleMint = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to mint",
        variant: "destructive",
      });
      return;
    }

    // Ensure we're on Plasma network
    if (!isOnPlasma) {
      try {
        await ensurePlasmaNetwork();
        toast({
          title: "Network Switched",
          description: "Switched to Plasma network. You can now mint.",
        });
        return; // Let user try again after network switch
      } catch (error) {
        toast({
          title: "Network Switch Required",
          description: "Please switch to Plasma network to mint",
          variant: "destructive",
        });
        return;
      }
    }

    if (userMintedCount + quantity > maxMintsPerWallet) {
      toast({
        title: "Mint Limit Exceeded",
        description: `You can only mint ${maxMintsPerWallet} editions total`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsMinting(true);
      setMintStep('claim');
      setInitialMintCount(userMintedCount);
      
      const hash = await mintRandomEditions(quantity);
      setTxHash(hash as unknown as string);
      
      // Set a timeout to handle stuck transactions (30 seconds)
      const timeout = setTimeout(() => {
        if (isMinting) {
          console.log('Transaction timeout - checking if mint was successful by count');
          // Check if mint count increased despite timeout
          if (userMintedCount > initialMintCount) {
            toast({
              title: "Minting Complete!",
              description: `Successfully minted ${quantity} edition${quantity > 1 ? 's' : ''} from Chapter 1`,
            });
            handleClose();
          } else {
            toast({
              title: "Transaction Timeout",
              description: "Transaction is taking longer than expected. Please check your wallet or try again.",
              variant: "destructive",
            });
            setIsMinting(false);
            setMintStep('selected');
            setTxHash(null);
          }
        }
      }, 30000);
      
      setTimeoutId(timeout);
      
    } catch (error) {
      console.error('Minting failed:', error);
      toast({
        title: "Minting Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      setIsMinting(false);
      setMintStep('selected');
      setTxHash(null as unknown as string);
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
    }
  };

  const handleClose = () => {
    setMintStep('selected');
    setIsMinting(false);
    setTxHash(null as string | null);
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    onClose();
  };

  const renderStepContent = () => {
    switch (mintStep) {
      case 'selected':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Ready to Mint
              </h3>
              <p className="text-muted-foreground">
                You will receive {quantity} {quantity === 1 ? 'edition' : 'editions'} from the complete collection
              </p>
            </div>

            <div className="bg-muted/30 p-6 rounded-xl border border-border/30">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Where Money Moves - Chapter 1</h4>
                  <p className="text-sm text-muted-foreground">
                    {quantity} {quantity === 1 ? 'edition' : 'editions'} from 13 historic moments
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setMintStep('claim')}
                className="claim-button flex-1"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet & Claim
              </Button>
            </div>
          </div>
        );

      case 'claim':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              {isMinting ? (
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              ) : (
                <Wallet className="w-8 h-8 text-primary" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {isMinting && !isConfirming ? 'Transaction Submitted' : 
                 isConfirming ? 'Confirming Transaction' : 
                 'Ready to Mint'}
              </h3>
              <p className="text-muted-foreground">
                {isMinting && !isConfirming ? `Transaction submitted! Waiting for confirmation...` :
                 isConfirming ? `Please wait while we confirm your ${quantity} edition${quantity > 1 ? 's' : ''} on the blockchain...` :
                 `You're about to mint ${quantity} random edition${quantity > 1 ? 's' : ''} from Chapter 1`
                }
              </p>
            </div>
            
            {!isMinting && !isConfirming && (
              <div className="flex gap-3">
                <Button
                  onClick={() => setMintStep('selected')}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleMint}
                  className="claim-button flex-1"
                  disabled={!isConnected}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {isConnected ? 'Mint Now' : 'Connect Wallet'}
                </Button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {mintStep === 'selected' ? 'Confirm Your Mint' : 'Minting Process'}
          </DialogTitle>
        </DialogHeader>
        
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
};