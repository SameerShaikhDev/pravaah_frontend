import React, { useCallback } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

/**
 * Surface container. With `hover`, a soft spotlight follows the pointer (CSS vars --mx/--my)
 * and the card lifts — feedback that answers the user's action instead of decorating idle UI.
 */
export default function Card({
  children,
  className,
  hover = false,
  glass = true,
  as: Comp = motion.div,
  onPointerMove,
  ...rest
}) {
  const handleMove = useCallback(
    (e) => {
      if (hover) {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
      onPointerMove?.(e);
    },
    [hover, onPointerMove],
  );

  return (
    <Comp
      onPointerMove={handleMove}
      className={clsx(
        "rounded-xl2 p-6",
        glass ? "glass" : "bg-surface-2 border border-line",
        hover &&
          "spotlight transition-[transform,box-shadow,border-color] duration-300 ease-snap hover:-translate-y-1 hover:border-accent/40 hover:shadow-lift",
        className,
      )}
      {...rest}
    >
      {children}
    </Comp>
  );
}
