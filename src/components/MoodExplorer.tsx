import { moods, Track } from "@/data/tracks";
import { cn } from "@/lib/utils";

interface MoodExplorerProps {
  tracks: Track[];
  selectedMood: string | null;
  onSelectMood: (mood: string | null) => void;
}

export function MoodExplorer({ tracks, selectedMood, onSelectMood }: MoodExplorerProps) {
  const moodCounts = tracks.reduce((acc, track) => {
    acc[track.mood] = (acc[track.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const moodColorMap: Record<string, string> = {
    happy: "from-neon-lime to-neon-cyan",
    chill: "from-neon-cyan to-neon-purple",
    focus: "from-neon-purple to-neon-magenta",
    dreamy: "from-neon-magenta to-neon-cyan",
    dark: "from-neon-orange to-red-500",
    hype: "from-neon-magenta to-neon-orange",
  };

  const moodGlowMap: Record<string, string> = {
    happy: "hover:shadow-[0_0_30px_hsla(85,100%,50%,0.4)]",
    chill: "hover:shadow-[0_0_30px_hsla(180,100%,50%,0.4)]",
    focus: "hover:shadow-[0_0_30px_hsla(280,100%,65%,0.4)]",
    dreamy: "hover:shadow-[0_0_30px_hsla(320,100%,60%,0.4)]",
    dark: "hover:shadow-[0_0_30px_hsla(25,100%,55%,0.4)]",
    hype: "hover:shadow-[0_0_30px_hsla(320,100%,60%,0.4)]",
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {moods.map((mood, index) => {
        const count = moodCounts[mood.id] || 0;
        const isSelected = selectedMood === mood.id;
        
        return (
          <button
            key={mood.id}
            onClick={() => onSelectMood(isSelected ? null : mood.id)}
            className={cn(
              "relative p-4 rounded-2xl glass-card transition-all duration-300 animate-slide-up overflow-hidden group",
              isSelected && "ring-2 ring-white/50 scale-105",
              moodGlowMap[mood.id]
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Background gradient */}
            <div 
              className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-20 group-hover:opacity-40 transition-opacity",
                moodColorMap[mood.id]
              )}
            />
            
            {/* Animated background on selection */}
            {isSelected && (
              <div 
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-30 animate-pulse",
                  moodColorMap[mood.id]
                )}
              />
            )}
            
            <div className="relative text-center">
              <div className="text-3xl mb-2 group-hover:animate-float">
                {mood.emoji}
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                {mood.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-2">
                {mood.description}
              </p>
              <div className="text-xs font-mono text-muted-foreground">
                {count} tracks
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
