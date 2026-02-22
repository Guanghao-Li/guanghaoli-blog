"use client";

import { usePathname } from "next/navigation";
import Dock from "@/components/Dock";
import HamburgerMenu from "@/components/HamburgerMenu";
import ThemeToggle from "@/components/ThemeToggle";
import ProjectDetailBackButton from "@/components/ProjectDetailBackButton";

export default function SiteChrome() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isDetailPage =
    pathname?.startsWith("/project/") || pathname?.startsWith("/blog/");

  if (isAdmin) return null;

  if (isDetailPage) {
    return (
      <div className="hidden lg:contents">
        <HamburgerMenu />
        <header className="fixed right-4 top-4 z-[90]">
          <ThemeToggle />
        </header>
      </div>
    );
  }

  return (
    <>
      <HamburgerMenu />
      <ProjectDetailBackButton />
      <header className="fixed right-4 top-4 z-[90]">
        <ThemeToggle />
      </header>
      <Dock />
    </>
  );
}
