"use client";

import { motion } from "framer-motion";
import { Home, FileText, FolderOpen, BookOpen, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "hero", label: "Home", icon: Home, href: "#hero" },
  { id: "resume", label: "Resume", icon: FileText, href: "#resume" },
  { id: "projects", label: "Projects", icon: FolderOpen, href: "#projects" },
  { id: "blog", label: "Blog", icon: BookOpen, href: "#blog" },
  { id: "lab", label: "Lab", icon: FlaskConical, href: "#lab" },
];

export default function Dock() {
  const handleClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        role="navigation"
      >
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
                  "active:scale-95 active:opacity-70"
                )}
                aria-label={item.label}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
              </button>
            );
          })}
        </div>
      </motion.nav>
    </div>
  );
}
