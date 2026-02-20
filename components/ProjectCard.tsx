"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import MarkdownContent from "./MarkdownContent";
import type { Lang } from "@/contexts/LanguageContext";

export interface ProjectUiSettings {
  titleSize?: string;
  titleLeftOffsetPercent?: number;
  contentWidthPercent?: number;
}

export interface Project {
  id: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  tags: string[];
  size: "large" | "medium";
  markdownEn?: string;
  markdownZh?: string;
  markdown?: string;
  uiSettings?: ProjectUiSettings;
}

export function ProjectCardGrid({
  project,
  layoutId,
  onClick,
  lang,
}: {
  project: Project;
  layoutId: string;
  onClick: () => void;
  lang: Lang;
}) {
  const title = (lang === "zh" ? project.titleZh : project.title) || (lang === "zh" ? project.title : project.titleZh);
  const desc = (lang === "zh" ? project.descriptionZh : project.description) || (lang === "zh" ? project.description : project.descriptionZh);

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
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px hsl(var(--border))",
      }}
      whileTap={{ scale: 1.01 }}
    >
      <h3 className="text-xl font-semibold md:text-2xl">{title}</h3>
      <p className="mt-3 text-[hsl(var(--text-muted))]">{desc}</p>
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
  lang,
}: {
  project: Project;
  layoutId: string;
  onClose?: () => void;
  lang: Lang;
}) {
  const title = (lang === "zh" ? project.titleZh : project.title) || (lang === "zh" ? project.title : project.titleZh);
  const ui = project.uiSettings ?? {};
  const titleSize = ui.titleSize ?? "text-2xl md:text-3xl";
  const titleOffset = ui.titleLeftOffsetPercent ?? 12.5; // pl-32 ≈ 8rem ≈ 12.5% of 1280px
  const contentWidth = ui.contentWidthPercent ?? 70;

  return (
    <motion.div
      layoutId={layoutId}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "fixed inset-0 z-[95] overflow-y-auto",
        "bg-[hsl(var(--surface))] dark:bg-[hsl(var(--surface-dark-elevated))]"
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="pt-12 pb-8 pr-6 text-left"
        style={{ paddingLeft: `max(8rem, ${titleOffset}%)` }}
      >
        <motion.h2
          layoutId={`${layoutId}-title`}
          className={cn(titleSize, "font-bold tracking-tight")}
        >
          {title}
        </motion.h2>
        <div className="mt-3 flex flex-wrap gap-2 justify-start">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-[hsl(var(--accent-muted))] px-3 py-1 text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mx-auto pb-24"
        style={{
          width: `${contentWidth}%`,
          paddingLeft: `max(8rem, ${titleOffset}%)`,
        }}
      >
        <article className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-pre:rounded-xl prose-pre:!bg-zinc-800 prose-pre:!text-zinc-100 prose-code:before:content-none prose-code:after:content-none prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:!bg-zinc-800 prose-code:!text-zinc-100">
          <MarkdownContent
            content={
              lang === "zh"
                ? (project.markdownZh ?? project.markdown ?? "")
                : (project.markdownEn ?? project.markdown ?? "")
            }
          />
        </article>
      </motion.div>
    </motion.div>
  );
}
