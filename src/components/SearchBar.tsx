import { useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search tracks, artists, moods...", className }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={cn(
        "relative group",
        className
      )}
    >
      {/* Glow effect */}
      <div 
        className={cn(
          "absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-cyan opacity-0 blur-sm transition-opacity duration-300",
          isFocused && "opacity-75"
        )}
      />
      
      {/* Search container */}
      <div className={cn(
        "relative flex items-center gap-3 px-5 py-4 rounded-2xl glass-card transition-all duration-300",
        isFocused && "bg-card/90"
      )}>
        <Search className={cn(
          "w-5 h-5 transition-colors duration-300",
          isFocused ? "text-primary" : "text-muted-foreground"
        )} />
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground font-medium"
        />
        
        {value && (
          <button
            onClick={() => onChange("")}
            className="p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}
