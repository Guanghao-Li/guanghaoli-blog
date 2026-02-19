"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  size: "large" | "medium";
}

export function ProjectCardGrid({
  project,
  layoutId,
  onClick,
}: {
  project: Project;
  layoutId: string;
  onClick: () => void;
}) {
  return (
    <motion.article
      layoutId={layoutId}
      onClick={onClick}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "cursor-pointer rounded-3xl border border-[hsl(var(--border))] p-6 shadow-lg",
        "bg-[hsl(var(--surface))]/80 backdrop-blur-xl dark:bg-[hsl(var(--surface-dark-elevated))]/80",
        "hover:shadow-2xl",
        project.size === "large" && "md:col-span-2"
      )}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px hsl(var(--border))",
      }}
      whileTap={{ scale: 1.02 }}
    >
      <h3 className="text-xl font-semibold md:text-2xl">{project.title}</h3>
      <p className="mt-3 text-[hsl(var(--text-muted))]">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-xl bg-[hsl(var(--accent-muted))] px-3 py-1 text-sm font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

export function ProjectCardExpanded({
  project,
  layoutId,
  onClose,
}: {
  project: Project;
  layoutId: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      layoutId={layoutId}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="relative mx-4 max-h-[90vh] w-full max-w-2xl overflow-auto rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-8 shadow-2xl dark:bg-[hsl(var(--surface-dark-elevated))]"
    >
      <button
        onClick={onClose}
        className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--accent-muted))] hover:bg-[hsl(var(--accent))] hover:text-white"
        aria-label="关闭"
      >
        <X className="h-5 w-5" />
      </button>
      <div className="pt-12">
        <motion.h2 layoutId={`${layoutId}-title`} className="text-center text-2xl font-bold md:text-3xl">
          {project.title}
        </motion.h2>
        <div className="mt-6 space-y-4 text-[hsl(var(--text-muted))]">
          <p>{project.description}</p>
          <p className="text-sm">二级页面占位内容 · 可在此添加项目详情、截图、技术栈等。</p>
        </div>
      </div>
    </motion.div>
  );
}
