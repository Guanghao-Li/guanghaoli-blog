"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCmsBlogs } from "@/contexts/CmsContext";
import { useScrollSection } from "@/contexts/ScrollSectionContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

function formatDate(iso?: string, lang: "en" | "zh" = "en") {
  if (!iso) return "";
  const d = new Date(iso);
  return lang === "zh"
    ? d.toLocaleDateString("zh-CN", { year: "numeric", month: "short", day: "numeric" })
    : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function BlogSection() {
  const blogs = useCmsBlogs();
  const blogRef = useRef<HTMLElement | null>(null);
  const { registerSection } = useScrollSection();
  const { lang, t } = useLanguage();

  const registerBlogRef = (el: HTMLElement | null) => {
    (blogRef as React.MutableRefObject<HTMLElement | null>).current = el;
    registerSection("blog", el);
  };

  if (blogs.length === 0) return null;

  return (
    <section
      ref={registerBlogRef}
      id="blog"
      className="flex min-h-screen w-full flex-col items-center justify-center gap-6 px-4 py-8 md:px-8 md:py-12"
    >
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          {t("Blog & Diary", "博客与随笔")}
        </h2>
        <p className="mt-2 text-[hsl(var(--text-muted))]">
          {t("Notes and thoughts", "记录与思考")}
        </p>
      </div>
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 md:auto-rows-[minmax(140px,auto)]">
        {[...blogs]
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((blog, index) => {
            const colSpan = blog.colSpan ?? 1;
            const rowSpan = blog.rowSpan ?? 1;
            const colClass = colSpan === 2 ? "md:col-span-2" : "";
            const rowClass = rowSpan === 2 ? "md:row-span-2" : "";
            const title = (lang === "zh" ? blog.titleZh : blog.title) || (lang === "zh" ? blog.title : blog.titleZh);
            const desc = (lang === "zh" ? blog.descriptionZh : blog.description) || (lang === "zh" ? blog.description : blog.descriptionZh);
            const coverImage = blog.coverImage;
            const isDataUrl = coverImage?.startsWith("data:");

            return (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={cn(colClass, rowClass)}
              >
                <Link href={`/blog/${blog.id}`}>
                  <article
                    className={cn(
                      "group flex h-full flex-col overflow-hidden rounded-2xl border border-[hsl(var(--border))]",
                      "bg-[hsl(var(--surface))]/80 backdrop-blur-xl dark:bg-[hsl(var(--surface-dark-elevated))]/80",
                      "shadow-lg hover:shadow-xl transition-shadow"
                    )}
                  >
                    <div className="flex flex-1 flex-col p-5">
                      {coverImage && (
                        <div className="relative mb-3 h-24 w-full shrink-0 overflow-hidden rounded-lg opacity-80 group-hover:opacity-100 transition-opacity">
                          {isDataUrl ? (
                            <img src={coverImage} alt="" className="h-full w-full object-cover" />
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
                      <div className="flex flex-1 flex-col">
                        <h3 className="text-lg font-semibold md:text-xl group-hover:text-[hsl(var(--accent))] transition-colors">
                          {title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-[hsl(var(--text-muted))]">
                          {desc}
                        </p>
                        <div className="mt-3 flex items-center gap-3 text-xs text-[hsl(var(--text-muted))]">
                          {blog.createdAt && (
                            <span>{formatDate(blog.createdAt, lang)}</span>
                          )}
                          {(blog.readTime ?? 0) > 0 && (
                            <>
                              {blog.createdAt && <span>·</span>}
                              <span>{blog.readTime} min</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            );
          })}
      </div>
    </section>
  );
}
