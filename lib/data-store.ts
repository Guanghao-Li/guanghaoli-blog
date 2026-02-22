import { PROJECTS } from "./projects-data";
import type { ResumeData } from "./resume-types";
import { DEFAULT_PAPER_STYLE } from "./resume-types";

export interface CmsData {
  hero: {
    name: string;
    nameZh: string;
    subtitle: string;
    subtitleZh: string;
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
    colSpan?: number;
    rowSpan?: number;
    order?: number;
    coverImage?: string;
    readTime?: number;
    pdfData?: string;
    pdfName?: string;
    createdAt?: string;
    updatedAt?: string;
    markdownEn?: string;
    markdownZh?: string;
    markdown?: string;
    uiSettings?: {
      titleSize?: string;
      titleLeftOffsetPercent?: number;
      contentWidthPercent?: number;
    };
  }>;
  blogs: Array<{
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
  }>;
  iot: {
    title: string;
    titleZh: string;
    description: string;
    descriptionZh: string;
    chartConfig?: {
      chartType?: "line" | "bar" | "area";
      apiKey?: string;
      yAxisLabel?: string;
      metricKey?: string;
    };
  };
  dashboard: {
    widgets: Array<{
      id: string;
      type: "hardware-stack" | "iot-monitor" | "pcb-showcase" | "github-stats";
      order?: number;
      colSpan?: number;
      rowSpan?: number;
      config?: Record<string, any>;
    }>;
  };
}

export const DEFAULT_DATA: CmsData = {
  hero: {
    name: "Guanghao Li",
    nameZh: "李光浩",
    subtitle: "Embedded Systems Engineer",
    subtitleZh: "嵌入式系统工程师 / Embedded Systems Engineer",
    phoneEn: "",
    phoneZh: "",
    emailEn: "",
    emailZh: "",
    addressEn: "",
    addressZh: "",
    infoFontSize: 14,
    infoPositionX: 0,
    infoPositionY: 0,
    emojiSize: 28,
    minAngle: 45,
    maxAngle: 135,
    minVelocity: 5,
    maxVelocity: 12,
    gravity: 0.05,
    friction: 0.96,
  },
  resume: {
    nameEn: "Guanghao Li",
    nameZh: "李光浩",
    contentEn: "## Education\n\n- **Stevens Institute of Technology** - M.Eng. EE\n- **Hefei University of Technology** - B.S. Biomedical Engineering\n\n## Experience\n\n- Embedded Systems Engineer\n- Full-stack Development",
    contentZh: "## 教育背景\n\n- **Stevens Institute of Technology** - 电气工程硕士\n- **合肥工业大学** - 生物医学工程学士\n\n## 经历\n\n- 嵌入式系统工程师\n- 全栈开发",
    paperStyle: DEFAULT_PAPER_STYLE,
  },
  projects: PROJECTS,
  blogs: [],
  iot: {
    title: "IoT Dashboard",
    titleZh: "IoT Dashboard",
    description: "Reserved visualization area for future MCU data",
    descriptionZh: "为未来单片机数据预留的可视化区域",
    chartConfig: {
      chartType: "line" as const,
      apiKey: "",
      yAxisLabel: "Value",
      metricKey: "default",
    },
  },
  dashboard: {
    widgets: [
      { id: "w1", type: "hardware-stack", order: 0, colSpan: 1, rowSpan: 1, config: { stack: ["STM32", "ESP32", "Raspberry Pi"] } },
      { id: "w2", type: "iot-monitor", order: 1, colSpan: 1, rowSpan: 1, config: {} },
      { id: "w3", type: "pcb-showcase", order: 2, colSpan: 1, rowSpan: 1, config: { title: "PCB Design" } },
      { id: "w4", type: "github-stats", order: 3, colSpan: 1, rowSpan: 1, config: { username: "" } },
    ],
  },
};

function sectionsToMarkdownEn(sections: any[]): string {
  if (!Array.isArray(sections)) return "";
  return sections
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((sec) => {
      const title = sec.titleEn || sec.titleZh || "Section";
      const items = (sec.items || []).map((i: any) => {
        const t = i.titleEn || i.titleZh || i.title || "";
        const sub = i.subtitleEn || i.subtitleZh || i.subtitle || "";
        const period = i.period ? ` *${i.period}*` : "";
        const body = i.contentMarkdownEn || i.contentMarkdownZh || i.contentMarkdown || "";
        return `### ${t}${period}\n${sub ? `${sub}\n\n` : ""}${body}`;
      }).join("\n\n");
      return `## ${title}\n\n${items}`;
    })
    .join("\n\n");
}

function sectionsToMarkdownZh(sections: any[]): string {
  if (!Array.isArray(sections)) return "";
  return sections
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((sec) => {
      const title = sec.titleZh || sec.titleEn || "区块";
      const items = (sec.items || []).map((i: any) => {
        const t = i.titleZh || i.titleEn || i.title || "";
        const sub = i.subtitleZh || i.subtitleEn || i.subtitle || "";
        const period = i.period ? ` *${i.period}*` : "";
        const body = i.contentMarkdownZh || i.contentMarkdownEn || i.contentMarkdown || "";
        return `### ${t}${period}\n${sub ? `${sub}\n\n` : ""}${body}`;
      }).join("\n\n");
      return `## ${title}\n\n${items}`;
    })
    .join("\n\n");
}

export function migrateResume(parsed: any): ResumeData {
  const def = DEFAULT_DATA.resume;
  const r = parsed?.resume;
  if (!r) return def;
  if (r.contentEn !== undefined || r.contentZh !== undefined) {
    return {
      nameEn: r.nameEn ?? def.nameEn,
      nameZh: r.nameZh ?? def.nameZh,
      contentEn: r.contentEn ?? def.contentEn,
      contentZh: r.contentZh ?? def.contentZh,
      paperStyle: r.paperStyle ?? def.paperStyle,
    };
  }
  const sections = r.sections ?? [];
  return {
    nameEn: r.nameEn ?? r.personal?.en?.name ?? def.nameEn,
    nameZh: r.nameZh ?? r.personal?.zh?.name ?? def.nameZh,
    contentEn: sectionsToMarkdownEn(sections) || def.contentEn,
    contentZh: sectionsToMarkdownZh(sections) || def.contentZh,
    paperStyle: def.paperStyle,
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
