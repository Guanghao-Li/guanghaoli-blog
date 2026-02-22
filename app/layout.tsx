import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ScrollSectionProvider } from "@/contexts/ScrollSectionContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProjectDetailProvider } from "@/contexts/ProjectDetailContext";
import { CmsProvider } from "@/contexts/CmsContext";
import SiteChrome from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Lee的个人站",
  description: "嵌入式系统工程师 · Embedded Systems Engineer",
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
          <LanguageProvider>
            <CmsProvider>
              <ScrollSectionProvider>
                <ProjectDetailProvider>
                <div className="relative min-h-full w-full overflow-x-hidden">
                  <SiteChrome />
                  {children}
                </div>
                </ProjectDetailProvider>
              </ScrollSectionProvider>
            </CmsProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
