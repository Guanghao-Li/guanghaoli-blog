"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TocEntry } from "@/lib/toc-utils";

interface DetailPageWithTocProps {
  toc: TocEntry[];
  children: React.ReactNode;
}

export default function DetailPageWithToc({ toc, children }: DetailPageWithTocProps) {
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
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setSheetOpen(false);
  };

  const tocList = (
    <nav className="space-y-1" aria-label="目录">
      {toc.map((e) => (
        <a
          key={e.id}
          href={`#${e.id}`}
          onClick={(ev) => {
            ev.preventDefault();
            scrollToId(e.id);
          }}
          className={cn(
            "block rounded-md py-1 text-sm transition-colors",
            e.level === 1 && "font-semibold text-[hsl(var(--text))]",
            (e.level === 2 || e.level === 3) && "font-normal text-[hsl(var(--text-muted))]",
            e.level === 3 && "pl-4 before:mr-2 before:inline-block before:h-1 before:w-1 before:rounded-full before:align-middle before:bg-current before:content-['']",
            activeId === e.id && "text-[hsl(var(--accent))]"
          )}
        >
          {e.text}
        </a>
      ))}
    </nav>
  );

  return (
    <>
      <div className="flex min-h-screen w-full overflow-x-hidden">
        {/* 桌面端左侧 TOC - md 及以上显示 */}
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-24 pl-2">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[hsl(var(--text-muted))]">
              目录
            </p>
            {tocList}
          </div>
        </aside>

        {/* 正文区域 */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* 移动端 FAB + Bottom Sheet */}
      <div className="fixed bottom-24 right-4 z-50 md:hidden">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--surface))] shadow-lg"
          aria-label="打开目录"
        >
          <List className="h-6 w-6" />
        </button>
      </div>

      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/50 md:hidden"
              onClick={() => setSheetOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[61] max-h-[60vh] overflow-y-auto rounded-t-2xl border-t border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-4 pb-safe md:hidden"
            >
              <p className="mb-3 text-sm font-semibold">目录</p>
              {tocList}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
