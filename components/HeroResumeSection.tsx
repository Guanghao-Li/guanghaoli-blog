"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useScrollSection } from "@/contexts/ScrollSectionContext";

const AVATAR_SRC = "/avatar-placeholder.svg";

export default function HeroResumeSection() {
  const heroRef = useRef<HTMLElement>(null);
  const resumeRef = useRef<HTMLElement>(null);
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
      <HeroContent registerRef={registerHero} isResumeActive={isResumeActive} />
      <ResumeContent registerRef={registerResume} isResumeActive={isResumeActive} />
    </>
  );
}

function HeroContent({
  registerRef,
  isResumeActive,
}: {
  registerRef: (el: HTMLElement | null) => void;
  isResumeActive: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.7], [1, 0.6, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.4, 0.7], [0, 4, 12]);
  const blurFilter = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <section
      ref={registerRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden scroll-snap-start"
    >
      <div ref={containerRef} className="absolute inset-0" aria-hidden />
      {!isResumeActive && (
        <motion.div
          style={{ y, opacity, filter: blurFilter }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6"
        >
          <div className="flex-shrink-0 w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64">
            <SharedAvatar layoutId="hero-avatar" isResume={false} />
          </div>
          <SharedName layoutId="hero-name" isResume={false} />
          <p className="mt-4 max-w-md text-center text-lg text-[hsl(var(--text-muted))] sm:text-xl">
            全栈工程师 · 创造简洁而富有质感的产品
          </p>
        </motion.div>
      )}
    </section>
  );
}

function ResumeContent({
  registerRef,
  isResumeActive,
}: {
  registerRef: (el: HTMLElement | null) => void;
  isResumeActive: boolean;
}) {
  return (
    <section
      ref={registerRef}
      id="resume"
      className="relative flex min-h-screen w-full flex-col overflow-auto scroll-snap-start px-6 py-16 md:px-12 md:py-24"
    >
      <div className="mx-auto w-full max-w-3xl">
        <div className="relative flex min-h-[200px] flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            {isResumeActive && <SharedName layoutId="hero-name" isResume={true} />}
            <div className="mt-4 space-y-2 text-[hsl(var(--text-muted))]">
              <p>📧 example@stevens.edu</p>
              <p>📱 +1 (201) XXX-XXXX</p>
              <p>📍 Hoboken, NJ</p>
            </div>
          </div>
          <div className="mt-6 flex-shrink-0 md:mt-0">
            {isResumeActive && <SharedAvatar layoutId="hero-avatar" isResume={true} />}
          </div>
        </div>
        <div className="mt-12 space-y-6 border-t border-[hsl(var(--border))] pt-8">
          <ResumeBlock title="教育背景">
            <p className="font-semibold">Stevens Institute of Technology</p>
            <p className="text-[hsl(var(--text-muted))]">Master of Science, Electrical Engineering</p>
          </ResumeBlock>
          <ResumeBlock title="专业技能">
            <p>全栈开发 · TypeScript · React · Next.js · IoT · 数据可视化</p>
          </ResumeBlock>
        </div>
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
            ? {
                y: -8,
                transition: { duration: 0.2 },
              }
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
            alt="个人头像"
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

function SharedName({ layoutId, isResume }: { layoutId: string; isResume: boolean }) {
  return (
    <motion.h1
      layoutId={layoutId}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={
        isResume
          ? "text-2xl font-bold tracking-tight md:text-3xl"
          : "mt-8 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
      }
    >
      Lee
    </motion.h1>
  );
}

function ResumeBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[hsl(var(--text-muted))]">
        {title}
      </h3>
      <div className="text-base">{children}</div>
    </div>
  );
}
