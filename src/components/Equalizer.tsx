import { cn } from "@/lib/utils";

interface EqualizerProps {
  bars?: number;
  className?: string;
  variant?: "cyan" | "magenta" | "lime" | "gradient";
}

export function Equalizer({ bars = 5, className, variant = "cyan" }: EqualizerProps) {
  const colorClasses = {
    cyan: "bg-neon-cyan",
    magenta: "bg-neon-magenta",
    lime: "bg-neon-lime",
    gradient: "bg-gradient-to-t from-neon-cyan to-neon-magenta",
  };

  return (
    <div className={cn("flex items-end gap-1 h-8", className)}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1.5 rounded-full",
            colorClasses[variant],
            i % 2 === 0 ? "animate-equalizer" : "animate-equalizer-alt"
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            height: "100%",
          }}
        />
      ))}
    </div>
  );
}
