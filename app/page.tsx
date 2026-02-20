"use client";

import HeroResumeSection from "@/components/HeroResumeSection";
import ProjectSection from "@/components/ProjectSection";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  return (
    <main className="scroll-snap-container">
      <HeroResumeSection />
      <div className="scroll-snap-section w-full flex flex-col">
        <ProjectSection />
      </div>
      <div className="scroll-snap-section w-full flex flex-col">
        <Dashboard />
      </div>
    </main>
  );
}
