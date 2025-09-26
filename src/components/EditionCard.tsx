import { Calendar, Users, Sparkles, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

interface EditionCardProps {
  edition: Edition;
  onClick: () => void;
  animationDelay?: number;
  compact?: boolean;
}

const rarityColors: Record<string, string> = {
  'Mythical': 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30',
  'Legendary': 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
  'Epic': 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  'Rare': 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30'
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const EditionCard = ({ edition, onClick, animationDelay = 0, compact = false }: EditionCardProps) => {
  const isAvailable = edition.mintCount < edition.totalSupply;
  const isSoldOut = edition.mintCount >= edition.totalSupply;
  const isComingSoon = edition.mintCount === 0 && edition.id === 13;
  
  const rarityBg = rarityColors[edition.rarity] || 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 border-gray-500/30';

  return (
    <div
      className={`edition-card cursor-pointer animate-fade-in-up ${compact ? 'p-4' : 'p-6'} ${rarityBg}`}
      onClick={onClick}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`flex items-center gap-2 ${compact ? 'text-sm' : ''}`}>
          <Badge variant="outline" className="text-xs font-medium">
            #{edition.id.toString().padStart(2, '0')}
          </Badge>
          <Badge 
            variant="secondary" 
            className={`text-xs ${edition.rarity === 'Mythical' ? 'text-purple-400' : edition.rarity === 'Legendary' ? 'text-yellow-400' : edition.rarity === 'Epic' ? 'text-blue-400' : 'text-green-400'}`}
          >
            {edition.rarity}
          </Badge>
        </div>
        
        {isComingSoon && (
          <Badge variant="outline" className="text-xs bg-muted/50">
            <Clock className="w-3 h-3 mr-1" />
            Coming Soon
          </Badge>
        )}
        
        {isSoldOut && (
          <Badge variant="destructive" className="text-xs">
            Sold Out
          </Badge>
        )}
      </div>

      {/* Title */}
      <h3 className={`font-bold text-foreground mb-2 ${compact ? 'text-lg' : 'text-xl'}`}>
        {edition.title}
      </h3>

      {/* Date */}
      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
        <Calendar className="w-4 h-4" />
        {formatDate(edition.date)}
      </div>

      {/* Headline */}
      <p className={`text-foreground/80 font-medium mb-3 ${compact ? 'text-sm' : ''}`}>
        {edition.headline}
      </p>

      {/* Stat */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-primary font-medium text-sm">{edition.stat}</span>
      </div>

      {/* Mint Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <Users className="w-3 h-3" />
            Minted
          </span>
          <span className="text-foreground font-medium">
            {edition.mintCount.toLocaleString()} / {edition.totalSupply.toLocaleString()}
          </span>
        </div>
        
        <div className="w-full bg-muted/50 rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500"
            style={{ width: `${(edition.mintCount / edition.totalSupply) * 100}%` }}
          />
        </div>
        
        {!compact && (
          <p className="text-xs text-muted-foreground leading-relaxed mt-3">
            {edition.description}
          </p>
        )}
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100 rounded-xl pointer-events-none" />
    </div>
  );
};