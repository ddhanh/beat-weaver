import { Equalizer } from "./Equalizer";
import { Music, Disc3, Radio, Headphones } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative py-16 md:py-24 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-neon-cyan/20 blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-neon-magenta/20 blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-neon-purple/10 blur-3xl animate-pulse-glow" style={{ animationDelay: "0.5s" }} />
        
        {/* Floating icons */}
        <div className="absolute top-20 left-[10%] animate-float" style={{ animationDelay: "0s" }}>
          <Music className="w-8 h-8 text-neon-cyan/30" />
        </div>
        <div className="absolute top-32 right-[15%] animate-float" style={{ animationDelay: "0.5s" }}>
          <Disc3 className="w-10 h-10 text-neon-magenta/30" />
        </div>
        <div className="absolute bottom-20 left-[20%] animate-float" style={{ animationDelay: "1s" }}>
          <Radio className="w-6 h-6 text-neon-lime/30" />
        </div>
        <div className="absolute bottom-32 right-[10%] animate-float" style={{ animationDelay: "1.5s" }}>
          <Headphones className="w-8 h-8 text-neon-purple/30" />
        </div>
      </div>

      <div className="relative container mx-auto px-4 text-center">
        {/* Equalizer decoration */}
        <div className="flex justify-center gap-8 mb-8">
          <Equalizer bars={4} variant="cyan" className="h-12" />
          <Equalizer bars={5} variant="magenta" className="h-16" />
          <Equalizer bars={4} variant="lime" className="h-12" />
        </div>

        {/* Main title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6">
          <span className="gradient-text">Discover Your</span>
          <br />
          <span className="text-foreground">Sound Universe</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Explore tracks through audio features, find similar music, 
          and dive into a galaxy of genres and moods.
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-8 md:gap-16">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold font-mono text-primary">30+</div>
            <div className="text-sm text-muted-foreground">Tracks</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold font-mono text-secondary">6</div>
            <div className="text-sm text-muted-foreground">Moods</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold font-mono text-accent">20+</div>
            <div className="text-sm text-muted-foreground">Genres</div>
          </div>
        </div>
      </div>
    </div>
  );
}
