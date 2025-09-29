import { Calendar, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type EditionData } from "@/utils/metadataLoader";

interface EditionCardProps {
  edition: EditionData;
  onClick: () => void;
  animationDelay?: number;
  compact?: boolean;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const EditionCard = ({ edition, onClick, animationDelay = 0, compact = false }: EditionCardProps) => {
  const cardBg = 'bg-gradient-to-r from-muted/20 to-muted/30 border-border/30';

  return (
    <div
      className={`edition-card cursor-pointer animate-fade-in-up ${compact ? 'p-4' : 'p-6'} ${cardBg}`}
      onClick={onClick}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`flex items-center gap-2 ${compact ? 'text-sm' : ''}`}>
          <Badge variant="outline" className="text-xs font-medium">
            #{edition.id.toString().padStart(2, '0')}
          </Badge>
        </div>
        
      </div>

      <h3 className={`font-bold text-foreground mb-2 ${compact ? 'text-lg' : 'text-xl'}`}>
        {edition.title}
      </h3>

      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
        <Calendar className="w-4 h-4" />
        {formatDate(edition.date)}
      </div>

      <p className={`text-foreground/80 font-medium mb-3 ${compact ? 'text-sm' : ''}`}>
        {edition.headline}
      </p>

      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-primary font-medium text-sm">{edition.stat}</span>
      </div>


      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100 rounded-xl pointer-events-none" />
    </div>
  );
};