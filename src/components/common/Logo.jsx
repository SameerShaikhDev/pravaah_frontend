import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";

/** Brand mark — a flowing wave ("pravaah" = flow). Single source for every logo lockup. */
export function LogoMark({ size = 32, className }) {
  return (
    <span
      className={clsx("inline-flex items-center justify-center rounded-[10px] bg-pulse-gradient shadow-glow", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 32 32" width={size * 0.66} height={size * 0.66} fill="none">
        <path
          d="M5 18c3-9 6-9 9 0s6 9 9 0 3-5 4-6"
          stroke="#fff"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function Logo({ to = "/", label = "Pravaah", size = 32, className, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={clsx("group inline-flex items-center gap-2.5 font-display text-lg font-semibold text-ink", className)}
    >
      <LogoMark
        size={size}
        className="transition-transform duration-500 ease-snap group-hover:rotate-[-8deg] group-hover:scale-105"
      />
      <span>{label}</span>
    </Link>
  );
}
