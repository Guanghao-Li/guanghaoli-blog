"use client";

import { Cpu } from "lucide-react";

export default function HardwareStackWidget({
  config,
}: {
  config: Record<string, any>;
}) {
  const stack = (config.stack as string[]) ?? ["STM32", "ESP32", "Raspberry Pi"];

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[hsl(var(--text-muted))]">
        <Cpu className="h-4 w-4" />
        Hardware Stack
      </div>
      <div className="flex flex-1 flex-wrap content-start gap-2">
        {stack.map((item) => (
          <span
            key={item}
            className="rounded-xl bg-[hsl(var(--accent-muted))] px-4 py-2 text-sm font-medium"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
