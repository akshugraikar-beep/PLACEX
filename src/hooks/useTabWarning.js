import { useState, useEffect, useRef, useCallback } from "react";

const MAX_WARNINGS = 3;

export function useTabWarning(active = true) {
  const [warningCount, setWarningCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [terminated, setTerminated] = useState(false);

  const activeRef   = useRef(active);
  const showingRef  = useRef(false);
  const cooldownRef = useRef(false);

  useEffect(() => { activeRef.current = active; }, [active]);
  useEffect(() => { showingRef.current = showWarning; }, [showWarning]);

  const triggerWarning = useCallback(() => {
    if (!activeRef.current || showingRef.current || cooldownRef.current) return;
    setWarningCount(prev => {
      const next = prev + 1;
      if (next >= MAX_WARNINGS) setTerminated(true);
      return next;
    });
    setShowWarning(true);
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") triggerWarning();
    };
    const onBlur = () => triggerWarning();
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
    };
  }, [triggerWarning]);

  // Dismiss warning modal (Resume Test) — 1-second cooldown to absorb click-blur bounce
  const dismiss = useCallback(() => {
    setShowWarning(false);
    cooldownRef.current = true;
    setTimeout(() => { cooldownRef.current = false; }, 1000);
  }, []);

  // Full reset — call this AFTER onTerminate to clear the overlay completely
  const reset = useCallback(() => {
    setWarningCount(0);
    setShowWarning(false);
    setTerminated(false);
    cooldownRef.current = false;
  }, []);

  return { warningCount, showWarning, dismiss, reset, terminated, maxWarnings: MAX_WARNINGS };
}
