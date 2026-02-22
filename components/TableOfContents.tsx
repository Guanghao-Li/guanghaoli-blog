"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TocEntry } from "@/lib/toc-utils";

interface TableOfContentsProps {
  toc: TocEntry[];
}

export default function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(toc[0]?.id ?? null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActiveId(e.target.id);
            break;
          }
        }
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0 }
    );

    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setSheetOpen(false);
  };

  const tocNav = (
    <nav className="space-y-1.5" aria-label="目录">
      {toc.map((e) => {
        const isH2 = e.level === 2;
        const isActive = activeId === e.id;
        return (
          <a
            key={e.id}
            href={`#${e.id}`}
            onClick={(ev) => {
              ev.preventDefault();
              scrollToId(e.id);
            }}
            className={cn(
              "flex items-start gap-2 rounded-md py-0.5 pr-2 transition-colors duration-200",
              "hover:text-[hsl(var(--text))]",
              isH2 && "text-sm font-medium",
              !isH2 && "pl-4 text-xs text-[hsl(var(--text-muted))]",
              isActive && "text-[hsl(var(--accent))]"
            )}
          >
            <span
              className={cn(
                "mt-1.5 shrink-0 rounded-full border-2 transition-colors duration-200",
                isH2 ? "h-2 w-2" : "ml-1 h-1.5 w-1.5",
                isActive
                  ? "border-[hsl(var(--accent))] bg-[hsl(var(--accent))]"
                  : "border-gray-200 bg-transparent dark:border-gray-700"
              )}
              aria-hidden
            />
            <span className="line-clamp-2">{e.text}</span>
          </a>
        );
      })}
    </nav>
  );

  if (toc.length === 0) return null;

  return (
    <>
      {/* 桌面端：右侧悬浮时间轴 - 正文右侧外围 */}
      <aside
        className="hidden lg:block fixed top-32 right-8 z-30 w-44 max-h-[60vh] overflow-y-auto"
      >
        <div className="border-l border-gray-200/80 dark:border-gray-800 pl-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[hsl(var(--text-muted))]">
            目录
          </p>
          {tocNav}
        </div>
      </aside>

      {/* 移动端：FAB */}
      <div className="fixed bottom-8 right-8 z-40 lg:hidden">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/90 shadow-lg backdrop-blur-xl"
          aria-label="打开目录"
        >
          <List className="h-6 w-6" strokeWidth={2} />
        </button>
      </div>

      {/* 移动端：Bottom Sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setSheetOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-40 max-h-[70vh] overflow-y-auto rounded-t-2xl border-t border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-5 pb-safe lg:hidden"
            >
              <p className="mb-4 text-sm font-semibold">目录</p>
              <div className="border-l border-gray-200/80 dark:border-gray-800 pl-4">
                {tocNav}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
