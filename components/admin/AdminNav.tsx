"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, FileText, FolderOpen, Settings, Cpu, LayoutGrid, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "极客仪表盘", icon: User },
  { href: "/admin/resume", label: "简历管理", icon: FileText },
  { href: "/admin/projects", label: "项目展示", icon: FolderOpen },
  { href: "/admin/dashboard", label: "仪表盘组件", icon: LayoutGrid },
  { href: "/admin/iot", label: "IoT 配置", icon: Cpu },
];

export default function AdminNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* 移动端汉堡按钮 */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-300 bg-white shadow dark:border-zinc-600 dark:bg-zinc-800"
        aria-label="打开菜单"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* 移动端遮罩 */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setDrawerOpen(false)}
          aria-hidden
        />
      )}

      {/* 侧边栏 - 桌面端固定 / 移动端抽屉 */}
      <nav
        className={cn(
          "fixed md:static inset-y-0 left-0 z-40 w-56 border-r border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800",
          "transform transition-transform duration-200 ease-out md:transform-none",
          drawerOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 shrink-0" />
            <span className="font-semibold">后台管理</span>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="md:hidden p-2 -m-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700"
            aria-label="关闭菜单"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-zinc-200 dark:bg-zinc-700"
                      : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
