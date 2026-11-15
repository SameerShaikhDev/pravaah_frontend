import React from "react";

/** Fixed, pointer-less aurora + dotted grid behind app chrome. Pure CSS — zero JS cost. */
export default function AmbientBackground({ intensity = 1 }) {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-0 overflow-hidden pointer-events-none" style={{ opacity: intensity }}>
      <div className="absolute -top-40 -left-32 w-[360px] h-[360px] sm:w-[640px] sm:h-[640px] rounded-full bg-accent/20 blur-[90px] sm:blur-[140px]" />
      <div className="absolute -bottom-52 -right-32 w-[320px] h-[320px] sm:w-[560px] sm:h-[560px] rounded-full bg-flow/10 blur-[90px] sm:blur-[150px]" />
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: "radial-gradient(rgb(var(--ink) / 0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 20%, transparent 75%)",
        }}
      />
    </div>
  );
}
