"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, FileText, FolderOpen, Settings, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "基础设置 (Hero)", icon: User },
  { href: "/admin/resume", label: "简历管理 (Resume)", icon: FileText },
  { href: "/admin/projects", label: "项目管理 (Projects)", icon: FolderOpen },
  { href: "/admin/iot", label: "仪表盘配置 (IoT)", icon: Cpu },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="w-56 border-r border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800 p-4">
      <div className="mb-8 flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <span className="font-semibold">后台管理</span>
      </div>
      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-zinc-200 dark:bg-zinc-700"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
