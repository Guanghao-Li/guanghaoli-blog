"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProjectDetail } from "@/contexts/ProjectDetailContext";

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { selectedId } = useProjectDetail();
  const isSecondaryPage = Boolean(selectedId);

  const toggleLang = () => setLang(lang === "en" ? "zh" : "en");

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed left-4 top-4 z-[100] flex h-12 w-12 items-center justify-center rounded-full",
          "border border-[hsl(var(--border))]",
          "bg-[hsl(var(--surface))]/80 dark:bg-[hsl(var(--surface-dark-elevated))]/90",
          "shadow-lg transition-all hover:scale-105 active:scale-95 active:opacity-70"
        )}
        aria-label={t("Open menu", "打开菜单")}
      >
        <Menu className="h-6 w-6" strokeWidth={2} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99] bg-black/40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{
                opacity: 1,
                x: isSecondaryPage ? 80 : 0,
              }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className="fixed left-4 top-4 z-[100] w-72 overflow-visible rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-6 shadow-2xl dark:bg-[hsl(var(--surface-dark-elevated))]"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{t("Menu", "菜单")}</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 hover:bg-[hsl(var(--accent-muted))] active:scale-95 active:opacity-70 transition-all"
                  aria-label={t("Close", "关闭")}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-[hsl(var(--text-muted))]">
                  {t("Language", "语言")}
                </span>
                <button
                  onClick={toggleLang}
                  role="switch"
                  aria-checked={lang === "zh"}
                  aria-label={t("Toggle language", "切换语言")}
                  className={cn(
                    "relative h-8 w-[5.5rem] rounded-full",
                    "bg-[hsl(var(--accent-muted))]",
                    "transition-colors"
                  )}
                >
                  <motion.div
                    layout
                    className="absolute left-1 top-1 h-6 w-9 rounded-full bg-white shadow-md dark:bg-zinc-200"
                    animate={{ x: lang === "zh" ? 0 : 44 }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-[hsl(var(--text))] pointer-events-none z-10">
                    中
                  </span>
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-[hsl(var(--text))] pointer-events-none z-10">
                    EN
                  </span>
                </button>
              </div>
              <p className="mt-4 text-sm text-[hsl(var(--text-muted))]">
                {t("Portfolio · Navigation & Settings", "作品集 · 导航与设置")}
              </p>
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="mt-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[hsl(var(--text-muted))] hover:bg-[hsl(var(--accent-muted))] hover:text-[hsl(var(--text))]"
              >
                <Settings className="h-4 w-4 shrink-0" />
                {t("Admin", "后台")}
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
