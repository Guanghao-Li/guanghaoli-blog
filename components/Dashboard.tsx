"use client";

import { useRef } from "react";
import { useScrollSection } from "@/contexts/ScrollSectionContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCmsDashboard, useCmsIot } from "@/contexts/CmsContext";
import WidgetRenderer from "@/components/widgets/WidgetRenderer";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const labRef = useRef<HTMLElement | null>(null);
  const { registerSection } = useScrollSection();
  const { t } = useLanguage();
  const { widgets } = useCmsDashboard();
  const iot = useCmsIot();

  const registerLabRef = (el: HTMLElement | null) => {
    (labRef as React.MutableRefObject<HTMLElement | null>).current = el;
    registerSection("lab", el);
  };

  const title = iot?.title ?? "IoT Dashboard";
  const description = iot?.description ?? "Reserved visualization area for future MCU data";

  const sortedWidgets = [...widgets].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <section
      ref={registerLabRef}
      id="lab"
      className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-8 md:py-12"
    >
      <div className="w-full max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t(title, title)}
          </h2>
          <p className="mt-2 text-[hsl(var(--text-muted))]">
            {t(description, description)}
          </p>
        </div>
        {sortedWidgets.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:auto-rows-[minmax(180px,auto)]">
            {sortedWidgets.map((widget, index) => (
              <div
                key={widget.id}
                className={cn(
                  (widget.colSpan ?? 1) === 2 && "md:col-span-2",
                  (widget.rowSpan ?? 1) === 2 && "md:row-span-2"
                )}
              >
                <WidgetRenderer widget={widget} delay={index * 0.05} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--surface))]/30 p-12 text-center text-[hsl(var(--text-muted))]">
            <p>{t("No widgets yet. Add widgets in Admin → Dashboard Widget.", "暂无 Widget，请在后台 → Dashboard Widget 中添加。")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
