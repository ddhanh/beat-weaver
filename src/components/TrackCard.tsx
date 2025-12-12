import { Track, moods } from "@/data/tracks";
import { VinylRecord } from "./VinylRecord";
import { AudioFeatureChart } from "./AudioFeatureChart";
import { Play, Pause, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioPlayerContext } from "@/contexts/AudioPlayerContext";

interface TrackCardProps {
  track: Track;
  onClick?: () => void;
  isSelected?: boolean;
  showFeatures?: boolean;
  className?: string;
}

export function TrackCard({ track, onClick, isSelected, showFeatures = false, className }: TrackCardProps) {
  const mood = moods.find((m) => m.id === track.mood);
  const { isPlaying, currentTrackId, toggle } = useAudioPlayerContext();
  
  const isCurrentlyPlaying = isPlaying && currentTrackId === track.id;
  
  const moodColors: Record<string, string> = {
    happy: "from-neon-lime/20 to-neon-cyan/20",
    chill: "from-neon-cyan/20 to-neon-purple/20",
    focus: "from-neon-purple/20 to-neon-magenta/20",
    dreamy: "from-neon-magenta/20 to-neon-cyan/20",
    dark: "from-neon-orange/20 to-neon-magenta/20",
    hype: "from-neon-magenta/20 to-neon-orange/20",
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (track.audioUrl) {
      toggle(track.id, track.audioUrl);
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative p-4 rounded-2xl glass-card cursor-pointer transition-all duration-300 hover:scale-[1.02]",
        isSelected && "ring-2 ring-primary neon-glow-cyan",
        isCurrentlyPlaying && "ring-2 ring-neon-lime neon-glow-lime",
        className
      )}
    >
      {/* Background gradient based on mood */}
      <div 
        className={cn(
          "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          moodColors[track.mood] || moodColors.chill
        )}
      />
      
      <div className="relative">
        <div className="flex items-start gap-4">
          {/* Vinyl or Icon */}
          <div className="relative flex-shrink-0">
            <VinylRecord size="sm" spinning={isCurrentlyPlaying} />
            <button 
              onClick={handlePlayClick}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <div className={cn(
                "p-2 rounded-full transition-all duration-200 hover:scale-110",
                isCurrentlyPlaying 
                  ? "bg-neon-lime text-background" 
                  : "bg-primary/90 text-primary-foreground"
              )}>
                {isCurrentlyPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
              </div>
            </button>
          </div>
          
          {/* Track info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {track.name}
              </h3>
              {isCurrentlyPlaying && (
                <div className="flex items-center gap-0.5">
                  <span className="w-1 h-3 bg-neon-lime rounded-full animate-equalizer" style={{ animationDelay: "0ms" }} />
                  <span className="w-1 h-3 bg-neon-lime rounded-full animate-equalizer" style={{ animationDelay: "150ms" }} />
                  <span className="w-1 h-3 bg-neon-lime rounded-full animate-equalizer" style={{ animationDelay: "300ms" }} />
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {track.artist}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                {track.genre}
              </span>
              {mood && (
                <span className="text-sm">
                  {mood.emoji}
                </span>
              )}
              <span className="text-xs text-muted-foreground font-mono">
                {track.year}
              </span>
            </div>
          </div>
        </div>
        
        {/* Audio features (expandable) */}
        {showFeatures && (
          <div className="mt-4 pt-4 border-t border-border">
            <AudioFeatureChart track={track} />
          </div>
        )}
      </div>
    </div>
  );
}

// Compact version for lists
export function TrackCardCompact({ track, onClick, similarity }: { 
  track: Track; 
  onClick?: () => void;
  similarity?: number;
}) {
  const { isPlaying, currentTrackId, toggle } = useAudioPlayerContext();
  const isCurrentlyPlaying = isPlaying && currentTrackId === track.id;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (track.audioUrl) {
      toggle(track.id, track.audioUrl);
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl glass-card cursor-pointer hover:bg-muted/50 transition-all group",
        isCurrentlyPlaying && "ring-1 ring-neon-lime"
      )}
    >
      <button 
        onClick={handlePlayClick}
        className={cn(
          "p-2 rounded-lg transition-colors",
          isCurrentlyPlaying 
            ? "bg-neon-lime/20 text-neon-lime" 
            : "bg-muted group-hover:bg-primary/20 text-muted-foreground group-hover:text-primary"
        )}
      >
        {isCurrentlyPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Music2 className="w-4 h-4" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm truncate">{track.name}</p>
          {isCurrentlyPlaying && (
            <div className="flex items-center gap-0.5">
              <span className="w-0.5 h-2 bg-neon-lime rounded-full animate-equalizer" style={{ animationDelay: "0ms" }} />
              <span className="w-0.5 h-2 bg-neon-lime rounded-full animate-equalizer" style={{ animationDelay: "150ms" }} />
              <span className="w-0.5 h-2 bg-neon-lime rounded-full animate-equalizer" style={{ animationDelay: "300ms" }} />
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
      </div>
      {similarity !== undefined && (
        <div className="text-xs font-mono text-primary">
          {Math.round(similarity * 100)}%
        </div>
      )}
    </div>
  );
}
