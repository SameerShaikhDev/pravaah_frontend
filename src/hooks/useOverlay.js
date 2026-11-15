import { useEffect } from "react";

/**
 * Shared behaviour for anything that floats above the page (modal, drawer, dropdown):
 *  - Escape closes it
 *  - optional: tapping/clicking outside `ref` closes it (replaces a full-screen backdrop <div>,
 *    which breaks inside ancestors that use backdrop-filter because `fixed` then becomes
 *    relative to that ancestor instead of the viewport)
 *  - optional: locks background scrolling while open
 */
export default function useOverlay(isOpen, onClose, { ref, lockScroll = false } = {}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const onKey = (e) => e.key === "Escape" && onClose?.();
    const onPointer = (e) => ref?.current && !ref.current.contains(e.target) && onClose?.();
    document.addEventListener("keydown", onKey);
    if (ref) document.addEventListener("pointerdown", onPointer);

    const { overflow } = document.body.style;
    if (lockScroll) document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      if (ref) document.removeEventListener("pointerdown", onPointer);
      if (lockScroll) document.body.style.overflow = overflow;
    };
  }, [isOpen, onClose, ref, lockScroll]);
}
