"use client";

import { useState, useEffect } from "react";

const PUSH_URL = "/api/iot/push";

export default function IotSettings() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [codeTab, setCodeTab] = useState<"c" | "python">("c");

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

  const clearData = async () => {
    if (!confirm("确定清空所有遥测数据？")) return;
    setClearing(true);
    try {
      await fetch("/api/admin/iot/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setClearing(false);
    }
  };

  if (!data) return <p className="mt-4">加载中...</p>;

  const iot = data.iot ?? {};
  const cc = iot.chartConfig ?? {};
  const apiKey = cc.apiKey ?? "your-api-key";
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const sampleC = `// C (ESP32/STM32 + libcurl or HTTPClient)
// POST ${baseUrl}${PUSH_URL}
// Body: {"apiKey":"${apiKey}","value":25.5,"metricKey":"temperature"}

#include <HTTPClient.h>
HTTPClient http;
http.begin("${baseUrl}${PUSH_URL}");
http.addHeader("Content-Type", "application/json");
float temp = readSensor();
String body = "{\\\"apiKey\\\":\\\"${apiKey}\\\",\\\"value\\\":" 
  + String(temp) + ",\\\"metricKey\\\":\\\"temperature\\\"}";
int code = http.POST(body);
http.end();`;

  const samplePython = `# Python
# POST ${baseUrl}${PUSH_URL}

import requests
url = "${baseUrl}${PUSH_URL}"
payload = {
    "apiKey": "${apiKey}",
    "value": 25.5,
    "metricKey": "temperature",
}
requests.post(url, json=payload)`;

  return (
    <div className="mt-6 max-w-2xl space-y-6">
      <section className="space-y-4">
        <h2 className="text-lg font-medium">基础信息</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">标题 (英文)</label>
            <input
              value={iot.title ?? ""}
              onChange={(e) =>
                setData({ ...data, iot: { ...data.iot, title: e.target.value } })
              }
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">标题 (中文)</label>
            <input
              value={iot.titleZh ?? ""}
              onChange={(e) =>
                setData({ ...data, iot: { ...data.iot, titleZh: e.target.value } })
              }
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">描述 (英文)</label>
            <input
              value={iot.description ?? ""}
              onChange={(e) =>
                setData({ ...data, iot: { ...data.iot, description: e.target.value } })
              }
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">描述 (中文)</label>
            <input
              value={iot.descriptionZh ?? ""}
              onChange={(e) =>
                setData({ ...data, iot: { ...data.iot, descriptionZh: e.target.value } })
              }
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">图表配置 (Chart Config)</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium">chartType</label>
            <select
              value={cc.chartType ?? "line"}
              onChange={(e) =>
                setData({
                  ...data,
                  iot: {
                    ...data.iot,
                    chartConfig: {
                      ...data.iot?.chartConfig,
                      chartType: e.target.value as "line" | "bar" | "area",
                    },
                  },
                })
              }
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
            >
              <option value="line">line</option>
              <option value="bar">bar</option>
              <option value="area">area</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">apiKey（设备推送用）</label>
            <input
              value={cc.apiKey ?? ""}
              onChange={(e) =>
                setData({
                  ...data,
                  iot: {
                    ...data.iot,
                    chartConfig: { ...data.iot?.chartConfig, apiKey: e.target.value },
                  },
                })
              }
              placeholder="my-device-key"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">yAxisLabel</label>
            <input
              value={cc.yAxisLabel ?? ""}
              onChange={(e) =>
                setData({
                  ...data,
                  iot: {
                    ...data.iot,
                    chartConfig: { ...data.iot?.chartConfig, yAxisLabel: e.target.value },
                  },
                })
              }
              placeholder="Value"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">metricKey</label>
            <input
              value={cc.metricKey ?? ""}
              onChange={(e) =>
                setData({
                  ...data,
                  iot: {
                    ...data.iot,
                    chartConfig: { ...data.iot?.chartConfig, metricKey: e.target.value },
                  },
                })
              }
              placeholder="default"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">推送示例代码</h2>
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={() => setCodeTab("c")}
            className={`rounded px-3 py-1 text-sm ${codeTab === "c" ? "bg-zinc-800 text-white" : "bg-zinc-200 dark:bg-zinc-700"}`}
          >
            C (ESP32)
          </button>
          <button
            type="button"
            onClick={() => setCodeTab("python")}
            className={`rounded px-3 py-1 text-sm ${codeTab === "python" ? "bg-zinc-800 text-white" : "bg-zinc-200 dark:bg-zinc-700"}`}
          >
            Python
          </button>
        </div>
        <pre className="overflow-x-auto rounded-lg border border-zinc-300 bg-zinc-100 p-4 text-xs dark:border-zinc-600 dark:bg-zinc-900">
          <code>{codeTab === "c" ? sampleC : samplePython}</code>
        </pre>
      </section>

      <div className="flex gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 min-h-[44px] touch-manipulation"
        >
          {saving ? "保存中..." : saved ? "保存成功" : "保存修改"}
        </button>
        <button
          onClick={clearData}
          disabled={clearing}
          className="rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
        >
          {clearing ? "清空中..." : "清空遥测数据"}
        </button>
      </div>
    </div>
  );
}
