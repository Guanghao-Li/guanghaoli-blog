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
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [infoFontSize, setInfoFontSize] = useState(14);
  const [infoPositionX, setInfoPositionX] = useState(0);
  const [infoPositionY, setInfoPositionY] = useState(0);
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
        setPhone(h.phone ?? "");
        setEmail(h.email ?? "");
        setAddress(h.address ?? "");
        setInfoFontSize(h.infoFontSize ?? 14);
        setInfoPositionX(h.infoPositionX ?? 0);
        setInfoPositionY(h.infoPositionY ?? 0);
        setDirty(false);
      })
      .catch(console.error);
  }, []);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const data = await fetch("/api/admin/cms").then((r) => r.json());
      data.hero = {
        name,
        nameZh,
        subtitle,
        subtitleZh,
        avatar: avatar || undefined,
        phone,
        email,
        address,
        infoFontSize,
        infoPositionX,
        infoPositionY,
      };
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
        label="头像"
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
      <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4 mt-4">
        <h3 className="text-sm font-semibold mb-3">联系方式</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">电话</label>
            <input
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setDirty(true); }}
              placeholder="+1 201 555 0123"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setDirty(true); }}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">地址</label>
            <input
              value={address}
              onChange={(e) => { setAddress(e.target.value); setDirty(true); }}
              placeholder="Hoboken, New Jersey"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
        </div>
      </div>
      <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4 mt-4">
        <h3 className="text-sm font-semibold mb-3">信息区排版</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">文本大小 (px) {infoFontSize}</label>
            <input
              type="range"
              min={10}
              max={24}
              step={1}
              value={infoFontSize}
              onChange={(e) => { setInfoFontSize(Number(e.target.value)); setDirty(true); }}
              className="w-full h-2 rounded-lg accent-zinc-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">X 轴偏移 (px) {infoPositionX}</label>
            <input
              type="range"
              min={-50}
              max={50}
              step={1}
              value={infoPositionX}
              onChange={(e) => { setInfoPositionX(Number(e.target.value)); setDirty(true); }}
              className="w-full h-2 rounded-lg accent-zinc-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Y 轴偏移 (px) {infoPositionY}</label>
            <input
              type="range"
              min={-30}
              max={30}
              step={1}
              value={infoPositionY}
              onChange={(e) => { setInfoPositionY(Number(e.target.value)); setDirty(true); }}
              className="w-full h-2 rounded-lg accent-zinc-700"
            />
          </div>
        </div>
      </div>
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
