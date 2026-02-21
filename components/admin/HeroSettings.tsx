"use client";

import { useState, useEffect } from "react";
import ImageCropper from "./ImageCropper";
import { useUnsavedPrompt } from "@/hooks/useUnsavedPrompt";

export default function HeroSettings() {
  const [name, setName] = useState("");
  const [nameZh, setNameZh] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [subtitleZh, setSubtitleZh] = useState("");
  const [avatar, setAvatar] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  useUnsavedPrompt(dirty);

  useEffect(() => {
    fetch("/api/admin/cms")
      .then((r) => r.json())
      .then((d) => {
        const h = d.hero ?? {};
        setName(h.name ?? "");
        setNameZh(h.nameZh ?? "");
        setSubtitle(h.subtitle ?? "");
        setSubtitleZh(h.subtitleZh ?? "");
        setAvatar(h.avatar ?? "");
        setDirty(false);
      })
      .catch(console.error);
  }, []);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const data = await fetch("/api/admin/cms").then((r) => r.json());
      data.hero = { name, nameZh, subtitle, subtitleZh, avatar: avatar || undefined };
      await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSaved(true);
      setDirty(false);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-6 max-w-xl space-y-4">
      <ImageCropper
        value={avatar}
        onChange={(v) => { setAvatar(v); setDirty(true); }}
        aspect={1}
        label="头像 (Avatar)"
      />
      <div>
        <label className="block text-sm font-medium">姓名 (英文)</label>
        <input
          value={name}
          onChange={(e) => { setName(e.target.value); setDirty(true); }}
          placeholder="请输入英文姓名"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">姓名 (中文)</label>
        <input
          value={nameZh}
          onChange={(e) => { setNameZh(e.target.value); setDirty(true); }}
          placeholder="请输入中文姓名"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">副标题 (英文)</label>
        <input
          value={subtitle}
          onChange={(e) => { setSubtitle(e.target.value); setDirty(true); }}
          placeholder="请输入英文副标题"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">副标题 (中文)</label>
        <input
          value={subtitleZh}
          onChange={(e) => { setSubtitleZh(e.target.value); setDirty(true); }}
          placeholder="请输入中文副标题"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
        />
      </div>
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
