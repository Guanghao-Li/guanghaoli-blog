"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useScrollSection } from "@/contexts/ScrollSectionContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Dashboard() {
  const labRef = useRef<HTMLElement | null>(null);
  const { registerSection } = useScrollSection();
  const { t } = useLanguage();

  const registerLabRef = (el: HTMLElement | null) => {
    (labRef as React.MutableRefObject<HTMLElement | null>).current = el;
    registerSection("lab", el);
  };

  return (
    <section
      ref={registerLabRef}
      id="lab"
      className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-8 md:py-12"
    >
      <div className="w-full max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t("IoT Dashboard", "IoT Dashboard")}
          </h2>
          <p className="mt-2 text-[hsl(var(--text-muted))]">
            {t("Reserved visualization area for future MCU data", "为未来单片机数据预留的可视化区域")}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <DashboardCard
            title={t("Indoor Temperature", "室内温度")}
            status={t("Waiting for device connection...", "等待设备连接...")}
            delay={0}
          />
          <DashboardCard
            title={t("Device Status", "设备状态")}
            status={t("Waiting for device connection...", "等待设备连接...")}
            delay={0.1}
          />
          <DashboardCard
            title={t("Sensor Status", "传感器状态")}
            status={t("Waiting for device connection...", "等待设备连接...")}
            delay={0.15}
          />
        </div>
      </div>
    </section>
  );
}

function DashboardCard({
  title,
  status,
  delay,
}: {
  title: string;
  status: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="rounded-3xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--surface))]/50 p-8 shadow-lg transition-shadow dark:bg-[hsl(var(--surface-dark-elevated))]/50 hover:shadow-2xl"
      whileHover={{
        scale: 1.05,
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px hsl(var(--border))",
      }}
      whileTap={{ scale: 1.02 }}
    >
      <div className="flex flex-col items-center justify-center py-12">
        <div className="mb-4 h-24 w-full max-w-[200px] rounded-lg border-2 border-[hsl(var(--border))] bg-transparent" />
        <p className="text-sm font-medium text-[hsl(var(--text-muted))]">{title}</p>
        <p className="mt-2 text-xs text-[hsl(var(--text-muted))]/70">{status}</p>
      </div>
    </motion.div>
  );
}
