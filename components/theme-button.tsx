"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="flex items-center gap-0.5 rounded-full bg-muted/50 p-1">
      {(["light", "system", "dark"] as const).map((mode) => {
        const Icon = mode === "light" ? Sun : mode === "system" ? Monitor : Moon;
        const active = theme === mode;
        return (
          <button
            key={mode}
            onClick={() => setTheme(mode)}
            title={mode.charAt(0).toUpperCase() + mode.slice(1)}
            className={`rounded-full p-1.5 transition-all duration-200 ${
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={active ? 2 : 1.5} />
          </button>
        );
      })}
    </div>
  );
}
