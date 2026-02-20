export interface ResumeBasicInfoItem {
  id: string;
  labelEn: string;
  labelZh: string;
  valueEn: string;
  valueZh: string;
}

export interface ResumeSectionItem {
  id: string;
  period: string;
  titleEn: string;
  titleZh: string;
  subtitleEn?: string;
  subtitleZh?: string;
  contentMarkdownEn: string;
  contentMarkdownZh: string;
  /** @deprecated 保留以兼容旧数据，优先使用 titleEn/titleZh */
  title?: string;
  /** @deprecated 保留以兼容旧数据 */
  subtitle?: string;
  /** @deprecated 保留以兼容旧数据，优先使用 contentMarkdownEn/contentMarkdownZh */
  contentMarkdown?: string;
}

export interface ResumeSection {
  id: string;
  titleEn: string;
  titleZh: string;
  order?: number;
  items: ResumeSectionItem[];
}

export interface ResumeData {
  nameEn: string;
  nameZh: string;
  basicInfo: ResumeBasicInfoItem[];
  sections: ResumeSection[];
}

export function createEmptyBasicInfoItem(): ResumeBasicInfoItem {
  return { id: String(Date.now()), labelEn: "", labelZh: "", valueEn: "", valueZh: "" };
}

export function createEmptySectionItem(): ResumeSectionItem {
  return {
    id: String(Date.now()),
    period: "",
    titleEn: "",
    titleZh: "",
    subtitleEn: "",
    subtitleZh: "",
    contentMarkdownEn: "",
    contentMarkdownZh: "",
  };
}

export function createEmptySection(): ResumeSection {
  return { id: String(Date.now()), titleEn: "", titleZh: "", order: 0, items: [] };
}
