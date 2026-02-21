"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCardGrid, ProjectCardExpanded } from "./ProjectCard";
import { useCmsProjects } from "@/contexts/CmsContext";
import { cn } from "@/lib/utils";
import { useScrollSection } from "@/contexts/ScrollSectionContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProjectDetail } from "@/contexts/ProjectDetailContext";

export default function ProjectSection() {
  const projects = useCmsProjects();
  const { selectedId, setSelectedId } = useProjectDetail();
  const projectsRef = useRef<HTMLElement | null>(null);
  const { registerSection } = useScrollSection();
  const { lang, t } = useLanguage();
  const selectedProject = projects.find((p) => p.id === selectedId);

  const registerProjectsRef = (el: HTMLElement | null) => {
    (projectsRef as React.MutableRefObject<HTMLElement | null>).current = el;
    registerSection("projects", el);
  };

  return (
    <>
      <section
        ref={registerProjectsRef}
        id="projects"
        className="flex min-h-screen w-full flex-col items-center justify-center gap-6 px-4 py-8 md:px-8 md:py-12"
      >
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t("Projects", "项目")}
          </h2>
          <p className="mt-2 text-[hsl(var(--text-muted))]">
            {t("Featured works", "精选作品")}
          </p>
        </div>
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 md:auto-rows-[minmax(180px,auto)]">
          {[...projects]
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((project, index) => {
              const colSpan = project.colSpan ?? (project.size === "large" ? 2 : 1);
              const rowSpan = project.rowSpan ?? 1;
              const colClass = colSpan === 2 ? "md:col-span-2" : "";
              const rowClass = rowSpan === 2 ? "md:row-span-2" : "";
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={cn(colClass, rowClass, selectedId === project.id && "min-h-[180px]")}
                >
                  {selectedId !== project.id && (
                    <ProjectCardGrid
                      project={project}
                      layoutId={`project-${project.id}`}
                      onClick={() => setSelectedId(project.id)}
                      lang={lang}
                    />
                  )}
                  {selectedId === project.id && (
                    <div
                      className={cn("min-h-[180px] rounded-3xl opacity-0", colClass, rowClass)}
                      aria-hidden
                    />
                  )}
                </motion.div>
              );
            })}
        </div>
      </section>
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
          >
            <ProjectCardExpanded
              project={selectedProject}
              layoutId={`project-${selectedProject.id}`}
              lang={lang}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
