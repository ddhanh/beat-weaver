import { Track } from "@/data/tracks";
import { cn } from "@/lib/utils";

interface AudioFeatureChartProps {
  track: Track;
  className?: string;
}

const features = [
  { key: "energy", label: "Energy", color: "neon-magenta" },
  { key: "valence", label: "Valence", color: "neon-lime" },
  { key: "danceability", label: "Dance", color: "neon-cyan" },
  { key: "acousticness", label: "Acoustic", color: "neon-orange" },
  { key: "instrumentalness", label: "Instrumental", color: "neon-purple" },
] as const;

export function AudioFeatureChart({ track, className }: AudioFeatureChartProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {features.map((feature, index) => {
        const value = track[feature.key] as number;
        return (
          <div
            key={feature.key}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground font-medium">
                {feature.label}
              </span>
              <span className="text-sm font-mono text-foreground">
                {Math.round(value * 100)}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700 ease-out",
                  `bg-${feature.color}`
                )}
                style={{ 
                  width: `${value * 100}%`,
                  background: `hsl(var(--${feature.color}))`,
                  boxShadow: `0 0 10px hsl(var(--${feature.color}) / 0.5)`
                }}
              />
            </div>
          </div>
        );
      })}
      
      {/* Tempo and Loudness */}
      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-bold font-mono text-primary">
            {Math.round(track.tempo)}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">
            BPM
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold font-mono text-secondary">
            {track.loudness.toFixed(1)}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">
            dB
          </div>
        </div>
      </div>
    </div>
  );
}
