"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

export type SectionId = "hero" | "resume" | "projects" | "lab";

const SECTION_ORDER: SectionId[] = ["hero", "resume", "projects", "lab"];

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
    let current: SectionId = "hero";
    for (let i = SECTION_ORDER.length - 1; i >= 0; i--) {
      const el = sectionRefs.current[SECTION_ORDER[i]];
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= viewportHeight * 0.5) {
          current = SECTION_ORDER[i];
          break;
        }
      }
    }
    setActiveSection((prev) => (prev !== current ? current : prev));
  };

  const registerSection = useCallback((id: SectionId, el: HTMLElement | null) => {
    if (sectionRefs.current[id] === el) return;
    sectionRefs.current[id] = el;
    if (el) handleScrollRef.current();
  }, []);

  useEffect(() => {
    const run = () => handleScrollRef.current();
    let container: Element | null = null;
    const attach = () => {
      container = document.querySelector(".scroll-snap-container");
      run();
      if (container) {
        (container as HTMLElement).addEventListener("scroll", run, { passive: true });
      } else {
        window.addEventListener("scroll", run, { passive: true });
      }
    };
    const tid = setTimeout(attach, 0);
    return () => {
      clearTimeout(tid);
      if (container) {
        (container as HTMLElement).removeEventListener("scroll", run);
      } else {
        window.removeEventListener("scroll", run);
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      activeSection,
      isResumeActive: activeSection === "resume",
      sectionRefs,
      registerSection,
    }),
    [activeSection, registerSection]
  );

  return (
    <ScrollSectionContext.Provider value={value}>
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
