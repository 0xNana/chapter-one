import { useState, useEffect } from "react";
import { EditionCard } from "./EditionCard";
import { EditionModal } from "./EditionModal";
import { Button } from "@/components/ui/button";
import { TrendingUp, Loader2 } from "lucide-react";
import { loadAllEditions, getFallbackEditions, type EditionData } from "@/utils/metadataLoader";
import { useWMMContract } from "@/hooks/useWMMContract";
import { useAccount, useConnect, useWaitForTransactionReceipt } from "wagmi";
import { useToast } from "@/hooks/use-toast";
import { useNetworkSwitch } from "@/hooks/useNetworkSwitch";

export const EditionSelector = () => {
  const [editions, setEditions] = useState<EditionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEdition, setSelectedEdition] = useState<EditionData | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [initialMintCount, setInitialMintCount] = useState<number>(0);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const quantity = 1; 
  
  const { toast } = useToast();
  const { isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { maxMintsPerWallet, userMintedCount, canUserMint, mintRandomEditions, refreshSupplyData } = useWMMContract();
  const { isOnPlasma, ensurePlasmaNetwork } = useNetworkSwitch();
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: confirmError } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}` | undefined,
    query: {
      enabled: !!txHash && !!txHash.startsWith('0x'),
    }
  });

  useEffect(() => {
    if (isMinting && txHash && userMintedCount > initialMintCount) {
      toast({
        title: "Minting Complete!",
        description: `Successfully minted ${quantity} edition from Chapter 1`,
      });
      
      setTimeout(() => {
        refreshSupplyData();
      }, 1000);
      
      setIsMinting(false);
      setTxHash(null as unknown as string);
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
    }
  }, [isMinting, txHash, userMintedCount, initialMintCount, quantity, toast, refreshSupplyData, timeoutId]);

  useEffect(() => {
    if (isConfirmed && txHash) {
      toast({
        title: "Minting Complete!",
        description: `Successfully minted ${quantity} edition from Chapter 1`,
      });
      
      setTimeout(() => {
        refreshSupplyData();
      }, 1000);
      
      setIsMinting(false);
      setTxHash(null as unknown as string);
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
    }
  }, [isConfirmed, txHash, quantity, toast, refreshSupplyData, timeoutId]);

  useEffect(() => {
    if (confirmError) {
      console.error('Transaction confirmation failed:', confirmError);
      toast({
        title: "Transaction Failed",
        description: "Your transaction was not confirmed on the blockchain",
        variant: "destructive",
      });
      setIsMinting(false);
      setTxHash(null as unknown as string);
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
    }
  }, [confirmError, toast, timeoutId]);

  const handleConnectAndMint = async () => {
    if (!isConnected) {
      try {
        const primaryConnector = connectors[0];
        await connect({ connector: primaryConnector });
        toast({
          title: "Wallet Connected",
          description: "Your wallet has been connected successfully",
        });
      } catch (error) {
        toast({
          title: "Connection Failed",
          description: "Failed to connect wallet. Please try again.",
          variant: "destructive",
        });
      }
      return;
    }

    if (!isOnPlasma) {
      try {
        await ensurePlasmaNetwork();
        toast({
          title: "Network Switched",
          description: "Switched to Plasma network. You can now mint.",
        });
        return;
      } catch (error) {
        toast({
          title: "Network Switch Required",
          description: "Please switch to Plasma network to mint",
          variant: "destructive",
        });
        return;
      }
    }
    try {
      setIsMinting(true);
      setInitialMintCount(userMintedCount);
      
      const hash = await mintRandomEditions(quantity);
      setTxHash(hash as unknown as string);
      
      const timeout = setTimeout(() => {
        if (isMinting) {
          console.log('Transaction timeout - checking if mint was successful by count');
          if (userMintedCount > initialMintCount) {
            toast({
              title: "Minting Complete!",
              description: `Successfully minted ${quantity} edition from Chapter 1`,
            });
            setIsMinting(false);
            setTxHash(null as unknown as string);
          } else {
            toast({
              title: "Transaction Timeout",
              description: "Transaction is taking longer than expected. Please check your wallet or try again.",
              variant: "destructive",
            });
            setIsMinting(false);
            setTxHash(null as unknown as string);
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
      setTxHash(null);
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
    }
  };

  useEffect(() => {
    const loadEditions = async () => {
      try {
        setLoading(true);
        const loadedEditions = await loadAllEditions();
        if (loadedEditions.length > 0) {
          setEditions(loadedEditions);
        } else {
          setEditions(getFallbackEditions());
        }
      } catch (error) {
        console.error('Failed to load editions:', error);
        setEditions(getFallbackEditions());
      } finally {
        setLoading(false);
      }
    };

    loadEditions();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading Where Money Moves editions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        {!canUserMint ? (
          <div className="space-y-3">
            <p className="text-muted-foreground">You've reached the maximum mint limit</p>
            <Button disabled className="text-lg px-12 py-6">
              <TrendingUp className="w-5 h-5 mr-2" />
              Max Mints Reached
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Button
              onClick={handleConnectAndMint}
              disabled={isPending || isMinting || isConfirming}
              className="claim-button text-lg px-12 py-6"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Connecting to wallet...
                </>
              ) : isMinting || isConfirming ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isMinting && !isConfirming ? 'Minting...' : 'Confirming...'}
                </>
              ) : !isConnected ? (
                <>
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Connect & Mint
                </>
              ) : !isOnPlasma ? (
                <>
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Switch to Plasma & Mint
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Mint Your History
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground">
              Get 1 edition from the complete collection
            </p>
            {isConnected && (
              <p className="text-xs text-muted-foreground">
                You've minted {userMintedCount}/{maxMintsPerWallet} editions
              </p>
            )}
          </div>
        )}
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {editions.map((edition, index) => (
            <EditionCard
              key={edition.id}
              edition={edition}
              onClick={() => setSelectedEdition(edition)}
              animationDelay={index * 100}
            />
          ))}
        </div>

      <EditionModal
        edition={selectedEdition}
        open={!!selectedEdition}
        onClose={() => setSelectedEdition(null)}
        onClaim={() => {
          setSelectedEdition(null);
          handleConnectAndMint();
        }}
      />
    </div>
  );
};