import { slugify } from "./slug";

export interface TocEntry {
  id: string;
  text: string;
  level: 1 | 2 | 3;
}

export function extractToc(markdown: string): TocEntry[] {
  const entries: TocEntry[] = [];
  const lines = markdown.split("\n");

  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (!match) continue;

    const level = match[1].length as 1 | 2 | 3;
    const text = match[2].trim();
    const id = slugify(text);

    entries.push({ id, text, level });
  }

  return entries;
}
