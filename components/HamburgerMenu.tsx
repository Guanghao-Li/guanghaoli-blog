"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed left-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full",
          "border border-[hsl(var(--border))]",
          "bg-[hsl(var(--surface))]/80 backdrop-blur-xl dark:bg-[hsl(var(--surface-dark-elevated))]/90",
          "shadow-lg transition-transform hover:scale-105 active:scale-95"
        )}
        aria-label="打开菜单"
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
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed left-4 top-4 z-50 w-72 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-6 shadow-2xl dark:bg-[hsl(var(--surface-dark-elevated))]"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">菜单</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 hover:bg-[hsl(var(--accent-muted))]"
                  aria-label="关闭菜单"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-4 text-sm text-[hsl(var(--text-muted))]">
                菜单占位弹窗 · 可在此添加导航链接、设置项等。
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
