"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Menu, X, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface DetailMobileNavProps {
  title: string;
}

const navBtnClass = cn(
  "flex h-10 w-10 items-center justify-center rounded-full",
  "transition-all active:scale-95 active:opacity-70",
  "hover:bg-[hsl(var(--accent-muted))]/50"
);

export default function DetailMobileNav({ title }: DetailMobileNavProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const toggleLang = () => setLang(lang === "en" ? "zh" : "en");

  return (
    <>
      {/* ─── Fixed Topbar ─── */}
      <header className="fixed left-0 right-0 top-0 z-50 lg:hidden">
        <div
          className={cn(
            "flex h-14 items-center justify-between gap-2 px-3",
            "border-b border-[hsl(var(--border))]/50",
            "bg-[hsl(var(--surface))]/90 backdrop-blur-xl"
          )}
        >
          <button
            onClick={() => router.back()}
            className={navBtnClass}
            aria-label={t("Back", "返回")}
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2} />
          </button>

          <span className="flex-1 truncate text-center text-sm font-medium">
            {title}
          </span>

          <button
            onClick={() => setMenuOpen(true)}
            className={navBtnClass}
            aria-label={t("Menu", "菜单")}
          >
            <Menu className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* ─── Menu Panel ─── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99] bg-black/40 lg:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className={cn(
                "fixed right-3 top-[3.75rem] z-[100] w-64 lg:hidden",
                "rounded-2xl border border-[hsl(var(--border))]",
                "bg-[hsl(var(--surface))] dark:bg-[hsl(var(--surface-dark-elevated))]",
                "p-5 shadow-2xl"
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">
                  {t("Menu", "菜单")}
                </h3>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full p-1.5 hover:bg-[hsl(var(--accent-muted))] active:scale-95 active:opacity-70 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-[hsl(var(--text-muted))]">
                  {t("Language", "语言")}
                </span>
                <button
                  onClick={toggleLang}
                  role="switch"
                  aria-checked={lang === "zh"}
                  className="relative h-7 w-20 rounded-full bg-[hsl(var(--accent-muted))] transition-colors"
                >
                  <motion.div
                    layout
                    className="absolute left-0.5 top-0.5 h-6 w-9 rounded-full bg-white shadow-md dark:bg-zinc-200"
                    animate={{ x: lang === "zh" ? 0 : 38 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                  <span className="pointer-events-none absolute left-2 top-1/2 z-10 -translate-y-1/2 text-xs font-medium text-[hsl(var(--text))]">
                    中
                  </span>
                  <span className="pointer-events-none absolute right-2 top-1/2 z-10 -translate-y-1/2 text-xs font-medium text-[hsl(var(--text))]">
                    EN
                  </span>
                </button>
              </div>

              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="mt-3 flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-[hsl(var(--text-muted))] transition-colors hover:bg-[hsl(var(--accent-muted))] hover:text-[hsl(var(--text))]"
              >
                <Settings className="h-4 w-4" />
                {t("Admin", "后台")}
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
