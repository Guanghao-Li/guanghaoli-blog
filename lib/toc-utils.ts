import { slugify } from "./slug";

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3; // H2=章节, H3=小节；H1 不参与 TOC
}

/** 仅提取 H2 (##) 和 H3 (###)，忽略 H1 */
export function extractToc(markdown: string): TocEntry[] {
  const entries: TocEntry[] = [];
  const lines = markdown.split("\n");

  for (const line of lines) {
    const match = line.match(/^#{2,3}\s+(.+)$/);
    if (!match) continue;

    const level = (line.startsWith("###") ? 3 : 2) as 2 | 3;
    const text = match[1].trim();
    const id = slugify(text);

    entries.push({ id, text, level });
  }

  return entries;
}
