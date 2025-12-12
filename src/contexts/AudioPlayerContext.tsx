import { createContext, useContext, ReactNode } from "react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

interface AudioPlayerContextType {
  isPlaying: boolean;
  currentTrackId: string | null;
  progress: number;
  duration: number;
  play: (trackId: string, audioUrl: string) => void;
  pause: () => void;
  toggle: (trackId: string, audioUrl: string) => void;
  seek: (time: number) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const audioPlayer = useAudioPlayer();

  return (
    <AudioPlayerContext.Provider value={audioPlayer}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayerContext() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayerContext must be used within AudioPlayerProvider");
  }
  return context;
}
