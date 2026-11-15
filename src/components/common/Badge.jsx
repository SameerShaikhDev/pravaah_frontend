import React from "react";
import clsx from "clsx";

const TONES = {
  violet: "bg-accent/12 text-accent-hi border-accent/30",
  teal: "bg-success/12 text-success border-success/30",
  coral: "bg-danger/12 text-danger border-danger/30",
  amber: "bg-warn/12 text-warn border-warn/30",
  slate: "bg-ink/5 text-ink-2 border-line",
};

// Tone names are kept for call-site compatibility (violet = info/brand, teal = success, coral = danger, amber = warning).
export default function Badge({ children, tone = "slate", className }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        TONES[tone] || TONES.slate,
        className,
      )}
    >
      {children}
    </span>
  );
}
