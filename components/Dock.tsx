"use client";

import { Home, FileText, FolderOpen, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home, href: "#" },
  { id: "resume", label: "Resume", icon: FileText, href: "#resume" },
  { id: "projects", label: "Projects", icon: FolderOpen, href: "#projects" },
  { id: "lab", label: "Lab", icon: FlaskConical, href: "#lab" },
];

export default function Dock() {
  const handleClick = (href: string) => {
    if (href === "#") window.scrollTo({ top: 0, behavior: "smooth" });
    else document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2" role="navigation">
      <div
        className={cn(
          "flex items-center gap-2 rounded-full px-5 py-3",
          "border border-[hsl(var(--border))]",
          "bg-[hsl(var(--surface))]/80 backdrop-blur-2xl dark:bg-[hsl(var(--surface-dark-elevated))]/90",
          "shadow-xl"
        )}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.href)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200",
                "hover:scale-110 hover:bg-[hsl(var(--accent-muted))]",
                "active:scale-95"
              )}
              aria-label={item.label}
            >
              <Icon className="h-5 w-5" strokeWidth={2} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
