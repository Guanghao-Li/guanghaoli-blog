"use client";

import { motion } from "framer-motion";
import type { DashboardWidget } from "@/contexts/CmsContext";
import HardwareStackWidget from "./HardwareStackWidget";
import IotMonitorWidget from "./IotMonitorWidget";
import PcbShowcaseWidget from "./PcbShowcaseWidget";
import GithubStatsWidget from "./GithubStatsWidget";

export default function WidgetRenderer({
  widget,
  delay = 0,
}: {
  widget: DashboardWidget;
  delay?: number;
}) {
  const baseClass =
    "rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/50 p-6 shadow-lg dark:bg-[hsl(var(--surface-dark-elevated))]/50 overflow-hidden flex flex-col min-h-[160px]";

  const content = (() => {
    switch (widget.type) {
      case "hardware-stack":
        return <HardwareStackWidget config={widget.config ?? {}} />;
      case "iot-monitor":
        return <IotMonitorWidget config={widget.config ?? {}} />;
      case "pcb-showcase":
        return <PcbShowcaseWidget config={widget.config ?? {}} />;
      case "github-stats":
        return <GithubStatsWidget config={widget.config ?? {}} />;
      default:
        return (
          <div className="flex flex-1 items-center justify-center text-[hsl(var(--text-muted))] text-sm">
            Unknown widget: {widget.type}
          </div>
        );
    }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={baseClass}
    >
      {content}
    </motion.div>
  );
}
