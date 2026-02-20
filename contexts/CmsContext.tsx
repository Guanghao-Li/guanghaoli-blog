"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { PROJECTS, type Project } from "@/lib/projects-data";
import type { ResumeData } from "@/lib/resume-types";

interface CmsDataResponse {
  projects?: Project[];
  resume?: ResumeData;
}

const CmsContext = createContext<{
  projects: Project[];
  resume: ResumeData | null;
  refresh: () => void;
} | null>(null);

const DEFAULT_RESUME: ResumeData = {
  nameEn: "Guanghao Li",
  nameZh: "李光浩",
  basicInfo: [],
  sections: [],
};

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [resume, setResume] = useState<ResumeData | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/cms");
      if (!res.ok) return;
      const data: CmsDataResponse = await res.json();
      if (Array.isArray(data.projects) && data.projects.length > 0) {
        setProjects(data.projects as Project[]);
      }
      if (data.resume) {
        setResume(data.resume);
      }
    } catch {
      // Keep fallbacks
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <CmsContext.Provider value={{ projects, resume, refresh }}>
      {children}
    </CmsContext.Provider>
  );
}

export function useCmsProjects() {
  const ctx = useContext(CmsContext);
  return ctx?.projects ?? PROJECTS;
}

export function useCmsResume(): ResumeData | null {
  const ctx = useContext(CmsContext);
  return ctx?.resume ?? null;
}
