"use client";

import HeroResumeSection from "@/components/HeroResumeSection";
import ProjectSection from "@/components/ProjectSection";
import BlogSection from "@/components/BlogSection";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  return (
    <main className="scroll-snap-container overflow-x-hidden">
      <HeroResumeSection />
      <div className="scroll-snap-section w-full flex flex-col">
        <ProjectSection />
      </div>
      <div className="scroll-snap-section w-full flex flex-col">
        <BlogSection />
      </div>
      <div className="scroll-snap-section w-full flex flex-col">
        <Dashboard />
      </div>
    </main>
  );
}
