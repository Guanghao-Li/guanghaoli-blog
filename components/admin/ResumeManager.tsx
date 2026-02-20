"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import type {
  ResumeData,
  ResumeBasicInfoItem,
  ResumeSection,
  ResumeSectionItem,
} from "@/lib/resume-types";
import {
  createEmptyBasicInfoItem,
  createEmptySectionItem,
  createEmptySection,
} from "@/lib/resume-types";

export default function ResumeManager() {
  const [data, setData] = useState<any>(null);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/admin/cms")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setResume(d.resume ?? null);
      })
      .catch(console.error);
  }, []);

  const updateResume = (updates: Partial<ResumeData>) => {
    const next = { ...(resume ?? getDefaultResume()), ...updates };
    setResume(next);
    setData((prev: any) => (prev ? { ...prev, resume: next } : prev));
  };

  const save = async () => {
    if (!data || !resume) return;
    setSaving(true);
    try {
      await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, resume }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const addBasicInfo = () => {
    const items = [...(resume?.basicInfo ?? []), createEmptyBasicInfoItem()];
    updateResume({ basicInfo: items });
  };

  const updateBasicInfo = (id: string, updates: Partial<ResumeBasicInfoItem>) => {
    const items = (resume?.basicInfo ?? []).map((x) =>
      x.id === id ? { ...x, ...updates } : x
    );
    updateResume({ basicInfo: items });
  };

  const removeBasicInfo = (id: string) => {
    const items = (resume?.basicInfo ?? []).filter((x) => x.id !== id);
    updateResume({ basicInfo: items });
  };

  const addSection = () => {
    const sections = [...(resume?.sections ?? []), createEmptySection()];
    updateResume({ sections });
    setExpandedSections((o) => ({ ...o, [sections[sections.length - 1].id]: true }));
  };

  const updateSection = (id: string, updates: Partial<ResumeSection>) => {
    const sections = (resume?.sections ?? []).map((s) =>
      s.id === id ? { ...s, ...updates } : s
    );
    updateResume({ sections });
  };

  const removeSection = (id: string) => {
    const sections = (resume?.sections ?? []).filter((s) => s.id !== id);
    updateResume({ sections });
  };

  const addSectionItem = (sectionId: string) => {
    const sections = (resume?.sections ?? []).map((s) => {
      if (s.id !== sectionId) return s;
      return { ...s, items: [...s.items, createEmptySectionItem()] };
    });
    updateResume({ sections });
  };

  const updateSectionItem = (
    sectionId: string,
    itemId: string,
    updates: Partial<ResumeSectionItem>
  ) => {
    const sections = (resume?.sections ?? []).map((s) => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        items: s.items.map((i) => (i.id === itemId ? { ...i, ...updates } : i)),
      };
    });
    updateResume({ sections });
  };

  const removeSectionItem = (sectionId: string, itemId: string) => {
    const sections = (resume?.sections ?? []).map((s) => {
      if (s.id !== sectionId) return s;
      return { ...s, items: s.items.filter((i) => i.id !== itemId) };
    });
    updateResume({ sections });
  };

  if (!data) return <p className="mt-4">加载中...</p>;

  const r = resume ?? getDefaultResume();

  return (
    <div className="mt-6 max-w-3xl space-y-8">
      {/* 姓名 */}
      <section>
        <h2 className="text-lg font-medium">姓名 (Name)</h2>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-zinc-500">英文</label>
            <input
              value={r.nameEn}
              onChange={(e) => updateResume({ nameEn: e.target.value })}
              className="mt-0.5 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500">中文</label>
            <input
              value={r.nameZh}
              onChange={(e) => updateResume({ nameZh: e.target.value })}
              className="mt-0.5 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
        </div>
      </section>

      {/* 基础信息区 - 动态键值对 */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">基础信息 (Basic Info)</h2>
          <button
            type="button"
            onClick={addBasicInfo}
            className="flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
          >
            <Plus className="h-4 w-4" /> 添加字段
          </button>
        </div>
        <div className="mt-3 space-y-3">
          {r.basicInfo.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-start gap-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-700"
            >
              <input
                placeholder="标签英文 (Label EN)"
                value={item.labelEn}
                onChange={(e) => updateBasicInfo(item.id, { labelEn: e.target.value })}
                className="w-32 rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
              />
              <input
                placeholder="标签中文 (Label ZH)"
                value={item.labelZh}
                onChange={(e) => updateBasicInfo(item.id, { labelZh: e.target.value })}
                className="w-32 rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
              />
              <input
                placeholder="值英文"
                value={item.valueEn}
                onChange={(e) => updateBasicInfo(item.id, { valueEn: e.target.value })}
                className="min-w-[180px] flex-1 rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
              />
              <input
                placeholder="值中文"
                value={item.valueZh}
                onChange={(e) => updateBasicInfo(item.id, { valueZh: e.target.value })}
                className="min-w-[180px] flex-1 rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
              />
              <button
                type="button"
                onClick={() => removeBasicInfo(item.id)}
                className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                aria-label="删除"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 履历区块 - 动态大类 */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">履历区块 (Sections)</h2>
          <button
            type="button"
            onClick={addSection}
            className="flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
          >
            <Plus className="h-4 w-4" /> 添加区块
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {r.sections.map((sec) => (
            <div
              key={sec.id}
              className="rounded-xl border border-zinc-200 dark:border-zinc-700"
            >
              <div className="flex items-center gap-2 p-3">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedSections((o) => ({ ...o, [sec.id]: !o[sec.id] }))
                  }
                  className="text-zinc-500"
                >
                  {expandedSections[sec.id] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                <input
                  placeholder="区块标题 英文"
                  value={sec.titleEn}
                  onChange={(e) => updateSection(sec.id, { titleEn: e.target.value })}
                  className="flex-1 rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                />
                <input
                  placeholder="区块标题 中文"
                  value={sec.titleZh}
                  onChange={(e) => updateSection(sec.id, { titleZh: e.target.value })}
                  className="flex-1 rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                />
                <button
                  type="button"
                  onClick={() => addSectionItem(sec.id)}
                  className="rounded px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  + 条目
                </button>
                <button
                  type="button"
                  onClick={() => removeSection(sec.id)}
                  className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  aria-label="删除区块"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {expandedSections[sec.id] && (
                <div className="border-t border-zinc-200 p-3 dark:border-zinc-700">
                  {sec.items.map((item) => (
                    <div
                      key={item.id}
                      className="mb-4 rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 last:mb-0 dark:border-zinc-700 dark:bg-zinc-800/50"
                    >
                      <div className="grid gap-2 sm:grid-cols-2">
                        <input
                          placeholder="时间 Period"
                          value={item.period}
                          onChange={(e) =>
                            updateSectionItem(sec.id, item.id, { period: e.target.value })
                          }
                          className="rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                        />
                      </div>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs text-zinc-500">主标题 (EN)</label>
                          <input
                            placeholder="Title (English)"
                            value={item.titleEn ?? item.title ?? ""}
                            onChange={(e) =>
                              updateSectionItem(sec.id, item.id, { titleEn: e.target.value })
                            }
                            className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-500">主标题 (中文)</label>
                          <input
                            placeholder="主标题 (中文)"
                            value={item.titleZh ?? item.title ?? ""}
                            onChange={(e) =>
                              updateSectionItem(sec.id, item.id, { titleZh: e.target.value })
                            }
                            className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                          />
                        </div>
                      </div>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs text-zinc-500">副标题 (EN)</label>
                          <input
                            placeholder="Subtitle (English)"
                            value={item.subtitleEn ?? item.subtitle ?? ""}
                            onChange={(e) =>
                              updateSectionItem(sec.id, item.id, { subtitleEn: e.target.value })
                            }
                            className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-500">副标题 (中文)</label>
                          <input
                            placeholder="副标题 (中文)"
                            value={item.subtitleZh ?? item.subtitle ?? ""}
                            onChange={(e) =>
                              updateSectionItem(sec.id, item.id, { subtitleZh: e.target.value })
                            }
                            className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                          />
                        </div>
                      </div>
                      <div className="mt-2 grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs text-zinc-500">内容描述 / 正文 (EN, Markdown)</label>
                          <textarea
                            placeholder="Content (English, Markdown)"
                            value={item.contentMarkdownEn ?? item.contentMarkdown ?? ""}
                            onChange={(e) =>
                              updateSectionItem(sec.id, item.id, {
                                contentMarkdownEn: e.target.value,
                              })
                            }
                            rows={4}
                            className="mt-0.5 w-full rounded border border-zinc-300 p-2 font-mono text-sm dark:border-zinc-600 dark:bg-zinc-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-500">内容描述 / 正文 (中文, Markdown)</label>
                          <textarea
                            placeholder="内容描述 (中文, Markdown)"
                            value={item.contentMarkdownZh ?? item.contentMarkdown ?? ""}
                            onChange={(e) =>
                              updateSectionItem(sec.id, item.id, {
                                contentMarkdownZh: e.target.value,
                              })
                            }
                            rows={4}
                            className="mt-0.5 w-full rounded border border-zinc-300 p-2 font-mono text-sm dark:border-zinc-600 dark:bg-zinc-900"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSectionItem(sec.id, item.id)}
                        className="mt-2 text-sm text-red-500 hover:underline"
                      >
                        删除条目
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <button
        onClick={save}
        disabled={saving}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {saving ? "保存中..." : "保存更改"}
      </button>
    </div>
  );
}

function getDefaultResume(): ResumeData {
  return {
    nameEn: "Guanghao Li",
    nameZh: "李光浩",
    basicInfo: [],
    sections: [],
  };
}
