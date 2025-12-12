import { Track } from "@/data/tracks";
import { findSimilarTracks } from "@/utils/similarity";
import { TrackCardCompact } from "./TrackCard";
import { Sparkles } from "lucide-react";

interface SimilarTracksProps {
  track: Track;
  allTracks: Track[];
  onSelectTrack: (track: Track) => void;
}

export function SimilarTracks({ track, allTracks, onSelectTrack }: SimilarTracksProps) {
  const similarTracks = findSimilarTracks(track, allTracks, 5);

  return (
    <div className="glass-card p-4 rounded-2xl">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Similar to "{track.name}"</h3>
      </div>
      
      <div className="space-y-2">
        {similarTracks.map(({ track: similarTrack, similarity }, index) => (
          <div
            key={similarTrack.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <TrackCardCompact
              track={similarTrack}
              similarity={similarity}
              onClick={() => onSelectTrack(similarTrack)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
