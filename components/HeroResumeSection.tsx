"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Image from "next/image";
import { useScrollSection } from "@/contexts/ScrollSectionContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCmsResume } from "@/contexts/CmsContext";
import { getResumeData } from "@/lib/resume-data";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AVATAR_SRC = "/avatar-placeholder.svg";

export default function HeroResumeSection() {
  const heroRef = useRef<HTMLElement | null>(null);
  const resumeRef = useRef<HTMLElement | null>(null);
  const { isResumeActive, registerSection } = useScrollSection();

  const registerHero = (el: HTMLElement | null) => {
    (heroRef as React.MutableRefObject<HTMLElement | null>).current = el;
    registerSection("hero", el);
  };
  const registerResume = (el: HTMLElement | null) => {
    (resumeRef as React.MutableRefObject<HTMLElement | null>).current = el;
    registerSection("resume", el);
  };

  return (
    <>
      <div
        id="hero"
        ref={(el) => {
          (heroRef as React.MutableRefObject<HTMLElement | null>).current = el;
          registerSection("hero", el);
        }}
        className="scroll-snap-section w-full flex flex-col"
      >
        <HeroContent isResumeActive={isResumeActive} />
      </div>
      <div
        ref={(el) => {
          (resumeRef as React.MutableRefObject<HTMLElement | null>).current = el;
          registerSection("resume", el);
        }}
        className="scroll-snap-section w-full flex flex-col"
      >
        <ResumeContent isResumeActive={isResumeActive} />
      </div>
    </>
  );
}

function HeroContent({ isResumeActive }: { isResumeActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const { lang, t } = useLanguage();

  useEffect(() => {
    scrollContainerRef.current = document.querySelector(".scroll-snap-container");
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.7], [1, 0.6, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.4, 0.7], [0, 4, 12]);
  const blurFilter = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden -translate-y-10">
      <div ref={containerRef} className="absolute inset-0" aria-hidden />
      {!isResumeActive && (
        <motion.div
          style={{ y, opacity, filter: blurFilter }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6"
        >
          <div className="flex-shrink-0 w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 relative flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 -m-4 rounded-full bg-slate-300/60 dark:bg-zinc-700/60"
              aria-hidden
            />
            <SharedAvatar layoutId="hero-avatar" isResume={false} />
          </div>
          <SharedName layoutId="hero-name" isResume={false} lang={lang} />
          <motion.p
            layout
            className="mt-4 text-center text-sm font-medium tracking-widest text-zinc-500 dark:text-zinc-400 md:text-base whitespace-nowrap"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {t(
              "Embedded Systems Engineer",
              "嵌入式系统工程师 / Embedded Systems Engineer"
            )}
          </motion.p>
        </motion.div>
      )}
    </section>
  );
}

function ResumeContent({ isResumeActive }: { isResumeActive: boolean }) {
  const paperRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(paperRef, { once: true, margin: "-80px" });
  const { lang } = useLanguage();
  const cmsResume = useCmsResume();
  const fallbackData = getResumeData(lang);

  const name = cmsResume
    ? lang === "zh"
      ? cmsResume.nameZh
      : cmsResume.nameEn
    : fallbackData.personal.name;

  const hasCmsResume = cmsResume && (cmsResume.basicInfo.length > 0 || cmsResume.sections.some((s) => s.items.length > 0));

  return (
    <section
      id="resume"
      className="relative flex min-h-screen w-full flex-col px-6 py-16 md:px-12 md:py-24"
    >
      <div ref={paperRef} className="mx-auto w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`
            rounded-2xl border shadow-xl
            bg-white/90 dark:bg-zinc-800/90
            border-[hsl(var(--border))]
            px-8 py-10 md:px-12 md:py-12
          `}
        >
          <div className="relative flex min-h-[200px] flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex-1 min-w-0">
              {isResumeActive && <SharedName layoutId="hero-name" isResume={true} lang={lang} customName={name} />}
              <motion.div
                layout
                className="mt-4 space-y-2 text-[hsl(var(--text-muted))]"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {hasCmsResume && cmsResume ? (
                  <>
                    {cmsResume.basicInfo.map((item) => (
                      <p key={item.id}>
                        <span className="text-[hsl(var(--text))] font-medium">
                          {(lang === "zh" ? item.labelZh : item.labelEn) || "—"}:
                        </span>{" "}
                        {lang === "zh" ? item.valueZh : item.valueEn}
                      </p>
                    ))}
                  </>
                ) : (
                  <>
                    <p><span className="text-[hsl(var(--text))] font-medium">{fallbackData.personal.nameLabel}:</span> {fallbackData.personal.name}</p>
                    <p><span className="text-[hsl(var(--text))] font-medium">{fallbackData.personal.locationLabel}:</span> {fallbackData.personal.location}</p>
                    <p><span className="text-[hsl(var(--text))] font-medium">{fallbackData.personal.phoneLabel}:</span> {fallbackData.personal.phone}</p>
                    <p><span className="text-[hsl(var(--text))] font-medium">{fallbackData.personal.emailLabel}:</span> {fallbackData.personal.email}</p>
                  </>
                )}
              </motion.div>
            </div>
            <div className="mt-6 flex-shrink-0 md:mt-0">
              {isResumeActive && <SharedAvatar layoutId="hero-avatar" isResume={true} />}
            </div>
          </div>
          <div className="mt-12 space-y-8 border-t border-[hsl(var(--border))] pt-8">
            {hasCmsResume && cmsResume ? (
              [...cmsResume.sections]
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((sec) => (
                  <ResumeBlock
                    key={sec.id}
                    title={lang === "zh" ? sec.titleZh : sec.titleEn}
                  >
                    {sec.items.map((item) => {
                      const title = (lang === "zh" ? item.titleZh : item.titleEn) || (lang === "zh" ? item.titleEn : item.titleZh) || item.title || "";
                      const subtitle = (lang === "zh" ? item.subtitleZh : item.subtitleEn) || (lang === "zh" ? item.subtitleEn : item.subtitleZh) || item.subtitle || "";
                      const contentMd = (lang === "zh" ? item.contentMarkdownZh : item.contentMarkdownEn) || (lang === "zh" ? item.contentMarkdownEn : item.contentMarkdownZh) || item.contentMarkdown || "";
                      return (
                        <div key={item.id} className="mb-6 last:mb-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                            {title && <p className="font-semibold">{title}</p>}
                            {item.period && (
                              <p className="text-[hsl(var(--text-muted))] text-sm text-right shrink-0">
                                {item.period}
                              </p>
                            )}
                          </div>
                          {subtitle && (
                            <p className="text-[hsl(var(--text-muted))] mt-0.5">{subtitle}</p>
                          )}
                          {contentMd && (
                            <div className="mt-2 prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 text-[hsl(var(--text-muted))]">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {contentMd}
                              </ReactMarkdown>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </ResumeBlock>
                ))
            ) : (
              <>
                <ResumeBlock title={lang === "zh" ? "教育背景" : "Education"}>
                  {fallbackData.education.map((e) => (
                    <div key={e.school} className="mb-4 last:mb-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                        <p className="font-semibold">{e.school}</p>
                        <p className="text-[hsl(var(--text-muted))] text-sm text-right shrink-0">
                          {e.period}
                        </p>
                      </div>
                      <p className="text-[hsl(var(--text-muted))] mt-0.5">{e.degree}</p>
                    </div>
                  ))}
                </ResumeBlock>
                <ResumeBlock title={lang === "zh" ? "工作/实习经历" : "Work / Internship Experience"}>
                  {fallbackData.work.map((w) => (
                    <div key={w.company} className="mb-6 last:mb-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                        <p className="font-semibold">{w.company}</p>
                        <p className="text-[hsl(var(--text-muted))] text-sm text-right shrink-0">
                          {w.period}
                        </p>
                      </div>
                      <p className="text-[hsl(var(--text-muted))] mt-0.5">{w.role}</p>
                      <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-[hsl(var(--text-muted))]">
                        {w.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </ResumeBlock>
                <ResumeBlock title={lang === "zh" ? "项目经历" : "Projects"}>
                  {fallbackData.projects.map((p) => (
                    <div key={p.title} className="mb-4 last:mb-0">
                      <p className="font-semibold">{p.title}</p>
                      <p className="text-[hsl(var(--text-muted))] text-sm mt-0.5">{p.desc}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {p.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-lg bg-[hsl(var(--accent-muted))] px-2 py-0.5 text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </ResumeBlock>
                <ResumeBlock title={lang === "zh" ? "专业技能" : "Skills"}>
                  <p>{fallbackData.skills.join(" · ")}</p>
                </ResumeBlock>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SharedAvatar({ layoutId, isResume }: { layoutId: string; isResume: boolean }) {
  return (
    <motion.div
      layoutId={layoutId}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={
        isResume
          ? "relative h-28 w-28 flex-shrink-0 overflow-visible md:h-32 md:w-32"
          : "relative h-full w-full flex-shrink-0 overflow-visible"
      }
    >
      <motion.div
        layout={false}
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformOrigin: "center center" }}
        whileHover={
          !isResume
            ? { y: -8, transition: { duration: 0.2 } }
            : undefined
        }
      >
        <div
          className={
            isResume
              ? "relative aspect-square h-full w-full overflow-hidden rounded-2xl"
              : "relative aspect-square h-full w-full overflow-hidden rounded-full"
          }
        >
          <Image
            src={AVATAR_SRC}
            alt="Avatar"
            fill
            className="object-cover"
            priority={!isResume}
            sizes={isResume ? "128px" : "256px"}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function SharedName({
  layoutId,
  isResume,
  lang,
  customName,
}: {
  layoutId: string;
  isResume: boolean;
  lang: "en" | "zh";
  customName?: string;
}) {
  const name = customName ?? (lang === "zh" ? "李光浩" : "Guanghao Li");
  return (
    <motion.h1
      layoutId={layoutId}
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={
        isResume
          ? "text-2xl font-bold tracking-tight md:text-3xl"
          : "mt-8 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-semibold"
      }
    >
      <motion.span
        layout
        initial={{ opacity: 0.85 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {name}
      </motion.span>
    </motion.h1>
  );
}

function ResumeBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[hsl(var(--text-muted))]">
        {title}
      </h3>
      <div className="text-base">{children}</div>
    </div>
  );
}
