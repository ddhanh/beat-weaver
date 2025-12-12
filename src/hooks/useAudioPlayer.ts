import { useState, useRef, useCallback, useEffect } from "react";

interface UseAudioPlayerReturn {
  isPlaying: boolean;
  currentTrackId: string | null;
  progress: number;
  duration: number;
  play: (trackId: string, audioUrl: string) => void;
  pause: () => void;
  toggle: (trackId: string, audioUrl: string) => void;
  seek: (time: number) => void;
}

export function useAudioPlayer(): UseAudioPlayerReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = 0.7;

    const audio = audioRef.current;

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setProgress(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    });

    audio.addEventListener("error", (e) => {
      console.error("Audio error:", e);
      setIsPlaying(false);
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Update progress animation
  const updateProgress = useCallback(() => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      animationRef.current = requestAnimationFrame(updateProgress);
    }
  }, []);

  const play = useCallback((trackId: string, audioUrl: string) => {
    if (!audioRef.current) return;

    // If different track, load new source
    if (currentTrackId !== trackId) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      setCurrentTrackId(trackId);
      setProgress(0);
    }

    audioRef.current.play().then(() => {
      setIsPlaying(true);
      animationRef.current = requestAnimationFrame(updateProgress);
    }).catch((error) => {
      console.error("Playback failed:", error);
    });
  }, [currentTrackId, updateProgress]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  const toggle = useCallback((trackId: string, audioUrl: string) => {
    if (isPlaying && currentTrackId === trackId) {
      pause();
    } else {
      play(trackId, audioUrl);
    }
  }, [isPlaying, currentTrackId, play, pause]);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setProgress(time);
  }, []);

  return {
    isPlaying,
    currentTrackId,
    progress,
    duration,
    play,
    pause,
    toggle,
    seek,
  };
}
