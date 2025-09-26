import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  Zap, 
  CheckCircle, 
  Clock, 
  Wallet, 
  ExternalLink,
  Plus,
  Minus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Edition {
  id: number;
  title: string;
  date: string;
  headline: string;
  stat: string;
  description: string;
  lore: string;
  mintCount: number;
  totalSupply: number;
  rarity: string;
}

interface ClaimFlowProps {
  open: boolean;
  onClose: () => void;
  editions: Edition[];
  selectedEdition?: Edition | null;
}

export const ClaimFlow = ({ open, onClose, editions, selectedEdition }: ClaimFlowProps) => {
  const { toast } = useToast();
  const [selectedEditions, setSelectedEditions] = useState<Record<number, number>>({});
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintStep, setMintStep] = useState<'select' | 'confirm' | 'minting' | 'success'>('select');

  // Initialize with selected edition if provided
  useEffect(() => {
    if (selectedEdition && open) {
      setSelectedEditions({ [selectedEdition.id]: 1 });
    }
  }, [selectedEdition, open]);

  const availableEditions = editions.filter(e => e.mintCount < e.totalSupply && e.id !== 13);
  
  const updateQuantity = (editionId: number, delta: number) => {
    setSelectedEditions(prev => {
      const current = prev[editionId] || 0;
      const newQuantity = Math.max(0, Math.min(5, current + delta)); // Max 5 per edition
      
      if (newQuantity === 0) {
        const { [editionId]: removed, ...rest } = prev;
        return rest;
      }
      
      return { ...prev, [editionId]: newQuantity };
    });
  };

  const totalItems = Object.values(selectedEditions).reduce((sum, qty) => sum + qty, 0);
  const totalCost = totalItems * 0.05; // 0.05 ETH per edition

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnecting(false);
      setMintStep('confirm');
      toast({
        title: "Wallet Connected",
        description: "Ready to mint your collection",
      });
    }, 1500);
  };

  const handleMint = async () => {
    setMintStep('minting');
    setIsMinting(true);
    
    // Simulate minting process
    setTimeout(() => {
      setIsMinting(false);
      setMintStep('success');
      toast({
        title: "Minting Complete!",
        description: `Successfully minted ${totalItems} edition${totalItems > 1 ? 's' : ''} from Chapter 1`,
      });
    }, 3000);
  };

  const handleClose = () => {
    setSelectedEditions({});
    setMintStep('select');
    setIsMinting(false);
    onClose();
  };

  const renderStepContent = () => {
    switch (mintStep) {
      case 'select':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Select Your Editions
              </h3>
              <p className="text-muted-foreground">
                Choose which pieces of financial history to claim
              </p>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {availableEditions.map((edition) => {
                const quantity = selectedEditions[edition.id] || 0;
                const isSelected = quantity > 0;
                
                return (
                  <Card key={edition.id} className={`p-4 transition-all ${isSelected ? 'border-primary/50 bg-primary/5' : 'border-border/50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            #{edition.id.toString().padStart(2, '0')}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {edition.rarity}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-foreground">{edition.title}</h4>
                        <p className="text-sm text-muted-foreground">{edition.headline}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">0.05 ETH</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(edition.id, -1)}
                            disabled={quantity === 0}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(edition.id, 1)}
                            disabled={quantity >= 5}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {totalItems > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">Total</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">{totalCost.toFixed(3)} ETH</div>
                      <div className="text-sm text-muted-foreground">{totalItems} edition{totalItems > 1 ? 's' : ''}</div>
                    </div>
                  </div>
                  
                  <Button onClick={handleConnectWallet} disabled={isConnecting} className="w-full claim-button">
                    <Wallet className="w-4 h-4 mr-2" />
                    {isConnecting ? 'Connecting...' : 'Connect Wallet & Continue'}
                  </Button>
                </div>
              </>
            )}
          </div>
        );

      case 'confirm':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Confirm Your Mint
              </h3>
              <p className="text-muted-foreground">
                Review your selection before minting
              </p>
            </div>

            <Card className="p-6 bg-muted/30">
              <h4 className="font-medium text-foreground mb-4">Selected Editions</h4>
              <div className="space-y-3">
                {Object.entries(selectedEditions).map(([editionId, quantity]) => {
                  const edition = editions.find(e => e.id === parseInt(editionId))!;
                  return (
                    <div key={editionId} className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{edition.title}</span>
                        <span className="text-sm text-muted-foreground ml-2">x{quantity}</span>
                      </div>
                      <span className="font-medium">{(0.05 * quantity).toFixed(3)} ETH</span>
                    </div>
                  );
                })}
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span>{totalCost.toFixed(3)} ETH</span>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setMintStep('select')} className="flex-1">
                Back
              </Button>
              <Button onClick={handleMint} className="flex-1 claim-button">
                <Zap className="w-4 h-4 mr-2" />
                Mint Now
              </Button>
            </div>
          </div>
        );

      case 'minting':
        return (
          <div className="space-y-6 text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Minting In Progress
              </h3>
              <p className="text-muted-foreground">
                Your transaction is being processed on-chain...
              </p>
            </div>
            <div className="animate-shimmer h-2 bg-muted/50 rounded-full" />
          </div>
        );

      case 'success':
        return (
          <div className="space-y-6 text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto animate-fade-in-up" />
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-2">
                Minting Complete!
              </h3>
              <p className="text-muted-foreground text-lg">
                You've successfully claimed {totalItems} edition{totalItems > 1 ? 's' : ''} from Chapter 1
              </p>
            </div>
            
            <Card className="p-6 bg-gradient-gold-subtle">
              <h4 className="font-medium text-foreground mb-3">Your New Collection</h4>
              <div className="space-y-2">
                {Object.entries(selectedEditions).map(([editionId, quantity]) => {
                  const edition = editions.find(e => e.id === parseInt(editionId))!;
                  return (
                    <div key={editionId} className="flex items-center justify-between">
                      <span>{edition.title}</span>
                      <Badge>{quantity}x</Badge>
                    </div>
                  );
                })}
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on OpenSea
              </Button>
              <Button onClick={handleClose} className="flex-1 claim-button">
                Close
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-card border-border/50 shadow-premium">
        <DialogHeader>
          <DialogTitle className="chapter-title text-2xl">
            Claim Your Chapter
          </DialogTitle>
        </DialogHeader>

        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
};