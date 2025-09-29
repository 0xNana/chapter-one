import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Sparkles, ExternalLink, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { type EditionData } from "@/utils/metadataLoader";

interface EditionModalProps {
  edition: EditionData | null;
  open: boolean;
  onClose: () => void;
  onClaim: () => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const EditionModal = ({ edition, open, onClose }: EditionModalProps) => {
  if (!edition) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border/50 shadow-premium">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="outline" className="text-sm font-medium">
              Edition #{edition.id.toString().padStart(2, '0')}
            </Badge>
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
          <div className="gradient-gold-subtle p-6 rounded-xl border border-primary/20">
            <h5 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              The Lore
            </h5>
            <p className="text-foreground/90 italic leading-relaxed">
              "{edition.lore}"
            </p>
          </div>

          {edition.externalUrl && (
            <div className="flex justify-center pt-4">
              <Button 
                variant="outline" 
                className="border-border/50"
                onClick={() => window.open(edition.externalUrl, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Learn More
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};