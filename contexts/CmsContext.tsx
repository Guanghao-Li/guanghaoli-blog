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

interface HeroData {
  name?: string;
  nameZh?: string;
  subtitle?: string;
  subtitleZh?: string;
  avatar?: string;
  phoneEn?: string;
  phoneZh?: string;
  emailEn?: string;
  emailZh?: string;
  addressEn?: string;
  addressZh?: string;
  infoFontSize?: number;
  infoPositionX?: number;
  infoPositionY?: number;
  emojiSize?: number;
  minAngle?: number;
  maxAngle?: number;
  minVelocity?: number;
  maxVelocity?: number;
  gravity?: number;
  friction?: number;
}

export interface DashboardWidget {
  id: string;
  type: "hardware-stack" | "iot-monitor" | "pcb-showcase" | "github-stats";
  order?: number;
  colSpan?: number;
  rowSpan?: number;
  config?: Record<string, any>;
}

export interface IotData {
  title?: string;
  titleZh?: string;
  description?: string;
  descriptionZh?: string;
  chartConfig?: {
    chartType?: "line" | "bar" | "area";
    apiKey?: string;
    yAxisLabel?: string;
    metricKey?: string;
  };
}

export interface Blog {
  id: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  contentEn: string;
  contentZh: string;
  coverImage?: string;
  colSpan?: number;
  rowSpan?: number;
  order?: number;
  readTime?: number;
  pdfData?: string;
  pdfName?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CmsDataResponse {
  projects?: Project[];
  blogs?: Blog[];
  resume?: ResumeData;
  hero?: HeroData;
  dashboard?: { widgets: DashboardWidget[] };
  iot?: IotData;
}

const CmsContext = createContext<{
  projects: Project[];
  blogs: Blog[];
  resume: ResumeData | null;
  hero: HeroData | null;
  dashboard: { widgets: DashboardWidget[] };
  iot: IotData | null;
  refresh: () => void;
} | null>(null);

const DEFAULT_DASHBOARD = { widgets: [] as DashboardWidget[] };

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [hero, setHero] = useState<HeroData | null>(null);
  const [dashboard, setDashboard] = useState<{ widgets: DashboardWidget[] }>(DEFAULT_DASHBOARD);
  const [iot, setIot] = useState<IotData | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/cms");
      if (!res.ok) return;
      const data: CmsDataResponse = await res.json();
      if (Array.isArray(data.projects) && data.projects.length > 0) {
        setProjects(data.projects as Project[]);
      }
      if (Array.isArray(data.blogs)) {
        setBlogs(data.blogs as Blog[]);
      }
      if (data.resume) {
        setResume(data.resume);
      }
      if (data.hero) {
        setHero(data.hero);
      }
      if (data.dashboard?.widgets) {
        setDashboard({ widgets: data.dashboard.widgets });
      }
      if (data.iot) {
        setIot(data.iot);
      }
    } catch {
      // Keep fallbacks
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <CmsContext.Provider value={{ projects, blogs, resume, hero, dashboard, iot, refresh }}>
      {children}
    </CmsContext.Provider>
  );
}

export function useCmsProjects() {
  const ctx = useContext(CmsContext);
  return ctx?.projects ?? PROJECTS;
}

export function useCmsBlogs() {
  const ctx = useContext(CmsContext);
  return ctx?.blogs ?? [];
}

export function useCmsResume(): ResumeData | null {
  const ctx = useContext(CmsContext);
  return ctx?.resume ?? null;
}

export function useCmsHero(): HeroData | null {
  const ctx = useContext(CmsContext);
  return ctx?.hero ?? null;
}

export function useCmsDashboard(): { widgets: DashboardWidget[] } {
  const ctx = useContext(CmsContext);
  return ctx?.dashboard ?? DEFAULT_DASHBOARD;
}

export function useCmsIot(): IotData | null {
  const ctx = useContext(CmsContext);
  return ctx?.iot ?? null;
}
