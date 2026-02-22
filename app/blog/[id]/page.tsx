"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import MarkdownContentWithIds from "@/components/MarkdownContentWithIds";
import TableOfContents from "@/components/TableOfContents";
import PdfAttachment from "@/components/PdfAttachment";
import { extractToc } from "@/lib/toc-utils";
import { useLanguage } from "@/contexts/LanguageContext";

function formatDate(iso?: string, lang: "en" | "zh" = "en") {
  if (!iso) return "";
  const d = new Date(iso);
  return lang === "zh"
    ? d.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })
    : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { lang } = useLanguage();
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

  if (loading) return <div className="flex min-h-screen items-center justify-center">加载中...</div>;
  if (error || !blog) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-[hsl(var(--text-muted))]">{error || "Blog not found"}</p>
        <Link href="/#blog" className="text-[hsl(var(--accent))] hover:underline">
          返回首页
        </Link>
      </div>
    );
  }

  const title = (lang === "zh" ? blog.titleZh : blog.title) || (lang === "zh" ? blog.title : blog.titleZh);
  const content = lang === "zh" ? (blog.contentZh ?? "") : (blog.contentEn ?? "");
  const toc = extractToc(content);
  const coverImage = blog.coverImage;
  const isDataUrl = coverImage?.startsWith("data:");

  return (
    <div className="min-h-screen bg-[hsl(var(--surface))]">
      {/* 顶部导航 - 最高层级，绝对隔离 */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text))] transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            返回
          </button>
        </div>
      </header>

      {/* 主容器 - 沉浸式阅读，居中 */}
      <main className="mx-auto max-w-3xl px-4 pt-20 pb-16">
        {coverImage && (
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-2xl">
            {isDataUrl ? (
              <img src={coverImage} alt="" className="h-full w-full object-cover" />
            ) : (
              <Image src={coverImage} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
            )}
          </div>
        )}

        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[hsl(var(--text-muted))]">
          {(blog.readTime ?? 0) > 0 && (
            <span>{lang === "zh" ? `${blog.readTime} 分钟阅读` : `${blog.readTime} min read`}</span>
          )}
          {blog.createdAt && (
            <>
              {(blog.readTime ?? 0) > 0 && <span>·</span>}
              <span>{formatDate(blog.createdAt, lang)}</span>
            </>
          )}
        </div>

        <article className="mt-8 [&_h2]:scroll-mt-24 [&_h3]:scroll-mt-24">
          <MarkdownContentWithIds content={content} />
        </article>

        {blog.pdfData && (
          <div className="mt-12">
            <PdfAttachment pdfData={blog.pdfData} pdfName={blog.pdfName || "document.pdf"} />
          </div>
        )}
      </main>

      {/* TOC - 独立挂载，不干扰布局 */}
      <TableOfContents toc={toc} />
    </div>
  );
}
