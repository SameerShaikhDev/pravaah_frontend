import React from "react";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import Logo from "../common/Logo";
import TiltCard from "../common/TiltCard";
import FlowField from "../visual/FlowField";

/**
 * Shared frame for every signed-out form (login, register, reset, OTP, admin login).
 * Left: brand panel with the flow field. Right: the form card. Forms stay in their own pages —
 * all submit handlers / service calls live there, untouched.
 */
export default function AuthShell({ children, brandLabel = "Pravaah" }) {
  return (
    <div className="min-h-dvh grid lg:grid-cols-[1.1fr_1fr] bg-canvas">
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden border-r border-line p-12">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgb(var(--accent)/0.22),transparent_55%)]"
          aria-hidden="true"
        />
        <FlowField lines={14} />
        <Logo label={brandLabel} className="relative" />

        <div className="relative max-w-md">
          <h2 className="font-display text-4xl xl:text-5xl font-semibold leading-[1.12] text-ink mb-5">
            The answer you&rsquo;ve already said out loud is the one you&rsquo;ll give.
          </h2>
          <p className="text-ink-3 leading-relaxed">
            Run a full mock interview, get scored on what you actually said, and fix it before placement season does it for you.
          </p>
        </div>

        <div className="relative max-w-sm">
          <TiltCard max={6}>
            <div className="glass-strong rounded-xl2 p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-full bg-action flex items-center justify-center">
                  <Mic size={16} className="text-white" />
                </span>
                <p className="text-sm text-ink-2">&ldquo;Walk me through a project you&rsquo;re proud of.&rdquo;</p>
              </div>
              <div className="waveform" aria-hidden="true">
                {[
                  "animate-wave-1",
                  "animate-wave-3",
                  "animate-wave-2",
                  "animate-wave-4",
                  "animate-wave-1",
                  "animate-wave-3",
                  "animate-wave-2",
                  "animate-wave-4",
                  "animate-wave-1",
                ].map((c, i) => (
                  <span key={i} className={c} />
                ))}
              </div>
            </div>
          </TiltCard>
        </div>
      </aside>

      <main className="relative flex items-center justify-center px-4 sm:px-6 py-10 sm:py-12">
        <div
          className="absolute inset-0 lg:hidden bg-[radial-gradient(ellipse_at_50%_0%,rgb(var(--accent)/0.2),transparent_60%)]"
          aria-hidden="true"
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md"
        >
          <Logo label={brandLabel} className="lg:hidden mb-8" />
          {children}
        </motion.div>
      </main>
    </div>
  );
}
