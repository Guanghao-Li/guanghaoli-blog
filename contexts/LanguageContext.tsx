"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

export type Lang = "en" | "zh";

const STORAGE_KEY = "portfolio-lang";

function detectSystemLang(): Lang {
  if (typeof window === "undefined") return "en";
  const nav = navigator;
  const lang =
    (nav.language || (nav as { userLanguage?: string }).userLanguage || "")
      .toLowerCase()
      .slice(0, 2);
  return lang === "zh" ? "zh" : "en";
}

interface LanguageContextType {
  lang: Lang;
  setLang: (next: Lang) => void;
  t: (en: string, zh: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      const resolved: Lang =
        stored === "en" || stored === "zh" ? stored : detectSystemLang();
      setLangState(resolved);
    } catch {
      setLangState(detectSystemLang());
    }
  }, [hydrated]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }, []);

  const t = useCallback(
    (en: string, zh: string) => (lang === "zh" ? zh : en),
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
