import { PROJECTS } from "./projects-data";
import type { ResumeData } from "./resume-types";

export interface CmsData {
  hero: {
    name: string;
    nameZh: string;
    subtitle: string;
    subtitleZh: string;
    avatar?: string;
  };
  resume: ResumeData;
  projects: Array<{
    id: string;
    title: string;
    titleZh: string;
    description: string;
    descriptionZh: string;
    tags: string[];
    size: "large" | "medium";
    markdownEn?: string;
    markdownZh?: string;
    markdown?: string;
    uiSettings?: {
      titleSize?: string;
      titleLeftOffsetPercent?: number;
      contentWidthPercent?: number;
    };
  }>;
  iot: {
    title: string;
    titleZh: string;
    description: string;
    descriptionZh: string;
  };
}

export const DEFAULT_DATA: CmsData = {
  hero: {
    name: "Guanghao Li",
    nameZh: "李光浩",
    subtitle: "Embedded Systems Engineer",
    subtitleZh: "嵌入式系统工程师 / Embedded Systems Engineer",
  },
  resume: {
    nameEn: "Guanghao Li",
    nameZh: "李光浩",
    basicInfo: [
      { id: "1", labelEn: "Location", labelZh: "居住地", valueEn: "Hoboken, NJ", valueZh: "湖北武汉" },
      { id: "2", labelEn: "Phone", labelZh: "电话", valueEn: "+1 5513879325", valueZh: "+86 18976620394" },
      { id: "3", labelEn: "Email", labelZh: "邮箱", valueEn: "gli42@stevens.edu", valueZh: "leegh2248@outlook.com" },
    ],
    sections: [
      { id: "edu", titleEn: "Education", titleZh: "教育背景", order: 0, items: [] },
      { id: "work", titleEn: "Work Experience", titleZh: "工作经历", order: 1, items: [] },
      { id: "skills", titleEn: "Skills", titleZh: "专业技能", order: 2, items: [] },
    ],
  },
  projects: PROJECTS,
  iot: {
    title: "IoT Dashboard",
    titleZh: "IoT Dashboard",
    description: "Reserved visualization area for future MCU data",
    descriptionZh: "为未来单片机数据预留的可视化区域",
  },
};

function migrateResumeItem(it: any): any {
  if (!it) return it;
  const hasNew = "titleEn" in it || "titleZh" in it;
  if (hasNew) return it;
  const oldTitle = it.title ?? "";
  const oldSub = it.subtitle ?? "";
  const oldMd = it.contentMarkdown ?? "";
  return {
    ...it,
    titleEn: it.titleEn ?? oldTitle,
    titleZh: it.titleZh ?? oldTitle,
    subtitleEn: it.subtitleEn ?? oldSub,
    subtitleZh: it.subtitleZh ?? oldSub,
    contentMarkdownEn: it.contentMarkdownEn ?? oldMd,
    contentMarkdownZh: it.contentMarkdownZh ?? oldMd,
  };
}

function migrateResumeItems(r: ResumeData): ResumeData {
  return {
    ...r,
    sections: r.sections.map((sec) => ({
      ...sec,
      items: sec.items.map(migrateResumeItem),
    })),
  };
}

export function migrateResume(parsed: any): ResumeData {
  const def = DEFAULT_DATA.resume;
  const r = parsed?.resume;
  if (!r) return def;
  if (Array.isArray(r.basicInfo) && Array.isArray(r.sections)) {
    return migrateResumeItems(r as ResumeData);
  }
  const basicInfo = [
    { id: "1", labelEn: "Location", labelZh: "居住地", valueEn: r.personal?.en?.location ?? "", valueZh: r.personal?.zh?.location ?? "" },
    { id: "2", labelEn: "Phone", labelZh: "电话", valueEn: r.personal?.en?.phone ?? "", valueZh: r.personal?.zh?.phone ?? "" },
    { id: "3", labelEn: "Email", labelZh: "邮箱", valueEn: r.personal?.en?.email ?? "", valueZh: r.personal?.zh?.email ?? "" },
  ];
  const sections: ResumeData["sections"] = [];
  if (Array.isArray(r.education) && r.education.length > 0) {
    sections.push({
      id: "edu",
      titleEn: "Education",
      titleZh: "教育背景",
      order: 0,
      items: r.education.map((e: any, i: number) => ({
        id: `e-${i}`,
        period: e.period ?? "",
        titleEn: e.school ?? "",
        titleZh: e.school ?? "",
        subtitleEn: e.degree ?? "",
        subtitleZh: e.degree ?? "",
        contentMarkdownEn: "",
        contentMarkdownZh: "",
      })),
    });
  }
  if (Array.isArray(r.work) && r.work.length > 0) {
    sections.push({
      id: "work",
      titleEn: "Work Experience",
      titleZh: "工作经历",
      order: 1,
      items: r.work.map((w: any, i: number) => {
        const md = (w.bullets ?? []).map((b: string) => `- ${b}`).join("\n");
        return {
          id: `w-${i}`,
          period: w.period ?? "",
          titleEn: w.company ?? "",
          titleZh: w.company ?? "",
          subtitleEn: w.role ?? "",
          subtitleZh: w.role ?? "",
          contentMarkdownEn: md,
          contentMarkdownZh: md,
        };
      }),
    });
  }
  return {
    nameEn: r.personal?.en?.name ?? def.nameEn,
    nameZh: r.personal?.zh?.name ?? def.nameZh,
    basicInfo,
    sections: sections.length > 0 ? sections : def.sections,
  };
}

export function migrateProjects(projects: any[]): CmsData["projects"] {
  return projects.map((p: any) => {
    const legacyMd = p.markdown ?? "";
    return {
      ...p,
      markdownEn: p.markdownEn ?? legacyMd,
      markdownZh: p.markdownZh ?? legacyMd,
    };
  });
}
