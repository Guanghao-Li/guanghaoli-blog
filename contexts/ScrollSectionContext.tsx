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

const SECTION_ORDER: SectionId[] = ["hero", "resume", "projects", "lab"];

const THRESHOLD = 80;
const LOCK_MS = 800;
const BOUNDARY_TOLERANCE = 15;

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

  const deltaAccumulator = useRef(0);
  const lockUntil = useRef(0);
  const lastTouchY = useRef(0);

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

  const getCurrentSectionIndex = useCallback((): number => {
    const viewportHeight = window.innerHeight;
    for (let i = SECTION_ORDER.length - 1; i >= 0; i--) {
      const el = sectionRefs.current[SECTION_ORDER[i]];
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= viewportHeight * 0.5) return i;
      }
    }
    return 0;
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Date.now() < lockUntil.current) {
        e.preventDefault();
        return;
      }

      const idx = getCurrentSectionIndex();
      const el = sectionRefs.current[SECTION_ORDER[idx]];
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const atTop = rect.top >= -BOUNDARY_TOLERANCE && rect.top <= BOUNDARY_TOLERANCE;
      const atBottom = vh - rect.bottom >= -BOUNDARY_TOLERANCE && vh - rect.bottom <= BOUNDARY_TOLERANCE;

      if (atTop && e.deltaY < 0) {
        e.preventDefault();
        deltaAccumulator.current += e.deltaY;
        if (deltaAccumulator.current <= -THRESHOLD && idx > 0) {
          const prev = sectionRefs.current[SECTION_ORDER[idx - 1]];
          if (prev) {
            prev.scrollIntoView({ behavior: "smooth", block: "start" });
            lockUntil.current = Date.now() + LOCK_MS;
            deltaAccumulator.current = 0;
          }
        }
        return;
      }

      if (atBottom && e.deltaY > 0) {
        e.preventDefault();
        deltaAccumulator.current += e.deltaY;
        if (deltaAccumulator.current >= THRESHOLD && idx < SECTION_ORDER.length - 1) {
          const next = sectionRefs.current[SECTION_ORDER[idx + 1]];
          if (next) {
            next.scrollIntoView({ behavior: "smooth", block: "start" });
            lockUntil.current = Date.now() + LOCK_MS;
            deltaAccumulator.current = 0;
          }
        }
        return;
      }

      deltaAccumulator.current = 0;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length) lastTouchY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (Date.now() < lockUntil.current) {
        e.preventDefault();
        return;
      }
      if (!e.touches.length) return;

      const currentY = e.touches[0].clientY;
      const deltaY = lastTouchY.current - currentY;
      lastTouchY.current = currentY;

      const idx = getCurrentSectionIndex();
      const el = sectionRefs.current[SECTION_ORDER[idx]];
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const atTop = rect.top >= -BOUNDARY_TOLERANCE && rect.top <= BOUNDARY_TOLERANCE;
      const atBottom = vh - rect.bottom >= -BOUNDARY_TOLERANCE && vh - rect.bottom <= BOUNDARY_TOLERANCE;

      if (atTop && deltaY < 0) {
        e.preventDefault();
        deltaAccumulator.current += deltaY;
        if (deltaAccumulator.current <= -THRESHOLD && idx > 0) {
          const prev = sectionRefs.current[SECTION_ORDER[idx - 1]];
          if (prev) {
            prev.scrollIntoView({ behavior: "smooth", block: "start" });
            lockUntil.current = Date.now() + LOCK_MS;
            deltaAccumulator.current = 0;
          }
        }
        return;
      }

      if (atBottom && deltaY > 0) {
        e.preventDefault();
        deltaAccumulator.current += deltaY;
        if (deltaAccumulator.current >= THRESHOLD && idx < SECTION_ORDER.length - 1) {
          const next = sectionRefs.current[SECTION_ORDER[idx + 1]];
          if (next) {
            next.scrollIntoView({ behavior: "smooth", block: "start" });
            lockUntil.current = Date.now() + LOCK_MS;
            deltaAccumulator.current = 0;
          }
        }
        return;
      }

      deltaAccumulator.current = 0;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [getCurrentSectionIndex]);

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
