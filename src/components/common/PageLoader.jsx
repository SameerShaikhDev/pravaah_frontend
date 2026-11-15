import React from "react";
import { LogoMark } from "./Logo";

export default function PageLoader({ label = "Loading" }) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-6 bg-canvas" role="status" aria-live="polite">
      <div className="relative">
        <span className="absolute inset-0 rounded-full bg-accent/30 blur-2xl animate-pulse-slow" aria-hidden="true" />
        <LogoMark size={48} className="relative" />
      </div>
      <div className="waveform" aria-hidden="true">
        <span className="animate-wave-1" />
        <span className="animate-wave-2" />
        <span className="animate-wave-3" />
        <span className="animate-wave-4" />
        <span className="animate-wave-2" />
      </div>
      <p className="text-sm text-ink-3">{label}&hellip;</p>
    </div>
  );
}
