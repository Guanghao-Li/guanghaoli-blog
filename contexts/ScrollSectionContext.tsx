"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";

export type SectionId = "hero" | "resume" | "projects" | "lab";

interface ScrollSectionContextType {
  activeSection: SectionId;
  isResumeActive: boolean;
  sectionRefs: React.MutableRefObject<Record<SectionId, HTMLElement | null>>;
  registerSection: (id: SectionId, el: HTMLElement | null) => void;
}

const ScrollSectionContext = createContext<ScrollSectionContextType | null>(null);

export function ScrollSectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
    hero: null,
    resume: null,
    projects: null,
    lab: null,
  });

  const handleScrollRef = useRef<() => void>(() => {});
  handleScrollRef.current = () => {
    const viewportHeight = window.innerHeight;
    const sections: SectionId[] = ["hero", "resume", "projects", "lab"];
    let current: SectionId = "hero";
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = sectionRefs.current[sections[i]];
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= viewportHeight * 0.5) {
          current = sections[i];
          break;
        }
      }
    }
    setActiveSection(current);
  };

  const registerSection = useCallback((id: SectionId, el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
    if (el) handleScrollRef.current();
  }, []);

  useEffect(() => {
    const run = () => handleScrollRef.current();
    run();
    window.addEventListener("scroll", run, { passive: true });
    return () => window.removeEventListener("scroll", run);
  }, []);

  return (
    <ScrollSectionContext.Provider
      value={{
        activeSection,
        isResumeActive: activeSection === "resume",
        sectionRefs,
        registerSection,
      }}
    >
      {children}
    </ScrollSectionContext.Provider>
  );
}

export function useScrollSection() {
  const ctx = useContext(ScrollSectionContext);
  if (!ctx)
    throw new Error("useScrollSection must be used within ScrollSectionProvider");
  return ctx;
}
