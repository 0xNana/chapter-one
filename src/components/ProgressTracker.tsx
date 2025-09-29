import { Badge } from "@/components/ui/badge";
import { Trophy, Target } from "lucide-react";
import { useWMMContract } from "@/hooks/useWMMContract";
import { useAccount } from "wagmi";

export const ProgressTracker = () => {
  const { isConnected } = useAccount();
  const { userMintedCount, maxMintsPerWallet, totalMinted, maxSupply } = useWMMContract();
  
  const progressPercent = maxSupply > 0 ? (totalMinted / maxSupply) * 100 : 0;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-primary" />
        <span className="text-sm text-muted-foreground">Minting Progress</span>
        <Badge variant="outline" className="font-medium">
          {totalMinted.toLocaleString()}/{maxSupply.toLocaleString()}
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-24 bg-muted/50 rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {progressPercent.toFixed(1)}%
        </span>
      </div>

      {isConnected && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Your mints:</span>
          <Badge variant="secondary" className="text-xs">
            {userMintedCount}/{maxMintsPerWallet}
          </Badge>
        </div>
      )}

      {totalMinted >= maxSupply && (
        <Badge className="bg-gradient-primary text-primary-foreground">
          <Target className="w-3 h-3 mr-1" />
          Minting Complete
        </Badge>
      )}
    </div>
  );
};