"use client";

import { Activity, BarChart3, Terminal } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useCmsIot } from "@/contexts/CmsContext";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function IotMonitorWidget({
  config,
}: {
  config: Record<string, any>;
}) {
  const [mode, setMode] = useState<"chart" | "terminal">("chart");
  const iot = useCmsIot();
  const chartConfig = iot?.chartConfig ?? {};
  const apiKey = chartConfig.apiKey ?? config.apiKey ?? "";
  const metricKey = chartConfig.metricKey ?? config.metricKey ?? "default";
  const chartType = chartConfig.chartType ?? "line";
  const yAxisLabel = chartConfig.yAxisLabel ?? "Value";

  const url =
    apiKey &&
    `/api/iot/telemetry?apiKey=${encodeURIComponent(apiKey)}&metricKey=${encodeURIComponent(metricKey)}&limit=100`;

  const { data: telemetry = [], isLoading } = useSWR<{ timestamp: string; value: number }[]>(
    url,
    fetcher,
    { refreshInterval: 3000 }
  );

  const chartData =
    telemetry?.map((d) => ({
      time: new Date(d.timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      value: d.value,
    })) ?? [];

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--text-muted))]">
          <Activity className="h-4 w-4" />
          IoT Monitor
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setMode("chart")}
            className={`rounded p-1 ${mode === "chart" ? "bg-zinc-200 dark:bg-zinc-700" : ""}`}
            title="Chart"
          >
            <BarChart3 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setMode("terminal")}
            className={`rounded p-1 ${mode === "terminal" ? "bg-zinc-200 dark:bg-zinc-700" : ""}`}
            title="Terminal"
          >
            <Terminal className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        {!apiKey ? (
          <div className="flex h-full items-center justify-center text-xs text-[hsl(var(--text-muted))]/70">
            请在后台 IoT 配置 apiKey
          </div>
        ) : mode === "chart" ? (
          <div className="h-full min-h-[120px]">
            {isLoading && chartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-[hsl(var(--text-muted))]">
                加载中...
              </div>
            ) : chartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-[hsl(var(--text-muted))]">
                Waiting for data...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "bar" ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--text-muted))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--text-muted))" label={{ value: yAxisLabel, angle: -90 }} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Bar dataKey="value" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : chartType === "area" ? (
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--text-muted))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--text-muted))" label={{ value: yAxisLabel, angle: -90 }} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.3} />
                  </AreaChart>
                ) : (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--text-muted))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--text-muted))" label={{ value: yAxisLabel, angle: -90 }} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--accent))" dot={false} strokeWidth={2} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            )}
          </div>
        ) : (
          <div className="h-full overflow-y-auto rounded bg-zinc-900 p-2 font-mono text-xs text-green-400">
            {chartData.length === 0 ? (
              <span className="text-zinc-500">&gt; waiting for telemetry...</span>
            ) : (
              [...chartData].reverse().map((d, i) => (
                <div key={i}>
                  <span className="text-zinc-500">[{d.time}]</span> {d.value}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
