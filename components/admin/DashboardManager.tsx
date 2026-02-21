"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import type { DashboardWidget } from "@/contexts/CmsContext";
import { v4 as uuidv4 } from "uuid";

const WIDGET_TYPES = [
  { value: "hardware-stack", label: "Hardware Stack" },
  { value: "iot-monitor", label: "IoT Monitor" },
  { value: "pcb-showcase", label: "PCB Showcase" },
  { value: "github-stats", label: "GitHub Stats" },
] as const;

export default function DashboardManager() {
  const [data, setData] = useState<any>(null);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/admin/cms")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setWidgets(d.dashboard?.widgets ?? []);
      })
      .catch(console.error);
  }, []);

  const save = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, dashboard: { widgets } }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const addWidget = (type: DashboardWidget["type"]) => {
    const nextOrder = widgets.length > 0 ? Math.max(...widgets.map((w) => w.order ?? 0)) + 1 : 0;
    const defaults: Record<string, any> = {
      "hardware-stack": { stack: ["STM32", "ESP32", "Raspberry Pi"] },
      "iot-monitor": { metricKey: "temperature" },
      "pcb-showcase": { title: "PCB Design" },
      "github-stats": { username: "", repo: "" },
    };
    const newWidget = {
      id: uuidv4(),
      type,
      order: nextOrder,
      colSpan: 1,
      rowSpan: 1,
      config: defaults[type] ?? {},
    };
    setWidgets((prev) => [...prev, newWidget]);
  };

  const updateWidget = (id: string, updates: Partial<DashboardWidget>) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates } : w))
    );
  };

  const removeWidget = (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  };

  if (!data) return <p className="mt-4">加载中...</p>;

  return (
    <div className="mt-6 max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">添加组件</h2>
        <div className="flex gap-2">
          {WIDGET_TYPES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => addWidget(value)}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
            >
              <Plus className="mr-1 inline h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {widgets
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((w) => (
            <div
              key={w.id}
              className="rounded-xl border border-zinc-200 dark:border-zinc-700"
            >
              <div className="flex items-center gap-2 p-3">
                <button
                  type="button"
                  onClick={() => setExpanded((o) => ({ ...o, [w.id]: !o[w.id] }))}
                  className="text-zinc-500"
                >
                  {expanded[w.id] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                <span className="font-medium">{w.type}</span>
                <span className="text-xs text-zinc-500">order: {w.order ?? 0}</span>
                <button
                  type="button"
                  onClick={() => removeWidget(w.id)}
                  className="ml-auto rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {expanded[w.id] && (
                <div className="border-t border-zinc-200 p-3 dark:border-zinc-700">
                  <div className="grid gap-2 sm:grid-cols-4">
                    <div>
                      <label className="block text-xs text-zinc-500">order</label>
                      <input
                        type="number"
                        value={w.order ?? 0}
                        onChange={(e) =>
                          updateWidget(w.id, { order: Number(e.target.value) || 0 })
                        }
                        className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500">colSpan</label>
                      <select
                        value={w.colSpan ?? 1}
                        onChange={(e) =>
                          updateWidget(w.id, { colSpan: Number(e.target.value) })
                        }
                        className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500">rowSpan</label>
                      <select
                        value={w.rowSpan ?? 1}
                        onChange={(e) =>
                          updateWidget(w.id, { rowSpan: Number(e.target.value) })
                        }
                        className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                      </select>
                    </div>
                  </div>
                  {w.type === "hardware-stack" && (
                    <div className="mt-2">
                      <label className="block text-xs text-zinc-500">Stack (逗号分隔)</label>
                      <input
                        value={(w.config?.stack as string[])?.join(", ") ?? ""}
                        onChange={(e) =>
                          updateWidget(w.id, {
                            config: {
                              ...w.config,
                              stack: e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            },
                          })
                        }
                        className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                      />
                    </div>
                  )}
                  {w.type === "github-stats" && (
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs text-zinc-500">username</label>
                        <input
                          value={w.config?.username ?? ""}
                          onChange={(e) =>
                            updateWidget(w.id, {
                              config: { ...w.config, username: e.target.value },
                            })
                          }
                          className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-500">repo</label>
                        <input
                          value={w.config?.repo ?? ""}
                          onChange={(e) =>
                            updateWidget(w.id, {
                              config: { ...w.config, repo: e.target.value },
                            })
                          }
                          className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                        />
                      </div>
                    </div>
                  )}
                  {w.type === "pcb-showcase" && (
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs text-zinc-500">title</label>
                        <input
                          value={w.config?.title ?? ""}
                          onChange={(e) =>
                            updateWidget(w.id, {
                              config: { ...w.config, title: e.target.value },
                            })
                          }
                          className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-500">imageUrl</label>
                        <input
                          value={w.config?.imageUrl ?? ""}
                          onChange={(e) =>
                            updateWidget(w.id, {
                              config: { ...w.config, imageUrl: e.target.value },
                            })
                          }
                          className="mt-0.5 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
      </div>
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
