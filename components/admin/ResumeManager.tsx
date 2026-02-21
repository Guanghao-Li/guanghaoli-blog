"use client";

import { useState, useEffect } from "react";
import type { ResumeData } from "@/lib/resume-types";
import { DEFAULT_DATA } from "@/lib/data-store";
import ResumeMarkdownEditor from "./ResumeMarkdownEditor";

export default function ResumeManager() {
  const [data, setData] = useState<any>(null);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/cms")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        const r = d.resume ?? null;
        setResume(normalizeResume(r));
      })
      .catch(console.error);
  }, []);

  const updateResume = (updates: Partial<ResumeData>) => {
    const next = { ...(resume ?? getDefaultResume()), ...updates };
    setResume(next);
    setData((prev: any) => (prev ? { ...prev, resume: next } : prev));
  };

  const updateHero = (updates: Record<string, any>) => {
    setData((prev: any) =>
      prev ? { ...prev, hero: { ...(prev.hero ?? {}), ...updates } } : prev
    );
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

  if (!data) return <p className="mt-4">加载中...</p>;

  const r = resume ?? getDefaultResume();
  const paper = r.paperStyle ?? DEFAULT_DATA.resume.paperStyle ?? {};
  const h = data.hero ?? {};
  const rInfoFont = r.infoFontSize ?? 14;
  const rInfoX = r.infoPositionX ?? 0;
  const rInfoY = r.infoPositionY ?? 0;

  return (
    <div className="mt-6 max-w-4xl space-y-8">
      <section>
        <h2 className="text-lg font-medium">姓名</h2>
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

      <section>
        <h2 className="text-lg font-medium">联系方式（与首页共享）</h2>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <div><label className="block text-xs text-zinc-500">电话 (EN)</label><input value={h.phoneEn ?? ""} onChange={(e) => updateHero({ phoneEn: e.target.value })} placeholder="+1 201 555 0123" className="mt-0.5 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800" /></div>
          <div><label className="block text-xs text-zinc-500">电话 (ZH)</label><input value={h.phoneZh ?? ""} onChange={(e) => updateHero({ phoneZh: e.target.value })} placeholder="+86 138 0000 0000" className="mt-0.5 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800" /></div>
          <div><label className="block text-xs text-zinc-500">邮箱 (EN)</label><input type="email" value={h.emailEn ?? ""} onChange={(e) => updateHero({ emailEn: e.target.value })} placeholder="you@example.com" className="mt-0.5 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800" /></div>
          <div><label className="block text-xs text-zinc-500">邮箱 (ZH)</label><input type="email" value={h.emailZh ?? ""} onChange={(e) => updateHero({ emailZh: e.target.value })} className="mt-0.5 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800" /></div>
          <div><label className="block text-xs text-zinc-500">地址 (EN)</label><input value={h.addressEn ?? ""} onChange={(e) => updateHero({ addressEn: e.target.value })} placeholder="Hoboken, New Jersey" className="mt-0.5 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800" /></div>
          <div><label className="block text-xs text-zinc-500">地址 (ZH)</label><input value={h.addressZh ?? ""} onChange={(e) => updateHero({ addressZh: e.target.value })} placeholder="新泽西州霍博肯" className="mt-0.5 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800" /></div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium">简历页信息区排版</h2>
        <div className="mt-2 space-y-4">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">字号 (px) {rInfoFont}</label>
            <input type="range" min={10} max={24} step={1} value={rInfoFont} onChange={(e) => updateResume({ infoFontSize: Number(e.target.value) })} className="w-full h-2 rounded-lg accent-zinc-700" />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">X 轴偏移 {rInfoX}</label>
            <input type="range" min={-50} max={50} step={1} value={rInfoX} onChange={(e) => updateResume({ infoPositionX: Number(e.target.value) })} className="w-full h-2 rounded-lg accent-zinc-700" />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Y 轴偏移 {rInfoY}</label>
            <input type="range" min={-30} max={30} step={1} value={rInfoY} onChange={(e) => updateResume({ infoPositionY: Number(e.target.value) })} className="w-full h-2 rounded-lg accent-zinc-700" />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium">纸张样式</h2>
        <div className="mt-2 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs text-zinc-500">maxWidth</label>
            <select
              value={paper.maxWidth ?? "max-w-4xl"}
              onChange={(e) =>
                updateResume({
                  paperStyle: { ...paper, maxWidth: e.target.value },
                })
              }
              className="mt-0.5 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
            >
              <option value="max-w-2xl">max-w-2xl</option>
              <option value="max-w-3xl">max-w-3xl</option>
              <option value="max-w-4xl">max-w-4xl</option>
              <option value="max-w-5xl">max-w-5xl</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-zinc-500">minHeight</label>
            <select
              value={paper.minHeight ?? "min-h-[800px]"}
              onChange={(e) =>
                updateResume({
                  paperStyle: { ...paper, minHeight: e.target.value },
                })
              }
              className="mt-0.5 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
            >
              <option value="min-h-[600px]">600px</option>
              <option value="min-h-[800px]">800px</option>
              <option value="min-h-[1000px]">1000px</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-zinc-500">theme</label>
            <select
              value={paper.theme ?? "default"}
              onChange={(e) =>
                updateResume({
                  paperStyle: {
                    ...paper,
                    theme: e.target.value as "default" | "blueprint",
                  },
                })
              }
              className="mt-0.5 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
            >
              <option value="default">default</option>
              <option value="blueprint">blueprint</option>
            </select>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium">简历内容 (Markdown)</h2>
        <p className="mt-1 text-sm text-zinc-500">
          支持分屏预览，粘贴图片将转为 Base64 嵌入
        </p>
        <div className="mt-3">
          <ResumeMarkdownEditor
            valueEn={r.contentEn ?? ""}
            valueZh={r.contentZh ?? ""}
            onChangeEn={(v) => updateResume({ contentEn: v })}
            onChangeZh={(v) => updateResume({ contentZh: v })}
          />
        </div>
      </section>

      <button
        onClick={save}
        disabled={saving}
        className="rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 min-h-[44px] touch-manipulation"
      >
        {saving ? "保存中..." : "保存修改"}
      </button>
    </div>
  );
}

function normalizeResume(r: any): ResumeData | null {
  if (!r) return null;
  return {
    nameEn: r.nameEn ?? "",
    nameZh: r.nameZh ?? "",
    contentEn: r.contentEn ?? "",
    contentZh: r.contentZh ?? "",
    paperStyle: r.paperStyle ?? DEFAULT_DATA.resume.paperStyle,
    infoFontSize: r.infoFontSize ?? 14,
    infoPositionX: r.infoPositionX ?? 0,
    infoPositionY: r.infoPositionY ?? 0,
  };
}

function getDefaultResume(): ResumeData {
  return {
    nameEn: DEFAULT_DATA.resume.nameEn,
    nameZh: DEFAULT_DATA.resume.nameZh,
    contentEn: DEFAULT_DATA.resume.contentEn,
    contentZh: DEFAULT_DATA.resume.contentZh,
    paperStyle: DEFAULT_DATA.resume.paperStyle,
    infoFontSize: 14,
    infoPositionX: 0,
    infoPositionY: 0,
  };
}
