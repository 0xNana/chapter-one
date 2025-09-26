import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Sparkles, ExternalLink, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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

interface EditionModalProps {
  edition: Edition | null;
  open: boolean;
  onClose: () => void;
  onClaim: () => void;
}

const rarityColors: Record<string, string> = {
  'Mythical': 'text-purple-400',
  'Legendary': 'text-yellow-400', 
  'Epic': 'text-blue-400',
  'Rare': 'text-green-400'
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const EditionModal = ({ edition, open, onClose, onClaim }: EditionModalProps) => {
  if (!edition) return null;

  const isAvailable = edition.mintCount < edition.totalSupply;
  const isSoldOut = edition.mintCount >= edition.totalSupply;
  const isComingSoon = edition.mintCount === 0 && edition.id === 13;
  const progressPercent = (edition.mintCount / edition.totalSupply) * 100;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border/50 shadow-premium">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="outline" className="text-sm font-medium">
              Edition #{edition.id.toString().padStart(2, '0')}
            </Badge>
            <Badge 
              variant="secondary" 
              className={`text-sm ${rarityColors[edition.rarity]}`}
            >
              {edition.rarity}
            </Badge>
            {isComingSoon && (
              <Badge variant="outline" className="text-sm bg-muted/50">
                Coming Soon
              </Badge>
            )}
            {isSoldOut && (
              <Badge variant="destructive" className="text-sm">
                Sold Out
              </Badge>
            )}
          </div>
          
          <DialogTitle className="text-3xl font-bold text-foreground">
            {edition.title}
          </DialogTitle>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {formatDate(edition.date)}
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Headline */}
          <div>
            <h4 className="text-xl font-semibold text-foreground mb-2">
              {edition.headline}
            </h4>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">{edition.stat}</span>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Description */}
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">Historical Context</h5>
            <p className="text-foreground/80 leading-relaxed">
              {edition.description}
            </p>
          </div>

          {/* Lore */}
          <div className="gradient-gold-subtle p-6 rounded-xl border border-primary/20">
            <h5 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              The Lore
            </h5>
            <p className="text-foreground/90 italic leading-relaxed">
              "{edition.lore}"
            </p>
          </div>

          {/* Mint Statistics */}
          <div className="bg-muted/30 p-6 rounded-xl">
            <h5 className="text-lg font-medium text-foreground mb-4">Collection Stats</h5>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Minted
                </span>
                <span className="text-foreground font-bold text-lg">
                  {edition.mintCount.toLocaleString()} / {edition.totalSupply.toLocaleString()}
                </span>
              </div>
              
              <div className="w-full bg-muted/50 rounded-full h-3">
                <div 
                  className="h-3 rounded-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500 shadow-glow"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {progressPercent.toFixed(1)}% Complete
                </span>
                <span className="text-muted-foreground">
                  {(edition.totalSupply - edition.mintCount).toLocaleString()} Remaining
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClaim}
              disabled={!isAvailable}
              className="claim-button flex-1"
            >
              {isComingSoon ? 'Notify Me' : isSoldOut ? 'Sold Out' : 'Claim This Edition'}
            </Button>
            
            <Button variant="outline" size="icon" className="border-border/50">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};