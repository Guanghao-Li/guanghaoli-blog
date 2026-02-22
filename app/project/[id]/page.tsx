"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import MarkdownContentWithIds from "@/components/MarkdownContentWithIds";
import TableOfContents from "@/components/TableOfContents";
import DetailMobileNav from "@/components/DetailMobileNav";
import PdfAttachment from "@/components/PdfAttachment";
import { extractToc } from "@/lib/toc-utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

function formatDate(iso?: string, lang: "en" | "zh" = "en") {
  if (!iso) return "";
  const d = new Date(iso);
  return lang === "zh"
    ? d.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
}

const backBtnClass = cn(
  "flex h-12 w-12 items-center justify-center rounded-full",
  "border border-[hsl(var(--border))]",
  "bg-[hsl(var(--surface))]/80 dark:bg-[hsl(var(--surface-dark-elevated))]/90",
  "shadow-lg backdrop-blur-xl",
  "transition-all hover:scale-105 active:scale-95 active:opacity-70"
);

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { lang, t } = useLanguage();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/project/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setProject)
      .catch(() => setError("Project not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--surface))]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[hsl(var(--accent))]/30 border-t-[hsl(var(--accent))]" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[hsl(var(--surface))] px-4">
        <p className="text-lg text-[hsl(var(--text-muted))]">
          {error || "Project not found"}
        </p>
        <Link
          href="/#projects"
          className="rounded-full bg-[hsl(var(--accent-muted))] px-6 py-2.5 text-sm font-medium text-[hsl(var(--accent))] transition-colors hover:bg-[hsl(var(--accent))]/20"
        >
          {t("Back to Home", "返回首页")}
        </Link>
      </div>
    );
  }

  const title =
    (lang === "zh" ? project.titleZh : project.title) ||
    (lang === "zh" ? project.title : project.titleZh);
  const content =
    lang === "zh"
      ? (project.markdownZh ?? project.markdown ?? "")
      : (project.markdownEn ?? project.markdown ?? "");
  const toc = extractToc(content);
  const coverImage = project.coverImage;
  const isDataUrl = coverImage?.startsWith("data:");

  return (
    <div className="min-h-screen bg-[hsl(var(--surface))]">
      {/* Mobile unified topbar */}
      <DetailMobileNav title={title} />

      {/* Three-Column Gemini Grid */}
      <div className="mx-auto flex w-full max-w-[90rem] justify-center gap-10 px-4 pb-16 pt-16 lg:px-8 lg:pt-8">
        {/* Left Sidebar — desktop only */}
        <aside className="sticky top-8 hidden h-fit w-64 shrink-0 lg:block">
          <button
            onClick={() => router.back()}
            className={backBtnClass}
            aria-label={t("Back", "返回")}
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2} />
          </button>

          <div className="mt-8 space-y-5">
            {project.createdAt && (
              <div className="flex items-center gap-2.5 text-sm text-[hsl(var(--text-muted))]">
                <Calendar className="h-4 w-4 shrink-0 opacity-60" />
                <span>{formatDate(project.createdAt, lang)}</span>
              </div>
            )}
            {(project.readTime ?? 0) > 0 && (
              <div className="flex items-center gap-2.5 text-sm text-[hsl(var(--text-muted))]">
                <Clock className="h-4 w-4 shrink-0 opacity-60" />
                <span>
                  {lang === "zh"
                    ? `${project.readTime} 分钟`
                    : `${project.readTime} min read`}
                </span>
              </div>
            )}
            {project.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[hsl(var(--accent-muted))] px-3 py-1 text-xs font-medium text-[hsl(var(--text-muted))]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Center Content */}
        <main className="min-w-0 max-w-3xl flex-1">
          {coverImage && (
            <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-2xl shadow-md">
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
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              )}
            </div>
          )}

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.5rem] lg:leading-tight">
            {title}
          </h1>

          {/* Mobile-only metadata */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[hsl(var(--text-muted))] lg:hidden">
            {(project.readTime ?? 0) > 0 && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {lang === "zh"
                  ? `${project.readTime} 分钟`
                  : `${project.readTime} min`}
              </span>
            )}
            {project.createdAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(project.createdAt, lang)}
              </span>
            )}
          </div>
          {project.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5 lg:hidden">
              {project.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full bg-[hsl(var(--accent-muted))] px-3 py-1 text-xs font-medium text-[hsl(var(--text-muted))]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="my-8 h-px bg-gradient-to-r from-transparent via-[hsl(var(--border))] to-transparent" />

          <article>
            <MarkdownContentWithIds content={content} />
          </article>

          {project.pdfData && (
            <div className="mt-12">
              <PdfAttachment
                pdfData={project.pdfData}
                pdfName={project.pdfName || "document.pdf"}
              />
            </div>
          )}
        </main>

        {/* Right Sidebar — TOC desktop */}
        <aside className="sticky top-8 hidden h-fit max-h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto xl:block">
          <TableOfContents toc={toc} mode="desktop" />
        </aside>
      </div>

      {/* Mobile TOC FAB + Bottom Sheet */}
      <TableOfContents toc={toc} mode="mobile" />
    </div>
  );
}
