import React, { useCallback, useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";
import Logo from "../common/Logo";
import { ThemeToggle } from "./Topbar";
import useOverlay from "../../hooks/useOverlay";

const LINKS = [
  { to: "/features", label: "Features" },
  { to: "/about", label: "About" },
  { to: "/leaderboard", label: "Leaderboard" },
];

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // BACKEND HOOK: isAuthenticated is derived from AuthContext (session restored via auth.service).
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const headerRef = useRef(null);
  const closeMenu = useCallback(() => setOpen(false), []);

  // Close the mobile menu on navigation, on Escape, and when tapping anywhere outside it.
  useEffect(closeMenu, [pathname, closeMenu]);
  useOverlay(open, closeMenu, { ref: headerRef });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = ({ isActive }) =>
    `relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? "text-ink bg-ink/5" : "text-ink-3 hover:text-ink"}`;

  return (
    <header ref={headerRef} className="sticky top-0 z-40 px-3 sm:px-4 pt-3">
      <nav
        className={`max-w-6xl mx-auto h-14 px-4 flex items-center justify-between rounded-2xl border transition-all duration-300 ease-snap ${
          scrolled ? "glass-strong border-line shadow-glass" : "bg-transparent border-transparent"
        }`}
        aria-label="Main"
      >
        <Logo size={30} />

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <Button size="sm" onClick={() => navigate("/dashboard")}>
              Go to dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                Log in
              </Button>
              <Button size="sm" onClick={() => navigate("/register")}>
                Get started
              </Button>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <button className="p-2.5 -mr-1 text-ink-2" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="md:hidden max-w-6xl mx-auto mt-2 glass-strong rounded-2xl p-4 flex flex-col gap-1"
          >
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} onClick={closeMenu} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
            <div className="flex gap-3 pt-3">
              {isAuthenticated ? (
                <Button className="flex-1" onClick={() => navigate("/dashboard")}>
                  Go to dashboard
                </Button>
              ) : (
                <>
                  <Button variant="secondary" className="flex-1" onClick={() => navigate("/login")}>
                    Log in
                  </Button>
                  <Button className="flex-1" onClick={() => navigate("/register")}>
                    Get started
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
