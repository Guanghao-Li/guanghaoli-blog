"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "md-editor-rt/lib/style.css";
import { compressImagesToBase64 } from "@/lib/image-utils";

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
    try {
      const urls = await compressImagesToBase64(files, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.8,
      });
      callback(urls);
    } catch (e) {
      console.error("Image upload failed:", e);
      callback([]);
    }
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
