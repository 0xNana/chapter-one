import { Badge } from "@/components/ui/badge";
import { Trophy, Target } from "lucide-react";

export const ProgressTracker = () => {
  // Mock user progress - in real app, this would come from user state
  const mintedCount: number = 5;
  const totalEditions: number = 13;
  const progressPercent = (mintedCount / totalEditions) * 100;

  return (
    <div className="flex items-center gap-4">
      {/* Progress Display */}
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-primary" />
        <span className="text-sm text-muted-foreground">Your Progress</span>
        <Badge variant="outline" className="font-medium">
          {mintedCount}/{totalEditions}
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-3">
        <div className="w-24 bg-muted/50 rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {progressPercent.toFixed(0)}%
        </span>
      </div>

      {/* Collection Status */}
      {mintedCount === totalEditions && (
        <Badge className="bg-gradient-primary text-primary-foreground">
          <Target className="w-3 h-3 mr-1" />
          Complete
        </Badge>
      )}
    </div>
  );
};