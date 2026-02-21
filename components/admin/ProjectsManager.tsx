"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const TITLE_SIZE_OPTIONS = [
  { value: "text-2xl md:text-3xl", label: "2xl / 3xl (默认)" },
  { value: "text-2xl", label: "2xl" },
  { value: "text-3xl", label: "3xl" },
  { value: "text-4xl", label: "4xl" },
  { value: "text-5xl", label: "5xl" },
  { value: "text-6xl", label: "6xl" },
];

export default function ProjectsManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [data, setData] = useState<any>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [uiPanelOpen, setUiPanelOpen] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/cms")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setProjects(d.projects ?? []);
      })
      .catch(console.error);
  }, []);

  const save = async () => {
    if (!data) return;
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, projects }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const addProject = () => {
    const id = String(Date.now());
    const nextOrder = projects.length > 0 ? Math.max(...projects.map((p) => p.order ?? 0)) + 1 : 0;
    setProjects([
      ...projects,
      {
        id,
        title: "New Project",
        titleZh: "新项目",
        description: "",
        descriptionZh: "",
        tags: [],
        size: "medium",
        colSpan: 1,
        rowSpan: 1,
        order: nextOrder,
        coverImage: "",
        readTime: 0,
        markdownEn: "## Overview\n\nWrite project introduction.\n\n### Code Sample\n\n```typescript\nconst x = 1;\n```",
        markdownZh: "## 项目概述\n\n在此编写项目介绍。\n\n### 代码示例\n\n```typescript\nconst x = 1;\n```",
        uiSettings: {},
      },
    ]);
    setEditing(id);
  };

  const updateProject = (id: string, updates: Record<string, any>) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    setEditing(null);
  };

  if (!data) return <p className="mt-4">加载中...</p>;

  return (
    <div className="mt-6 space-y-4">
      <button
        onClick={addProject}
        className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
      >
        + 添加新项目
      </button>
      {projects.map((p) => (
        <div
          key={p.id}
          className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{p.title || "未命名项目"}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(editing === p.id ? null : p.id)}
                className="text-sm text-blue-600 hover:underline"
              >
                {editing === p.id ? "收起" : "编辑"}
              </button>
              <button
                onClick={() => removeProject(p.id)}
                className="text-sm text-red-500 hover:underline"
              >
                删除
              </button>
            </div>
          </div>
          {editing === p.id && (
            <div className="mt-4 space-y-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <label className="block text-xs text-zinc-500">封面图 URL 或 Base64</label>
                  <input
                    value={p.coverImage ?? ""}
                    onChange={(e) => updateProject(p.id, { coverImage: e.target.value })}
                    placeholder="/cover.jpg 或 data:image/..."
                    className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500">阅读时间 (分钟)</label>
                  <input
                    type="number"
                    min={0}
                    value={p.readTime ?? 0}
                    onChange={(e) => updateProject(p.id, { readTime: Math.max(0, Number(e.target.value) || 0) })}
                    className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                  />
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-4">
                <div>
                  <label className="block text-xs text-zinc-500">colSpan</label>
                  <select
                    value={p.colSpan ?? 1}
                    onChange={(e) => updateProject(p.id, { colSpan: Number(e.target.value) })}
                    className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-zinc-500">rowSpan</label>
                  <select
                    value={p.rowSpan ?? 1}
                    onChange={(e) => updateProject(p.id, { rowSpan: Number(e.target.value) })}
                    className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-zinc-500">order</label>
                  <input
                    type="number"
                    value={p.order ?? 0}
                    onChange={(e) => updateProject(p.id, { order: Number(e.target.value) || 0 })}
                    className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500">size</label>
                  <select
                    value={p.size ?? "medium"}
                    onChange={(e) => updateProject(p.id, { size: e.target.value as "large" | "medium" })}
                    className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                  >
                    <option value="medium">medium</option>
                    <option value="large">large</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <label className="block text-xs text-zinc-500">标题 (英文)</label>
                  <input
                    value={p.title}
                    onChange={(e) => updateProject(p.id, { title: e.target.value })}
                    className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500">标题 (中文)</label>
                  <input
                    value={p.titleZh}
                    onChange={(e) => updateProject(p.id, { titleZh: e.target.value })}
                    className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                  />
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <label className="block text-xs text-zinc-500">简短描述 (英文)</label>
                  <input
                    value={p.description ?? ""}
                    onChange={(e) => updateProject(p.id, { description: e.target.value })}
                    className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500">简短描述 (中文)</label>
                  <input
                    value={p.descriptionZh ?? ""}
                    onChange={(e) => updateProject(p.id, { descriptionZh: e.target.value })}
                    className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">正文内容 (Markdown) - 双语</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <span className="text-xs text-zinc-500">正文内容 (English)</span>
                    <textarea
                      value={p.markdownEn ?? p.markdown ?? ""}
                      onChange={(e) => updateProject(p.id, { markdownEn: e.target.value })}
                      rows={10}
                      placeholder="## Overview\n\nWrite project introduction in English..."
                      className="mt-0.5 w-full rounded border border-zinc-300 p-2 font-mono text-sm dark:border-zinc-600 dark:bg-zinc-900"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500">正文内容 (中文)</span>
                    <textarea
                      value={p.markdownZh ?? p.markdown ?? ""}
                      onChange={(e) => updateProject(p.id, { markdownZh: e.target.value })}
                      rows={10}
                      placeholder="## 项目概述\n\n在此编写中文项目介绍..."
                      className="mt-0.5 w-full rounded border border-zinc-300 p-2 font-mono text-sm dark:border-zinc-600 dark:bg-zinc-900"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-500">标签（逗号分隔）</label>
                <input
                  value={(p.tags ?? []).join(", ")}
                  onChange={(e) =>
                    updateProject(p.id, {
                      tags: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean),
                    })
                  }
                  className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                />
              </div>
              {/* UI 微调折叠面板 */}
              <div className="border-t border-zinc-200 dark:border-zinc-700 pt-3 mt-3">
                <button
                  type="button"
                  onClick={() => setUiPanelOpen((o) => ({ ...o, [p.id]: !o[p.id] }))}
                  className="flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  {uiPanelOpen[p.id] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  UI 微调 (UI Settings)
                </button>
                {uiPanelOpen[p.id] && (
                  <div className="mt-3 space-y-2 pl-4">
                    <div>
                      <label className="block text-xs text-zinc-500">标题文字大小 (Title Size)</label>
                      <select
                        value={p.uiSettings?.titleSize ?? "text-2xl md:text-3xl"}
                        onChange={(e) =>
                          updateProject(p.id, {
                            uiSettings: { ...(p.uiSettings ?? {}), titleSize: e.target.value },
                          })
                        }
                        className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                      >
                        {TITLE_SIZE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500">标题左侧偏移 % (Title Left Offset)</label>
                      <input
                        type="number"
                        min={5}
                        max={30}
                        value={p.uiSettings?.titleLeftOffsetPercent ?? 12}
                        onChange={(e) =>
                          updateProject(p.id, {
                            uiSettings: {
                              ...(p.uiSettings ?? {}),
                              titleLeftOffsetPercent: Math.min(30, Math.max(5, Number(e.target.value) || 12)),
                            },
                          })
                        }
                        className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500">正文内容宽度 % (Content Width)</label>
                      <select
                        value={String(p.uiSettings?.contentWidthPercent ?? 70)}
                        onChange={(e) =>
                          updateProject(p.id, {
                            uiSettings: {
                              ...(p.uiSettings ?? {}),
                              contentWidthPercent: Number(e.target.value),
                            },
                          })
                        }
                        className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                      >
                        <option value="60">60%</option>
                        <option value="70">70%</option>
                        <option value="80">80%</option>
                        <option value="90">90%</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
      <button
        onClick={save}
        disabled={saving}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {saving ? "保存中..." : saved ? "保存成功" : "保存更改"}
      </button>
    </div>
  );
}
