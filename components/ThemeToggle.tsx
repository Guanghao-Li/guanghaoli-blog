"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full p-1",
        "bg-[hsl(var(--surface))]/80 backdrop-blur-xl",
        "border border-[hsl(var(--border))]"
      )}
    >
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "rounded-full p-2 transition-colors",
          theme === "light" ? "bg-[hsl(var(--accent-muted))] text-[hsl(var(--accent))]" : "hover:bg-[hsl(var(--accent-muted))]/50"
        )}
        aria-label="浅色模式"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "rounded-full p-2 transition-colors",
          theme === "dark" ? "bg-[hsl(var(--accent-muted))] text-[hsl(var(--accent))]" : "hover:bg-[hsl(var(--accent-muted))]/50"
        )}
        aria-label="深色模式"
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={cn(
          "rounded-full p-2 transition-colors",
          theme === "system" ? "bg-[hsl(var(--accent-muted))] text-[hsl(var(--accent))]" : "hover:bg-[hsl(var(--accent-muted))]/50"
        )}
        aria-label="跟随系统"
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  );
}
