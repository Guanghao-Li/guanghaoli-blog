"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCardGrid, ProjectCardExpanded, type Project } from "./ProjectCard";
import { cn } from "../lib/utils";
import { useScrollSection } from "../contexts/ScrollSectionContext";

const PROJECTS: Project[] = [
  {
    id: "1",
    title: "智能家居控制中心",
    description: "基于 Next.js 与 IoT 的智能家居管理系统，支持多设备联动与场景编排。",
    tags: ["Next.js", "TypeScript", "IoT", "Framer Motion"],
    size: "large",
  },
  {
    id: "2",
    title: "设计系统组件库",
    description: "可复用的 UI 组件库，遵循 Apple HIG 设计规范。",
    tags: ["React", "Tailwind", "Storybook"],
    size: "medium",
  },
  {
    id: "3",
    title: "数据可视化 Dashboard",
    description: "实时数据展示与图表分析，支持多数据源接入。",
    tags: ["Chart.js", "WebSocket", "Node.js"],
    size: "medium",
  },
];

export default function ProjectSection() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const projectsRef = useRef<HTMLElement | null>(null);
  const { registerSection } = useScrollSection();
  const selectedProject = PROJECTS.find((p) => p.id === selectedId);

  const registerProjectsRef = (el: HTMLElement | null) => {
    (projectsRef as React.MutableRefObject<HTMLElement | null>).current = el;
    registerSection("projects", el);
  };

  return (
    <>
      <section
        ref={registerProjectsRef}
        id="projects"
        className="flex min-h-screen w-full flex-col gap-6 overflow-y-auto px-4 py-16 scroll-snap-start md:px-8 md:py-24"
      >
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Projects</h2>
          <p className="mt-2 text-[hsl(var(--text-muted))]">精选作品</p>
        </div>
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 md:grid-rows-2">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {selectedId !== project.id && (
                <ProjectCardGrid
                  project={project}
                  layoutId={`project-${project.id}`}
                  onClick={() => setSelectedId(project.id)}
                />
              )}
              {selectedId === project.id && (
                <div
                  className={cn("min-h-[180px] rounded-3xl opacity-0", project.size === "large" && "md:col-span-2")}
                  aria-hidden
                />
              )}
            </motion.div>
          ))}
        </div>
      </section>
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedId(null)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <ProjectCardExpanded
                project={selectedProject}
                layoutId={`project-${selectedProject.id}`}
                onClose={() => setSelectedId(null)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
