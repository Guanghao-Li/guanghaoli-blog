"use client";

import { useRef } from "react";
import { compressImageToBase64 } from "@/lib/image-utils";

export interface CompressedImageInputProps {
  value: string;
  onChange: (base64: string) => void;
  label?: string;
  placeholder?: string;
  /** 最大边长，默认 1200 */
  maxSize?: number;
  /** 压缩质量 0-1，默认 0.8 */
  quality?: number;
}

export default function CompressedImageInput({
  value,
  onChange,
  label = "封面图",
  placeholder = "选择图片或粘贴 URL/Base64",
  maxSize = 1200,
  quality = 0.8,
}: CompressedImageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const base64 = await compressImageToBase64(file, {
        maxWidth: maxSize,
        maxHeight: maxSize,
        quality,
      });
      onChange(base64);
    } catch (err) {
      console.error("Image compress failed:", err);
    }
    e.target.value = "";
  };

  const isDataUrl = value?.startsWith("data:");

  return (
    <div>
      <label className="block text-xs text-zinc-500">{label}</label>
      <div className="mt-1 flex gap-3">
        <div
          className="h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        >
          {value ? (
            isDataUrl ? (
              <img
                src={value}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs text-zinc-500">URL</span>
            )
          ) : (
            <span className="text-xs text-zinc-500">点击选择</span>
          )}
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
          />
          <p className="text-xs text-zinc-500">
            支持选择图片（自动压缩为 Base64）或粘贴 URL/Base64
          </p>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-left text-sm text-red-500 hover:underline"
            >
              清除
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
