"use client";

import { useState, useEffect } from "react";
import CompressedImageInput from "./CompressedImageInput";
import PdfFileInput from "@/components/PdfFileInput";

export default function BlogManager() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [data, setData] = useState<any>(null);
  const [editing, setEditing] = useState<string | null>(null);
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
    const nextOrder = blogs.length > 0 ? Math.max(...blogs.map((b) => b.order ?? 0)) + 1 : 0;
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
            <span className="font-medium">{b.title || "未命名博客"}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(editing === b.id ? null : b.id)}
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
            <div className="mt-4 space-y-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <CompressedImageInput
                    value={b.coverImage ?? ""}
                    onChange={(v) => updateBlog(b.id, { coverImage: v })}
                    label="封面图"
                    placeholder="选择图片或粘贴 URL/Base64"
                    maxSize={1200}
                    quality={0.8}
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500">阅读时间 (分钟)</label>
                  <input
                    type="number"
                    min={0}
                    value={b.readTime ?? 0}
                    onChange={(e) => updateBlog(b.id, { readTime: Math.max(0, Number(e.target.value) || 0) })}
                    className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                  />
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-4">
                <div>
                  <label className="block text-xs text-zinc-500">colSpan</label>
                  <select
                    value={b.colSpan ?? 1}
                    onChange={(e) => updateBlog(b.id, { colSpan: Number(e.target.value) })}
                    className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-zinc-500">rowSpan</label>
                  <select
                    value={b.rowSpan ?? 1}
                    onChange={(e) => updateBlog(b.id, { rowSpan: Number(e.target.value) })}
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
                    value={b.order ?? 0}
                    onChange={(e) => updateBlog(b.id, { order: Number(e.target.value) || 0 })}
                    className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                  />
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <label className="block text-xs text-zinc-500">标题 (英文)</label>
                  <input
                    value={b.title}
                    onChange={(e) => updateBlog(b.id, { title: e.target.value })}
                    className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500">标题 (中文)</label>
                  <input
                    value={b.titleZh}
                    onChange={(e) => updateBlog(b.id, { titleZh: e.target.value })}
                    className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                  />
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <label className="block text-xs text-zinc-500">简短描述 (英文)</label>
                  <input
                    value={b.description ?? ""}
                    onChange={(e) => updateBlog(b.id, { description: e.target.value })}
                    className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500">简短描述 (中文)</label>
                  <input
                    value={b.descriptionZh ?? ""}
                    onChange={(e) => updateBlog(b.id, { descriptionZh: e.target.value })}
                    className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">正文内容 (Markdown) - 双语</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <span className="text-xs text-zinc-500">正文 (English)</span>
                    <textarea
                      value={b.contentEn ?? ""}
                      onChange={(e) => updateBlog(b.id, { contentEn: e.target.value })}
                      rows={10}
                      placeholder="## Overview\n\nWrite blog content in English..."
                      className="mt-0.5 w-full rounded border border-zinc-300 p-2 font-mono text-sm dark:border-zinc-600 dark:bg-zinc-900"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500">正文 (中文)</span>
                    <textarea
                      value={b.contentZh ?? ""}
                      onChange={(e) => updateBlog(b.id, { contentZh: e.target.value })}
                      rows={10}
                      placeholder="## 概述\n\n在此编写中文博客内容..."
                      className="mt-0.5 w-full rounded border border-zinc-300 p-2 font-mono text-sm dark:border-zinc-600 dark:bg-zinc-900"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">PDF 附件</label>
                <PdfFileInput
                  value={b.pdfName ?? ""}
                  onChange={(base64, name) => updateBlog(b.id, { pdfData: base64, pdfName: name })}
                />
              </div>
            </div>
          )}
        </div>
      ))}
      <button
        onClick={save}
        disabled={saving}
        className="rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 min-h-[44px] touch-manipulation"
      >
        {saving ? "保存中..." : saved ? "保存成功" : "保存修改"}
      </button>
    </div>
  );
}
