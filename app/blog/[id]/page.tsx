"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import MarkdownContentWithIds from "@/components/MarkdownContentWithIds";
import TableOfContents from "@/components/TableOfContents";
import ThemeToggle from "@/components/ThemeToggle";
import PdfAttachment from "@/components/PdfAttachment";
import { extractToc } from "@/lib/toc-utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

function formatDate(iso?: string, lang: "en" | "zh" = "en") {
  if (!iso) return "";
  const d = new Date(iso);
  return lang === "zh"
    ? d.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })
    : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

const backBtnClass = cn(
  "flex h-12 w-12 items-center justify-center rounded-full",
  "border border-[hsl(var(--border))]",
  "bg-[hsl(var(--surface))]/80 dark:bg-[hsl(var(--surface-dark-elevated))]/90",
  "shadow-lg backdrop-blur-xl",
  "transition-transform hover:scale-105 active:scale-95"
);

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { lang, t } = useLanguage();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/blog/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setBlog)
      .catch(() => setError("Blog not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--surface))]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[hsl(var(--accent))]/30 border-t-[hsl(var(--accent))]" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[hsl(var(--surface))] px-4">
        <p className="text-lg text-[hsl(var(--text-muted))]">{error || "Blog not found"}</p>
        <Link
          href="/#blog"
          className="rounded-full bg-[hsl(var(--accent-muted))] px-6 py-2.5 text-sm font-medium text-[hsl(var(--accent))] transition-colors hover:bg-[hsl(var(--accent))]/20"
        >
          {t("Back to Home", "返回首页")}
        </Link>
      </div>
    );
  }

  const title =
    (lang === "zh" ? blog.titleZh : blog.title) ||
    (lang === "zh" ? blog.title : blog.titleZh);
  const content =
    lang === "zh" ? (blog.contentZh ?? "") : (blog.contentEn ?? "");
  const toc = extractToc(content);
  const coverImage = blog.coverImage;
  const isDataUrl = coverImage?.startsWith("data:");

  return (
    <div className="min-h-screen bg-[hsl(var(--surface))]">
      {/* ══════ Mobile floating nav — exact hamburger-menu coordinates ══════ */}
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-30 h-24 bg-gradient-to-b from-[hsl(var(--surface))] via-[hsl(var(--surface))]/80 to-transparent lg:hidden" />
      <button
        onClick={() => router.back()}
        className={cn(backBtnClass, "fixed left-4 top-4 z-[100] lg:hidden")}
        aria-label={t("Back", "返回")}
      >
        <ArrowLeft className="h-5 w-5" strokeWidth={2} />
      </button>
      <div className="fixed right-4 top-4 z-[90]">
        <ThemeToggle />
      </div>

      {/* ══════ Three-Column Gemini Grid ══════ */}
      <div className="mx-auto flex w-full max-w-[90rem] justify-center gap-10 px-4 pb-16 pt-20 lg:px-8 lg:pt-8">
        {/* ── Left Sidebar ── */}
        <aside className="sticky top-8 hidden h-fit w-64 shrink-0 lg:block">
          <button
            onClick={() => router.back()}
            className={backBtnClass}
            aria-label={t("Back", "返回")}
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2} />
          </button>

          <div className="mt-8 space-y-5">
            {blog.createdAt && (
              <div className="flex items-center gap-2.5 text-sm text-[hsl(var(--text-muted))]">
                <Calendar className="h-4 w-4 shrink-0 opacity-60" />
                <span>{formatDate(blog.createdAt, lang)}</span>
              </div>
            )}
            {(blog.readTime ?? 0) > 0 && (
              <div className="flex items-center gap-2.5 text-sm text-[hsl(var(--text-muted))]">
                <Clock className="h-4 w-4 shrink-0 opacity-60" />
                <span>
                  {lang === "zh"
                    ? `${blog.readTime} 分钟`
                    : `${blog.readTime} min read`}
                </span>
              </div>
            )}
          </div>
        </aside>

        {/* ── Center Content ── */}
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
            {(blog.readTime ?? 0) > 0 && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {lang === "zh"
                  ? `${blog.readTime} 分钟`
                  : `${blog.readTime} min`}
              </span>
            )}
            {blog.createdAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(blog.createdAt, lang)}
              </span>
            )}
          </div>

          <div className="my-8 h-px bg-gradient-to-r from-transparent via-[hsl(var(--border))] to-transparent" />

          <article>
            <MarkdownContentWithIds content={content} />
          </article>

          {blog.pdfData && (
            <div className="mt-12">
              <PdfAttachment
                pdfData={blog.pdfData}
                pdfName={blog.pdfName || "document.pdf"}
              />
            </div>
          )}
        </main>

        {/* ── Right Sidebar: TOC ── */}
        <aside className="sticky top-8 hidden h-fit max-h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto xl:block">
          <TableOfContents toc={toc} mode="desktop" />
        </aside>
      </div>

      {/* Mobile TOC FAB + Bottom Sheet */}
      <TableOfContents toc={toc} mode="mobile" />
    </div>
  );
}
