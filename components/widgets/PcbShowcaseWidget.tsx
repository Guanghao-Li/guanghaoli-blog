"use client";

import Image from "next/image";

export default function PcbShowcaseWidget({
  config,
}: {
  config: Record<string, any>;
}) {
  const title = (config.title as string) ?? "PCB Design";
  const imageUrl = config.imageUrl as string | undefined;

  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-2 text-sm font-medium text-[hsl(var(--text-muted))]">
        {title}
      </h3>
      <div className="relative flex-1 min-h-[100px] rounded-xl border-2 border-dashed border-[hsl(var(--border))] bg-transparent overflow-hidden">
        {imageUrl ? (
          imageUrl.startsWith("data:") ? (
            <img
              src={imageUrl}
              alt=""
              className="h-full w-full object-contain"
            />
          ) : (
            <Image
              src={imageUrl}
              alt=""
              fill
              className="object-contain"
              sizes="200px"
            />
          )
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-[hsl(var(--text-muted))]/50">
            No image
          </div>
        )}
      </div>
    </div>
  );
}
