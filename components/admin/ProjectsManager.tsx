"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import CompressedImageInput from "./CompressedImageInput";
import PdfFileInput from "@/components/PdfFileInput";

const TITLE_SIZE_OPTIONS = [
  { value: "text-2xl md:text-3xl", label: "2xl / 3xl (默认)" },
  { value: "text-2xl", label: "2xl" },
  { value: "text-3xl", label: "3xl" },
  { value: "text-4xl", label: "4xl" },
  { value: "text-5xl", label: "5xl" },
  { value: "text-6xl", label: "6xl" },
];

const TABS = [
  { id: "zh" as const, label: "🇨🇳 中文内容" },
  { id: "en" as const, label: "🇺🇸 English" },
  { id: "settings" as const, label: "⚙️ 附件与设置" },
];

type TabId = (typeof TABS)[number]["id"];

const inputClass =
  "mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 dark:border-zinc-600 dark:bg-zinc-900";
const labelClass = "block text-xs font-medium text-zinc-500 dark:text-zinc-400";

function SegmentedControl({
  activeTab,
  onChange,
}: {
  activeTab: TabId;
  onChange: (id: TabId) => void;
}) {
  return (
    <div className="flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-700/50">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
            activeTab === tab.id
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-600 dark:text-zinc-50"
              : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [data, setData] = useState<any>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("zh");
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
    const nextOrder =
      projects.length > 0
        ? Math.max(...projects.map((p) => p.order ?? 0)) + 1
        : 0;
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
        markdownEn:
          "## Overview\n\nWrite project introduction.\n\n### Code Sample\n\n```typescript\nconst x = 1;\n```",
        markdownZh:
          "## 项目概述\n\n在此编写项目介绍。\n\n### 代码示例\n\n```typescript\nconst x = 1;\n```",
        pdfData: "",
        pdfName: "",
        uiSettings: {},
      },
    ]);
    setEditing(id);
    setActiveTab("zh");
  };

  const toggleEdit = (id: string) => {
    setEditing(editing === id ? null : id);
    setActiveTab("zh");
  };

  const updateProject = (id: string, updates: Record<string, any>) => {
    setProjects(
      projects.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
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
        + 添加项目
      </button>

      {projects.map((p) => (
        <div
          key={p.id}
          className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">
              {p.titleZh || p.title || "未命名项目"}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => toggleEdit(p.id)}
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
            <div className="mt-4 space-y-4">
              {/* ─── Segmented Control ─── */}
              <SegmentedControl
                activeTab={activeTab}
                onChange={setActiveTab}
              />

              {/* ─── Tab: 中文内容 ─── */}
              {activeTab === "zh" && (
                <div className="space-y-3">
                  <div>
                    <label className={labelClass}>标题 (中文)</label>
                    <input
                      value={p.titleZh}
                      onChange={(e) =>
                        updateProject(p.id, { titleZh: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>简短描述 (中文)</label>
                    <input
                      value={p.descriptionZh ?? ""}
                      onChange={(e) =>
                        updateProject(p.id, { descriptionZh: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>正文 Markdown (中文)</label>
                    <textarea
                      value={p.markdownZh ?? p.markdown ?? ""}
                      onChange={(e) =>
                        updateProject(p.id, { markdownZh: e.target.value })
                      }
                      rows={16}
                      placeholder="## 项目概述&#10;&#10;在此编写中文项目介绍..."
                      className={cn(inputClass, "font-mono")}
                    />
                  </div>
                </div>
              )}

              {/* ─── Tab: English Content ─── */}
              {activeTab === "en" && (
                <div className="space-y-3">
                  <div>
                    <label className={labelClass}>Title (English)</label>
                    <input
                      value={p.title}
                      onChange={(e) =>
                        updateProject(p.id, { title: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Description (English)</label>
                    <input
                      value={p.description ?? ""}
                      onChange={(e) =>
                        updateProject(p.id, { description: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Content Markdown (English)
                    </label>
                    <textarea
                      value={p.markdownEn ?? p.markdown ?? ""}
                      onChange={(e) =>
                        updateProject(p.id, { markdownEn: e.target.value })
                      }
                      rows={16}
                      placeholder="## Overview&#10;&#10;Write project introduction in English..."
                      className={cn(inputClass, "font-mono")}
                    />
                  </div>
                </div>
              )}

              {/* ─── Tab: 附件与设置 ─── */}
              {activeTab === "settings" && (
                <div className="space-y-4">
                  <CompressedImageInput
                    value={p.coverImage ?? ""}
                    onChange={(v) =>
                      updateProject(p.id, { coverImage: v })
                    }
                    label="封面图"
                    placeholder="选择图片或粘贴 URL/Base64"
                    maxSize={1200}
                    quality={0.8}
                  />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>阅读时间 (分钟)</label>
                      <input
                        type="number"
                        min={0}
                        value={p.readTime ?? 0}
                        onChange={(e) =>
                          updateProject(p.id, {
                            readTime: Math.max(
                              0,
                              Number(e.target.value) || 0
                            ),
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        标签（逗号分隔）
                      </label>
                      <input
                        value={(p.tags ?? []).join(", ")}
                        onChange={(e) =>
                          updateProject(p.id, {
                            tags: e.target.value
                              .split(",")
                              .map((s: string) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-4">
                    <div>
                      <label className={labelClass}>colSpan</label>
                      <select
                        value={p.colSpan ?? 1}
                        onChange={(e) =>
                          updateProject(p.id, {
                            colSpan: Number(e.target.value),
                          })
                        }
                        className={inputClass}
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>rowSpan</label>
                      <select
                        value={p.rowSpan ?? 1}
                        onChange={(e) =>
                          updateProject(p.id, {
                            rowSpan: Number(e.target.value),
                          })
                        }
                        className={inputClass}
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>order</label>
                      <input
                        type="number"
                        value={p.order ?? 0}
                        onChange={(e) =>
                          updateProject(p.id, {
                            order: Number(e.target.value) || 0,
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>size</label>
                      <select
                        value={p.size ?? "medium"}
                        onChange={(e) =>
                          updateProject(p.id, {
                            size: e.target.value as "large" | "medium",
                          })
                        }
                        className={inputClass}
                      >
                        <option value="medium">medium</option>
                        <option value="large">large</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>PDF 附件</label>
                    <div className="mt-1">
                      <PdfFileInput
                        value={p.pdfName ?? ""}
                        onChange={(base64, name) =>
                          updateProject(p.id, {
                            pdfData: base64,
                            pdfName: name,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* UI 微调折叠面板 */}
                  <div className="border-t border-zinc-200 pt-3 dark:border-zinc-700">
                    <button
                      type="button"
                      onClick={() =>
                        setUiPanelOpen((o) => ({
                          ...o,
                          [p.id]: !o[p.id],
                        }))
                      }
                      className="flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                      {uiPanelOpen[p.id] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      UI 微调 (UI Settings)
                    </button>
                    {uiPanelOpen[p.id] && (
                      <div className="mt-3 space-y-3 pl-4">
                        <div>
                          <label className={labelClass}>
                            标题文字大小
                          </label>
                          <select
                            value={
                              p.uiSettings?.titleSize ??
                              "text-2xl md:text-3xl"
                            }
                            onChange={(e) =>
                              updateProject(p.id, {
                                uiSettings: {
                                  ...(p.uiSettings ?? {}),
                                  titleSize: e.target.value,
                                },
                              })
                            }
                            className={inputClass}
                          >
                            {TITLE_SIZE_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>
                            标题左侧偏移 %
                          </label>
                          <input
                            type="number"
                            min={5}
                            max={30}
                            value={
                              p.uiSettings?.titleLeftOffsetPercent ?? 12
                            }
                            onChange={(e) =>
                              updateProject(p.id, {
                                uiSettings: {
                                  ...(p.uiSettings ?? {}),
                                  titleLeftOffsetPercent: Math.min(
                                    30,
                                    Math.max(
                                      5,
                                      Number(e.target.value) || 12
                                    )
                                  ),
                                },
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>
                            正文内容宽度 %
                          </label>
                          <select
                            value={String(
                              p.uiSettings?.contentWidthPercent ?? 70
                            )}
                            onChange={(e) =>
                              updateProject(p.id, {
                                uiSettings: {
                                  ...(p.uiSettings ?? {}),
                                  contentWidthPercent: Number(
                                    e.target.value
                                  ),
                                },
                              })
                            }
                            className={inputClass}
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
          )}
        </div>
      ))}

      <button
        onClick={save}
        disabled={saving}
        className="min-h-[44px] touch-manipulation rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {saving ? "保存中..." : saved ? "✓ 保存成功" : "保存修改"}
      </button>
    </div>
  );
}
