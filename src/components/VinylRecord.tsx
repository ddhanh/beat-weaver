import { cn } from "@/lib/utils";

interface VinylRecordProps {
  size?: "sm" | "md" | "lg";
  spinning?: boolean;
  className?: string;
  coverColor?: string;
}

export function VinylRecord({ 
  size = "md", 
  spinning = true, 
  className,
  coverColor = "neon-magenta"
}: VinylRecordProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {/* Outer vinyl */}
      <div
        className={cn(
          "absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-gray-700",
          spinning && "animate-vinyl-spin"
        )}
      >
        {/* Grooves */}
        <div className="absolute inset-2 rounded-full border border-gray-700/50" />
        <div className="absolute inset-4 rounded-full border border-gray-700/50" />
        <div className="absolute inset-6 rounded-full border border-gray-700/50" />
        
        {/* Center label */}
        <div 
          className={cn(
            "absolute inset-0 m-auto w-1/3 h-1/3 rounded-full",
            `bg-${coverColor}`
          )}
          style={{
            background: coverColor.startsWith("neon") 
              ? `hsl(var(--${coverColor}))` 
              : coverColor
          }}
        >
          {/* Center hole */}
          <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-gray-900" />
        </div>
      </div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
    </div>
  );
}
