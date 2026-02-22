"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TocEntry } from "@/lib/toc-utils";
import { useLanguage } from "@/contexts/LanguageContext";

function TocItem({
  entry,
  isActive,
  onClick,
}: {
  entry: TocEntry;
  isActive: boolean;
  onClick: () => void;
}) {
  const isH2 = entry.level === 2;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left",
        "transition-all duration-300 ease-out",
        isH2 ? "text-[13px] font-medium" : "ml-3 text-xs",
        isActive
          ? "bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))]"
          : "text-[hsl(var(--text-muted))] hover:bg-[hsl(var(--accent-muted))]/50 hover:text-[hsl(var(--text))]"
      )}
    >
      <span
        className={cn(
          "shrink-0 rounded-full transition-all duration-300",
          isH2 ? "h-1.5 w-1.5" : "h-1 w-1",
          isActive
            ? "bg-[hsl(var(--accent))] shadow-[0_0_6px_hsl(var(--accent))]"
            : "bg-[hsl(var(--text-muted))]/25 group-hover:bg-[hsl(var(--text-muted))]/50"
        )}
      />
      <span className="line-clamp-2 leading-snug">{entry.text}</span>
    </button>
  );
}

interface TableOfContentsProps {
  toc: TocEntry[];
  /** "desktop" = inline list only; "mobile" = FAB + sheet only */
  mode?: "desktop" | "mobile";
}

export default function TableOfContents({
  toc,
  mode = "mobile",
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(toc[0]?.id ?? null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (toc.length === 0) return;

    const headingEls: Element[] = [];
    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) headingEls.push(el);
    });
    if (headingEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActiveId(hit.target.id);
      },
      { rootMargin: "-80px 0px -65% 0px", threshold: 0 }
    );

    headingEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [toc]);

  const scrollToId = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      setSheetOpen(false);
    },
    []
  );

  if (toc.length === 0) return null;

  /* ─── Desktop: inline list (rendered inside parent sticky aside) ─── */
  if (mode === "desktop") {
    return (
      <>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-[hsl(var(--text-muted))]/70">
          {t("On This Page", "本页导读")}
        </p>
        <nav className="flex flex-col gap-0.5" aria-label="Table of contents">
          {toc.map((entry) => (
            <TocItem
              key={entry.id}
              entry={entry}
              isActive={activeId === entry.id}
              onClick={() => scrollToId(entry.id)}
            />
          ))}
        </nav>
      </>
    );
  }

  /* ─── Mobile: FAB + Bottom Sheet ─── */
  return (
    <>
      {/* FAB — accent-tinted, visually distinct from hamburger menu */}
      <motion.button
        type="button"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 22, delay: 0.4 }}
        onClick={() => setSheetOpen(true)}
        className={cn(
          "fixed bottom-8 right-8 z-40 xl:hidden",
          "flex h-12 w-12 items-center justify-center rounded-full",
          "bg-[hsl(var(--accent))]/90 text-white",
          "shadow-lg shadow-[hsl(var(--accent))]/25 backdrop-blur-xl",
          "transition-all hover:scale-105 active:scale-95 active:opacity-70"
        )}
        aria-label={t("Open table of contents", "打开目录")}
      >
        <BookOpen className="h-5 w-5" strokeWidth={2} />
      </motion.button>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
              onClick={() => setSheetOpen(false)}
            />
            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                damping: 28,
                stiffness: 350,
                mass: 0.8,
              }}
              className={cn(
                "fixed bottom-0 left-0 right-0 z-[100]",
                "max-h-[75vh] overflow-y-auto overscroll-contain",
                "rounded-t-[2rem]",
                "bg-[hsl(var(--surface))] dark:bg-[hsl(var(--surface-dark-elevated))]",
                "shadow-[0_-8px_32px_rgba(0,0,0,0.12)]"
              )}
            >
              {/* Handle bar */}
              <div className="sticky top-0 z-10 flex justify-center bg-inherit pb-2 pt-3">
                <div className="h-1 w-10 rounded-full bg-[hsl(var(--text-muted))]/20" />
              </div>
              {/* Header */}
              <div className="flex items-center justify-between px-6 pb-3">
                <p className="text-sm font-semibold">
                  {t("On This Page", "本页导读")}
                </p>
                <button
                  onClick={() => setSheetOpen(false)}
                  className="rounded-full p-2 transition-colors hover:bg-[hsl(var(--accent-muted))]/50"
                  aria-label={t("Close", "关闭")}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {/* Items */}
              <nav
                className="flex flex-col gap-0.5 px-4 pb-8"
                aria-label="Table of contents"
              >
                {toc.map((entry) => (
                  <TocItem
                    key={entry.id}
                    entry={entry}
                    isActive={activeId === entry.id}
                    onClick={() => scrollToId(entry.id)}
                  />
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
