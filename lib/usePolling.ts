"use client";

import { useEffect, useRef } from "react";

/**
 * Calls `callback` every `intervalMs` so an open conversation picks up new
 * messages without a manual refresh. Skips ticks while the tab is hidden to
 * avoid burning requests on backgrounded tabs. Always calls the latest
 * `callback` passed in (via a ref) so callers don't need to worry about
 * stale closures or restarting the interval when their own state changes.
 */
export function usePolling(callback: () => void, intervalMs: number) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "hidden") return;
      callbackRef.current();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);
}
