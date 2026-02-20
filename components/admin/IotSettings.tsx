"use client";

import { useState, useEffect } from "react";

export default function IotSettings() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/cms")
      .then((r) => r.json())
      .then(setData)
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
        body: JSON.stringify(data),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (!data) return <p className="mt-4">加载中...</p>;

  const iot = data.iot ?? {};

  return (
    <div className="mt-6 max-w-xl space-y-4">
      <div>
        <label className="block text-sm font-medium">标题 (英文)</label>
        <input
          value={iot.title ?? ""}
          onChange={(e) =>
            setData({
              ...data,
              iot: { ...data.iot, title: e.target.value },
            })
          }
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">标题 (中文)</label>
        <input
          value={iot.titleZh ?? ""}
          onChange={(e) =>
            setData({
              ...data,
              iot: { ...data.iot, titleZh: e.target.value },
            })
          }
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">描述 (英文)</label>
        <input
          value={iot.description ?? ""}
          onChange={(e) =>
            setData({
              ...data,
              iot: { ...data.iot, description: e.target.value },
            })
          }
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">描述 (中文)</label>
        <input
          value={iot.descriptionZh ?? ""}
          onChange={(e) =>
            setData({
              ...data,
              iot: { ...data.iot, descriptionZh: e.target.value },
            })
          }
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
