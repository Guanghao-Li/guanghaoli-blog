"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import CompressedImageInput from "./CompressedImageInput";
import PdfFileInput from "@/components/PdfFileInput";

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

export default function BlogManager() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [data, setData] = useState<any>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("zh");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/cms")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setBlogs(d.blogs ?? []);
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
        body: JSON.stringify({ ...data, blogs }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const addBlog = () => {
    const id = String(Date.now());
    const nextOrder =
      blogs.length > 0
        ? Math.max(...blogs.map((b) => b.order ?? 0)) + 1
        : 0;
    setBlogs([
      ...blogs,
      {
        id,
        title: "New Blog",
        titleZh: "新博客",
        description: "",
        descriptionZh: "",
        contentEn: "## Overview\n\nWrite blog content in English.",
        contentZh: "## 概述\n\n在此编写中文博客内容。",
        coverImage: "",
        colSpan: 1,
        rowSpan: 1,
        order: nextOrder,
        readTime: 0,
        pdfData: "",
        pdfName: "",
      },
    ]);
    setEditing(id);
    setActiveTab("zh");
  };

  const toggleEdit = (id: string) => {
    setEditing(editing === id ? null : id);
    setActiveTab("zh");
  };

  const updateBlog = (id: string, updates: Record<string, any>) => {
    setBlogs(blogs.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const removeBlog = (id: string) => {
    setBlogs(blogs.filter((b) => b.id !== id));
    setEditing(null);
  };

  if (!data) return <p className="mt-4">加载中...</p>;

  return (
    <div className="mt-6 space-y-4">
      <button
        onClick={addBlog}
        className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
      >
        + 添加博客
      </button>

      {blogs.map((b) => (
        <div
          key={b.id}
          className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">
              {b.titleZh || b.title || "未命名博客"}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => toggleEdit(b.id)}
                className="text-sm text-blue-600 hover:underline"
              >
                {editing === b.id ? "收起" : "编辑"}
              </button>
              <button
                onClick={() => removeBlog(b.id)}
                className="text-sm text-red-500 hover:underline"
              >
                删除
              </button>
            </div>
          </div>

          {editing === b.id && (
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
                      value={b.titleZh}
                      onChange={(e) =>
                        updateBlog(b.id, { titleZh: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>简短描述 (中文)</label>
                    <input
                      value={b.descriptionZh ?? ""}
                      onChange={(e) =>
                        updateBlog(b.id, { descriptionZh: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>正文 Markdown (中文)</label>
                    <textarea
                      value={b.contentZh ?? ""}
                      onChange={(e) =>
                        updateBlog(b.id, { contentZh: e.target.value })
                      }
                      rows={16}
                      placeholder="## 概述&#10;&#10;在此编写中文博客内容..."
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
                      value={b.title}
                      onChange={(e) =>
                        updateBlog(b.id, { title: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Description (English)</label>
                    <input
                      value={b.description ?? ""}
                      onChange={(e) =>
                        updateBlog(b.id, { description: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Content Markdown (English)
                    </label>
                    <textarea
                      value={b.contentEn ?? ""}
                      onChange={(e) =>
                        updateBlog(b.id, { contentEn: e.target.value })
                      }
                      rows={16}
                      placeholder="## Overview&#10;&#10;Write blog content in English..."
                      className={cn(inputClass, "font-mono")}
                    />
                  </div>
                </div>
              )}

              {/* ─── Tab: 附件与设置 ─── */}
              {activeTab === "settings" && (
                <div className="space-y-4">
                  <CompressedImageInput
                    value={b.coverImage ?? ""}
                    onChange={(v) => updateBlog(b.id, { coverImage: v })}
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
                        value={b.readTime ?? 0}
                        onChange={(e) =>
                          updateBlog(b.id, {
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
                      <label className={labelClass}>order</label>
                      <input
                        type="number"
                        value={b.order ?? 0}
                        onChange={(e) =>
                          updateBlog(b.id, {
                            order: Number(e.target.value) || 0,
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>colSpan</label>
                      <select
                        value={b.colSpan ?? 1}
                        onChange={(e) =>
                          updateBlog(b.id, {
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
                        value={b.rowSpan ?? 1}
                        onChange={(e) =>
                          updateBlog(b.id, {
                            rowSpan: Number(e.target.value),
                          })
                        }
                        className={inputClass}
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>PDF 附件</label>
                    <div className="mt-1">
                      <PdfFileInput
                        value={b.pdfName ?? ""}
                        onChange={(base64, name) =>
                          updateBlog(b.id, {
                            pdfData: base64,
                            pdfName: name,
                          })
                        }
                      />
                    </div>
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
