import React, { useCallback, useRef, useState } from "react";
import { Menu, Sun, Moon, Bell, LogOut, ChevronDown, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import useOverlay from "../../hooks/useOverlay";

export function ThemeToggle({ className = "" }) {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={`relative p-2 rounded-xl text-ink-3 hover:text-ink hover:bg-ink/5 transition-colors ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
          className="block"
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.18 }}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

export default function Topbar({ onMenuClick, title }) {
  // BACKEND HOOK: `user` and `logout` come from AuthContext (auth.service → /auth/*). UI-only wrapper here.
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuRef = useRef(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useOverlay(menuOpen, closeMenu, { ref: menuRef });

  async function handleLogout() {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  }

  return (
    <header className="h-16 sticky top-0 z-20 glass border-0 border-b border-line/70 flex items-center justify-between gap-2 px-3 sm:px-5">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          className="lg:hidden p-2 -ml-1 rounded-lg text-ink-2 hover:bg-ink/5 shrink-0"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="font-display text-base sm:text-lg font-semibold text-ink truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        <ThemeToggle />
        <button
          className="relative p-2 rounded-xl text-ink-3 hover:text-ink hover:bg-ink/5 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-flow ring-2 ring-canvas" />
        </button>

        <div ref={menuRef} className="relative ml-1">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-ink/5 transition-colors"
          >
            <span className="w-8 h-8 rounded-full bg-action flex items-center justify-center text-white text-sm font-semibold ring-2 ring-accent/30">
              {user?.name?.[0]?.toUpperCase() || <User size={14} />}
            </span>
            <ChevronDown
              size={14}
              className={`text-ink-3 hidden sm:block transition-transform ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                role="menu"
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                style={{ transformOrigin: "top right" }}
                className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-2rem)] glass-strong rounded-2xl p-2 z-20"
              >
                <p className="px-3 pt-2 text-sm text-ink font-medium truncate">{user?.name}</p>
                <p className="px-3 pb-2 text-xs text-ink-4 truncate">{user?.email}</p>
                <div className="h-px bg-line my-1" />
                <button
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(user?.role === "admin" ? "/admin/dashboard" : "/profile");
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-ink-2 hover:text-ink hover:bg-ink/5 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <User size={15} /> Profile
                </button>
                <button
                  role="menuitem"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <LogOut size={15} /> Log out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
