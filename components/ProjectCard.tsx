"use client";

import { motion } from "framer-motion";
import Image from "next/image";
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
  colSpan?: number;
  rowSpan?: number;
  order?: number;
  coverImage?: string;
  readTime?: number;
  createdAt?: string;
  updatedAt?: string;
  markdownEn?: string;
  markdownZh?: string;
  markdown?: string;
  uiSettings?: ProjectUiSettings;
}

const GRID_COL_SPAN: Record<number, string> = {
  1: "md:col-span-1",
  2: "md:col-span-2",
};

const GRID_ROW_SPAN: Record<number, string> = {
  1: "md:row-span-1",
  2: "md:row-span-2",
};

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
  const colSpan = project.colSpan ?? (project.size === "large" ? 2 : 1);
  const rowSpan = project.rowSpan ?? 1;
  const coverImage = project.coverImage;
  const isDataUrl = coverImage?.startsWith("data:");

  return (
    <motion.article
      layoutId={layoutId}
      onClick={onClick}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "cursor-pointer overflow-hidden rounded-3xl border border-[hsl(var(--border))] shadow-lg",
        "bg-[hsl(var(--surface))]/80 backdrop-blur-xl dark:bg-[hsl(var(--surface-dark-elevated))]/80",
        "hover:shadow-2xl flex flex-col",
        GRID_COL_SPAN[colSpan] ?? GRID_COL_SPAN[1],
        GRID_ROW_SPAN[rowSpan] ?? GRID_ROW_SPAN[1],
        project.size === "large" && !project.colSpan && "md:col-span-2"
      )}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px hsl(var(--border))",
      }}
      whileTap={{ scale: 1.01 }}
    >
      {coverImage && (
        <div className="relative h-32 w-full shrink-0 overflow-hidden md:h-40">
          {isDataUrl ? (
            <img
              src={coverImage}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
              src={coverImage}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold md:text-2xl">{title}</h3>
        <p className="mt-3 text-[hsl(var(--text-muted))] line-clamp-2">{desc}</p>
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
      </div>
    </motion.article>
  );
}

function formatDate(iso?: string, lang: Lang = "en") {
  if (!iso) return "";
  const d = new Date(iso);
  return lang === "zh"
    ? d.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })
    : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
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
  const titleOffset = ui.titleLeftOffsetPercent ?? 12.5;
  const contentWidth = ui.contentWidthPercent ?? 70;
  const coverImage = project.coverImage;
  const isDataUrl = coverImage?.startsWith("data:");
  const readTime = project.readTime ?? 0;
  const createdAt = project.createdAt;

  return (
    <motion.div
      layoutId={layoutId}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "fixed inset-0 z-[95] overflow-y-auto",
        "bg-[hsl(var(--surface))] dark:bg-[hsl(var(--surface-dark-elevated))]"
      )}
    >
      {coverImage && (
        <div className="relative h-48 w-full shrink-0 overflow-hidden md:h-64">
          {isDataUrl ? (
            <img src={coverImage} alt="" className="h-full w-full object-cover" />
          ) : (
            <Image src={coverImage} alt="" fill className="object-cover" sizes="100vw" />
          )}
        </div>
      )}
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
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[hsl(var(--text-muted))]">
          {readTime > 0 && (
            <span>{lang === "zh" ? `${readTime} 分钟阅读` : `${readTime} min read`}</span>
          )}
          {createdAt && (
            <>
              {readTime > 0 && <span>·</span>}
              <span>{formatDate(createdAt, lang)}</span>
            </>
          )}
        </div>
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
