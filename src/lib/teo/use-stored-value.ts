"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Reads a localStorage key without tripping hydration.
 *
 * The server snapshot is always null, so SSR and the first client render
 * agree; React then re-renders with the real value. Seeding useState from
 * localStorage instead would mismatch, and reading it in an effect means a
 * synchronous setState in an effect body.
 */
export function useStoredValue(key: string): string | null {
  const subscribe = useCallback((onStoreChange: () => void) => {
    // Fires for changes made in other tabs; same-tab writes update via state.
    window.addEventListener("storage", onStoreChange);
    return () => window.removeEventListener("storage", onStoreChange);
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(key),
    () => null
  );
}
