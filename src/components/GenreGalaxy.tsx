import { useMemo, useState } from "react";
import { Track } from "@/data/tracks";
import { cn } from "@/lib/utils";

interface GenreGalaxyProps {
  tracks: Track[];
  onSelectTrack: (track: Track) => void;
}

const genreColors: Record<string, string> = {
  Electronic: "#00ffff",
  Synthpop: "#ff00ff",
  Ambient: "#00ff88",
  Dubstep: "#ff6600",
  Jazz: "#ffaa00",
  "Indie Pop": "#88ff00",
  "Lo-Fi": "#00aaff",
  Orchestral: "#ff88ff",
  "Hip Hop": "#ff0066",
  "New Age": "#00ffaa",
  World: "#ffff00",
  Piano: "#ffffff",
  Disco: "#ff00aa",
  "Dark Ambient": "#aa00ff",
  Reggae: "#00ff00",
  Metal: "#ff0000",
  Folk: "#ffcc00",
  Industrial: "#888888",
  "Dream Pop": "#ff88aa",
  EDM: "#00ffff",
  Meditation: "#aaffff",
  Funk: "#ff8800",
  Blues: "#4488ff",
  Trance: "#ff00ff",
  "Smooth Jazz": "#ffaa88",
  Techno: "#00ff66",
  Acoustic: "#ffddaa",
  "Space Rock": "#8800ff",
  Latin: "#ff4400",
  Gothic: "#880088",
};

export function GenreGalaxy({ tracks, onSelectTrack }: GenreGalaxyProps) {
  const [hoveredTrack, setHoveredTrack] = useState<Track | null>(null);

  // Normalize embedding coordinates to fit the canvas
  const normalizedTracks = useMemo(() => {
    return tracks.map((track) => ({
      ...track,
      x: ((track.embedX || 0) + 1) * 50, // Convert from -1..1 to 0..100
      y: ((track.embedY || 0) + 1) * 50,
    }));
  }, [tracks]);

  return (
    <div className="relative w-full h-[400px] rounded-2xl glass-card overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 rounded-full bg-white/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pulse ${2 + Math.random() * 2}s infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Track points */}
      <div className="absolute inset-8">
        {normalizedTracks.map((track) => {
          const color = genreColors[track.genre] || "#ffffff";
          const isHovered = hoveredTrack?.id === track.id;

          return (
            <button
              key={track.id}
              onClick={() => onSelectTrack(track)}
              onMouseEnter={() => setHoveredTrack(track)}
              onMouseLeave={() => setHoveredTrack(null)}
              className={cn(
                "absolute w-3 h-3 rounded-full transition-all duration-300 hover:scale-150",
                isHovered && "z-10"
              )}
              style={{
                left: `${track.x}%`,
                top: `${track.y}%`,
                backgroundColor: color,
                boxShadow: isHovered
                  ? `0 0 20px ${color}, 0 0 40px ${color}`
                  : `0 0 8px ${color}80`,
                transform: `translate(-50%, -50%) ${isHovered ? "scale(1.5)" : "scale(1)"}`,
              }}
            />
          );
        })}
      </div>

      {/* Tooltip */}
      {hoveredTrack && (
        <div
          className="absolute z-20 px-3 py-2 rounded-lg bg-card/95 backdrop-blur-sm border border-border shadow-xl pointer-events-none animate-slide-up"
          style={{
            left: `calc(${((hoveredTrack.embedX || 0) + 1) * 50}% + 2rem)`,
            top: `calc(${((hoveredTrack.embedY || 0) + 1) * 50}% + 2rem)`,
          }}
        >
          <p className="font-semibold text-sm">{hoveredTrack.name}</p>
          <p className="text-xs text-muted-foreground">{hoveredTrack.artist}</p>
          <p className="text-xs mt-1" style={{ color: genreColors[hoveredTrack.genre] }}>
            {hoveredTrack.genre}
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.entries(genreColors)
            .slice(0, 8)
            .map(([genre, color]) => (
              <div key={genre} className="flex items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-muted-foreground">{genre}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Title */}
      <div className="absolute top-4 left-4">
        <h3 className="text-lg font-bold gradient-text">Genre Galaxy</h3>
        <p className="text-xs text-muted-foreground">Click a star to explore</p>
      </div>
    </div>
  );
}
