"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Home, FileText, FolderOpen, FlaskConical, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjectDetail } from "@/contexts/ProjectDetailContext";

const NAV_ITEMS = [
  { id: "hero", label: "Home", icon: Home, href: "#hero", external: false },
  { id: "resume", label: "Resume", icon: FileText, href: "#resume", external: false },
  { id: "projects", label: "Projects", icon: FolderOpen, href: "#projects", external: false },
  { id: "lab", label: "Lab", icon: FlaskConical, href: "#lab", external: false },
  { id: "admin", label: "后台", icon: Settings, href: "/admin", external: true },
];

export default function Dock() {
  const { selectedId } = useProjectDetail();
  const isProjectOpen = Boolean(selectedId);

  const handleClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence mode="wait">
      {!isProjectOpen && (
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2"
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
          const isAdmin = item.id === "admin";
          if (item.external) {
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200",
                  "hover:scale-110 hover:bg-[hsl(var(--accent-muted))]",
                  "active:scale-95",
                  isAdmin && "opacity-60 hover:opacity-100"
                )}
                aria-label={item.label}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
              </Link>
            );
          }
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
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
