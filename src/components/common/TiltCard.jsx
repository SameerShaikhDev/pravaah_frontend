import React from "react";
import clsx from "clsx";
import useTilt from "../../hooks/useTilt";

/** Perspective-tilt wrapper with a moving glare. Use sparingly — one or two hero moments per page. */
export default function TiltCard({ children, className, max = 8, ...rest }) {
  const tilt = useTilt({ max });
  return (
    <div style={{ perspective: "1200px" }} className="h-full">
      <div
        {...tilt}
        {...rest}
        className={clsx("relative h-full will-change-transform transition-transform duration-200 ease-out", className)}
        style={{ transform: "rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) scale(var(--s,1))", transformStyle: "preserve-3d" }}
      >
        {children}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 [div:hover>&]:opacity-100"
          style={{
            background: "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgb(255 255 255 / 0.09), transparent 60%)",
          }}
        />
      </div>
    </div>
  );
}
