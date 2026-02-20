"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface ProjectDetailContextType {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

const ProjectDetailContext = createContext<ProjectDetailContextType | null>(null);

export function ProjectDetailProvider({ children }: { children: React.ReactNode }) {
  const [selectedId, setSelectedIdState] = useState<string | null>(null);
  const setSelectedId = useCallback((id: string | null) => setSelectedIdState(id), []);

  return (
    <ProjectDetailContext.Provider value={{ selectedId, setSelectedId }}>
      {children}
    </ProjectDetailContext.Provider>
  );
}

export function useProjectDetail() {
  const ctx = useContext(ProjectDetailContext);
  if (!ctx) throw new Error("useProjectDetail must be used within ProjectDetailProvider");
  return ctx;
}
