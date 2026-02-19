import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ScrollSectionProvider } from "@/contexts/ScrollSectionContext";
import Dock from "@/components/Dock";
import ThemeToggle from "@/components/ThemeToggle";
import HamburgerMenu from "@/components/HamburgerMenu";

export const metadata: Metadata = {
  title: "Lee | 作品集",
  description: "全栈工程师 · 创造简洁而富有质感的产品",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const resolved = stored === 'dark' || stored === 'light' ? stored : (prefersDark ? 'dark' : 'light');
                  document.documentElement.classList.toggle('dark', resolved === 'dark');
                } catch (e) {}
              })();
            `,
          }}
        />
        <ThemeProvider>
          <ScrollSectionProvider>
            <div className="relative min-h-full w-full">
              <HamburgerMenu />
              <header className="fixed right-4 top-4 z-40">
                <ThemeToggle />
              </header>
              {children}
              <Dock />
            </div>
          </ScrollSectionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
