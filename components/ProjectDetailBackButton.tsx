"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useProjectDetail } from "@/contexts/ProjectDetailContext";

export default function ProjectDetailBackButton() {
  const { selectedId, setSelectedId } = useProjectDetail();

  return (
    <AnimatePresence>
      {selectedId && (
        <motion.button
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          onClick={() => setSelectedId(null)}
          className={`
            fixed left-4 top-20 z-[100]
            flex h-12 w-12 items-center justify-center rounded-full
            border border-[hsl(var(--border))]
            bg-[hsl(var(--surface))]/90 dark:bg-[hsl(var(--surface-dark-elevated))]/90
            shadow-lg transition-transform hover:scale-105 active:scale-95
          `}
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
