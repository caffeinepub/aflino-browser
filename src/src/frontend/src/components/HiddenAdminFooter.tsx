import { useCallback, useRef } from "react";

const HOLD_DURATION = 3000;

export function HiddenAdminFooter() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerAdmin = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate(200);
    window.location.href = "/admin";
  }, []);

  const cancelTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Mobile: touch hold
  const handleTouchStart = useCallback(() => {
    cancelTimer();
    timerRef.current = setTimeout(triggerAdmin, HOLD_DURATION);
  }, [cancelTimer, triggerAdmin]);

  // Desktop: right-click hold
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 2) return; // right button only
      cancelTimer();
      timerRef.current = setTimeout(triggerAdmin, HOLD_DURATION);
    },
    [cancelTimer, triggerAdmin],
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 2) cancelTimer();
    },
    [cancelTimer],
  );

  // Prevent context menu from appearing; hold must complete silently
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="pt-4 pb-2 text-center select-none">
      <p style={{ color: "#888888", fontSize: "12px" }}>
        © 2026{" "}
        <span
          onTouchStart={handleTouchStart}
          onTouchEnd={cancelTimer}
          onTouchCancel={cancelTimer}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={cancelTimer}
          onContextMenu={handleContextMenu}
          style={{ cursor: "default", userSelect: "none" }}
        >
          Aflino
        </span>
        . All Rights Reserved.
      </p>
    </div>
  );
}
