import { useCallback, useRef } from "react";

/**
 * Lightweight 3D tilt (no dependency, no re-renders): writes CSS variables directly to the element.
 * Disabled on touch devices and for users who prefer reduced motion.
 */
export default function useTilt({ max = 8, scale = 1.02 } = {}) {
  const ref = useRef(null);
  const frame = useRef(0);
  const enabled = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onPointerMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el || !enabled()) return;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty("--ry", `${(px - 0.5) * 2 * max}deg`);
        el.style.setProperty("--rx", `${(0.5 - py) * 2 * max}deg`);
        el.style.setProperty("--s", scale);
        el.style.setProperty("--mx", `${px * 100}%`);
        el.style.setProperty("--my", `${py * 100}%`);
      });
    },
    [max, scale],
  );

  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--s", 1);
  }, []);

  return { ref, onPointerMove, onPointerLeave };
}
