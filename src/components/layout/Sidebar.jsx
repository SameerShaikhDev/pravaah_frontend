import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import clsx from "clsx";
import Logo from "../common/Logo";
import useOverlay from "../../hooks/useOverlay";

function NavItems({ links, onClose, pillId }) {
  return (
    <nav className="flex-1 overflow-y-auto overscroll-contain py-5 px-3 space-y-1 pb-[max(1.25rem,env(safe-area-inset-bottom))]" aria-label="Primary">
      {links.map((link) => (
        <NavLink key={link.to} to={link.to} end={link.end} onClick={onClose} className="relative block rounded-xl group">
          {({ isActive }) => (
            <>
              {isActive &&
                (pillId ? (
                  <motion.span
                    layoutId={pillId}
                    className="absolute inset-0 rounded-xl bg-accent/15 border border-accent/30 shadow-[0_0_24px_-8px_rgb(var(--accent)/0.6)]"
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  />
                ) : (
                  // Mobile drawer: plain pill (no shared layoutId) so the drawer's exit animation can never stall
                  <span className="absolute inset-0 rounded-xl bg-accent/15 border border-accent/30" />
                ))}
              <span
                className={clsx(
                  "relative flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium transition-colors duration-200",
                  isActive ? "text-ink" : "text-ink-3 group-hover:text-ink",
                )}
              >
                <link.icon
                  size={18}
                  className={clsx("transition-colors", isActive ? "text-accent-hi" : "group-hover:text-accent-hi")}
                />
                {link.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export default function Sidebar({ links, isOpen, onClose, brandLabel = "Pravaah" }) {
  useOverlay(isOpen, onClose, { lockScroll: true });

  return (
    <>
      {/* Desktop: persistent rail */}
      <aside className="hidden lg:flex sticky top-0 h-dvh w-64 shrink-0 flex-col glass-strong border-0 border-r border-line z-30">
        <div className="h-16 flex items-center px-5 border-b border-line/70">
          <Logo label={brandLabel} size={28} className="text-base" />
        </div>
        <NavItems links={links} pillId="sidebar-pill-desktop" />
      </aside>

      {/* Mobile: CSS-driven drawer (always mounted; no exit-animation dependency, so it can't get stuck open) */}
      <div
        className={clsx(
          "fixed inset-0 bg-canvas/70 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        inert={!isOpen ? "" : undefined}
        aria-hidden={!isOpen}
        className={clsx(
          "fixed top-0 left-0 h-dvh w-[min(18rem,85vw)] glass-strong border-r border-line z-50 flex flex-col lg:hidden",
          "transition-transform duration-300 ease-snap will-change-transform",
          isOpen ? "translate-x-0" : "-translate-x-full invisible pointer-events-none",
        )}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-line/70">
          <Logo label={brandLabel} size={28} className="text-base" onClick={onClose} />
          <button className="text-ink-3 hover:text-ink p-2 -mr-2 rounded-lg" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <NavItems links={links} onClose={onClose} />
      </aside>
    </>
  );
}
