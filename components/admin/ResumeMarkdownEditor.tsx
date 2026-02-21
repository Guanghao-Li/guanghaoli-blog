"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "md-editor-rt/lib/style.css";

const MdEditor = dynamic(() => import("md-editor-rt").then((mod) => mod.MdEditor), {
  ssr: false,
  loading: () => (
    <div className="h-64 rounded-lg border border-zinc-300 bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 animate-pulse" />
  ),
});

type Tab = "en" | "zh";

export default function ResumeMarkdownEditor({
  valueEn,
  valueZh,
  onChangeEn,
  onChangeZh,
  theme = "light",
}: {
  valueEn: string;
  valueZh: string;
  onChangeEn: (v: string) => void;
  onChangeZh: (v: string) => void;
  theme?: "light" | "dark";
}) {
  const [tab, setTab] = useState<Tab>("en");

  const onUploadImg = async (
    files: File[],
    callback: (urls: string[]) => void
  ) => {
    const urls: string[] = [];
    for (const file of files) {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.onerror = reject;
        r.readAsDataURL(file);
      });
      urls.push(dataUrl);
    }
    callback(urls);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("en")}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            tab === "en"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          }`}
        >
          英文 (EN)
        </button>
        <button
          type="button"
          onClick={() => setTab("zh")}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            tab === "zh"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          }`}
        >
          中文 (ZH)
        </button>
      </div>
      <div className="min-h-[360px] overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-600">
        {tab === "en" ? (
          <MdEditor
            id="resume-md-en"
            value={valueEn}
            onChange={onChangeEn}
            theme={theme}
            language="en-US"
            preview={true}
            onUploadImg={onUploadImg}
            className="min-h-[360px]"
          />
        ) : (
          <MdEditor
            id="resume-md-zh"
            value={valueZh}
            onChange={onChangeZh}
            theme={theme}
            language="zh-CN"
            preview={true}
            onUploadImg={onUploadImg}
            className="min-h-[360px]"
          />
        )}
      </div>
    </div>
  );
}
