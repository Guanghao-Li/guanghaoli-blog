"use client";

import { Github } from "lucide-react";

export default function GithubStatsWidget({
  config,
}: {
  config: Record<string, any>;
}) {
  const username = (config.username as string) ?? "";
  const repo = (config.repo as string) ?? "";

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[hsl(var(--text-muted))]">
        <Github className="h-4 w-4" />
        GitHub
      </div>
      <div className="flex flex-1 flex-col justify-center">
        {username ? (
          <p className="text-sm font-medium">@{username}</p>
        ) : (
          <p className="text-xs text-[hsl(var(--text-muted))]/70">
            Configure username
          </p>
        )}
        {repo && (
          <p className="mt-1 text-xs text-[hsl(var(--text-muted))]">{repo}</p>
        )}
      </div>
    </div>
  );
}
