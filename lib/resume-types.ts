export type Lang = "en" | "zh";

/** 新简历结构：Markdown 驱动 + 纸张样式 */
export interface ResumePaperStyle {
  maxWidth?: string;
  minHeight?: string;
  theme?: "default" | "blueprint";
}

export interface ResumeData {
  nameEn: string;
  nameZh: string;
  contentEn: string;
  contentZh: string;
  paperStyle?: ResumePaperStyle;
  infoFontSize?: number;
  infoPositionX?: number;
  infoPositionY?: number;
  /** @deprecated 兼容旧结构，优先使用 contentEn/contentZh */
  basicInfo?: any[];
  sections?: any[];
}

export const DEFAULT_PAPER_STYLE: ResumePaperStyle = {
  maxWidth: "max-w-4xl",
  minHeight: "min-h-[800px]",
  theme: "default",
};
