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
  const [phoneEn, setPhoneEn] = useState("");
  const [phoneZh, setPhoneZh] = useState("");
  const [emailEn, setEmailEn] = useState("");
  const [emailZh, setEmailZh] = useState("");
  const [addressEn, setAddressEn] = useState("");
  const [addressZh, setAddressZh] = useState("");
  const [infoFontSize, setInfoFontSize] = useState(14);
  const [emojiSize, setEmojiSize] = useState(28);
  const [minAngle, setMinAngle] = useState(45);
  const [maxAngle, setMaxAngle] = useState(135);
  const [gravity, setGravity] = useState(1000);
  const [animationSpeed, setAnimationSpeed] = useState(2);
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
        setPhoneEn(h.phoneEn ?? h.phone ?? "");
        setPhoneZh(h.phoneZh ?? h.phone ?? "");
        setEmailEn(h.emailEn ?? h.email ?? "");
        setEmailZh(h.emailZh ?? h.email ?? "");
        setAddressEn(h.addressEn ?? h.address ?? "");
        setAddressZh(h.addressZh ?? h.address ?? "");
        setInfoFontSize(h.infoFontSize ?? 14);
        setEmojiSize(h.emojiSize ?? 28);
        setMinAngle(h.minAngle ?? 45);
        setMaxAngle(h.maxAngle ?? 135);
        setGravity(h.gravity ?? 1000);
        setAnimationSpeed(h.animationSpeed ?? 2);
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
        phoneEn,
        phoneZh,
        emailEn,
        emailZh,
        addressEn,
        addressZh,
        infoFontSize,
        infoPositionX,
        infoPositionY,
        emojiSize,
        minAngle,
        maxAngle,
        gravity,
        animationSpeed,
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
        <h3 className="text-sm font-semibold mb-3">联系方式 (双语)</h3>
        <div className="space-y-3 grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">电话 (英文)</label>
            <input
              value={phoneEn}
              onChange={(e) => { setPhoneEn(e.target.value); setDirty(true); }}
              placeholder="+1 201 555 0123"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">电话 (中文)</label>
            <input
              value={phoneZh}
              onChange={(e) => { setPhoneZh(e.target.value); setDirty(true); }}
              placeholder="+86 138 0000 0000"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">邮箱 (英文)</label>
            <input
              type="email"
              value={emailEn}
              onChange={(e) => { setEmailEn(e.target.value); setDirty(true); }}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">邮箱 (中文)</label>
            <input
              type="email"
              value={emailZh}
              onChange={(e) => { setEmailZh(e.target.value); setDirty(true); }}
              placeholder="同上或不同"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">地址 (英文)</label>
            <input
              value={addressEn}
              onChange={(e) => { setAddressEn(e.target.value); setDirty(true); }}
              placeholder="Hoboken, New Jersey"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">地址 (中文)</label>
            <input
              value={addressZh}
              onChange={(e) => { setAddressZh(e.target.value); setDirty(true); }}
              placeholder="新泽西州霍博肯"
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
      <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4 mt-4">
        <h3 className="text-sm font-semibold mb-3">头像 Emoji 弹射</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Emoji 字号 (px) {emojiSize}</label>
            <input
              type="range"
              min={16}
              max={48}
              step={2}
              value={emojiSize}
              onChange={(e) => { setEmojiSize(Number(e.target.value)); setDirty(true); }}
              className="w-full h-2 rounded-lg accent-zinc-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">发射角度 min (°) {minAngle}</label>
            <input
              type="range"
              min={0}
              max={90}
              step={5}
              value={minAngle}
              onChange={(e) => { setMinAngle(Number(e.target.value)); setDirty(true); }}
              className="w-full h-2 rounded-lg accent-zinc-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">发射角度 max (°) {maxAngle}</label>
            <input
              type="range"
              min={90}
              max={180}
              step={5}
              value={maxAngle}
              onChange={(e) => { setMaxAngle(Number(e.target.value)); setDirty(true); }}
              className="w-full h-2 rounded-lg accent-zinc-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">重力/下落深度 (px) {gravity}</label>
            <input
              type="range"
              min={800}
              max={1500}
              step={50}
              value={gravity}
              onChange={(e) => { setGravity(Number(e.target.value)); setDirty(true); }}
              className="w-full h-2 rounded-lg accent-zinc-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">动画时长 (s) {animationSpeed}</label>
            <input
              type="range"
              min={1.5}
              max={3}
              step={0.1}
              value={animationSpeed}
              onChange={(e) => { setAnimationSpeed(Number(e.target.value)); setDirty(true); }}
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
