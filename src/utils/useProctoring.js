import { useEffect, useRef } from "react";
import aptitudeService from "../services/aptitude.service";

/**
 * Listens for document.visibilitychange, window blur, and fullscreen-exit events during a
 * proctored aptitude session and logs them (debounced) to the backend. Per the v1 scope, this
 * is tab/window-focus + fullscreen events only - no face-detection ML model, since none
 * already exists elsewhere in the codebase to reuse (see build spec's fallback instruction).
 */
export default function useProctoring({ testId, enabled }) {
  const lastLoggedRef = useRef({});

  useEffect(() => {
    if (!enabled || !testId) return undefined;

    function log(type) {
      // Debounce: don't spam the same event type more than once every 5s (a user rapidly
      // alt-tabbing shouldn't blow through the rate limiter or the event log).
      const now = Date.now();
      if (lastLoggedRef.current[type] && now - lastLoggedRef.current[type] < 5000) return;
      lastLoggedRef.current[type] = now;
      aptitudeService.logProctorEvent(testId, type).catch(() => {
        // Best-effort - a failed proctor-event log should never interrupt the test itself.
      });
    }

    function handleVisibility() {
      if (document.hidden) log("tab_blur");
    }
    function handleBlur() {
      log("tab_blur");
    }
    function handleFullscreenChange() {
      if (!document.fullscreenElement) log("fullscreen_exit");
    }

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [testId, enabled]);
}
