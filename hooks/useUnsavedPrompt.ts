"use client";

import { useEffect } from "react";

/**
 * 当 hasUnsavedChanges 为 true 时，离开页面前弹出浏览器原生确认框
 */
export function useUnsavedPrompt(hasUnsavedChanges: boolean) {
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasUnsavedChanges]);
}
