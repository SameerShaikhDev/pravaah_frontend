import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

// Pure UI state (no backend involvement). With no saved choice the theme follows the device/browser
// setting (prefers-color-scheme) and updates live when the system theme changes. Once the user taps
// the toggle, their explicit choice is saved and wins. Same attribute is applied before first paint
// by the inline script in index.html, so there is no flash of the wrong theme.
const ThemeContext = createContext(null);
const KEY = "theme";
const mq = () => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-color-scheme: light)") : null);
const systemTheme = () => (mq()?.matches ? "light" : "dark");
const saved = () => {
  try {
    const t = localStorage.getItem(KEY);
    return t === "dark" || t === "light" ? t : null;
  } catch {
    return null;
  }
};

export function ThemeProvider({ children }) {
  const [choice, setChoice] = useState(saved); // null = follow system
  const [system, setSystem] = useState(systemTheme);
  const theme = choice || system;

  useEffect(() => {
    const m = mq();
    if (!m) return undefined;
    const on = () => setSystem(m.matches ? "light" : "dark");
    m.addEventListener ? m.addEventListener("change", on) : m.addListener(on);
    return () => (m.removeEventListener ? m.removeEventListener("change", on) : m.removeListener(on));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#060912" : "#F4F6FB");
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      isSystem: choice === null,
      toggleTheme: () => {
        const next = theme === "dark" ? "light" : "dark";
        try { localStorage.setItem(KEY, next); } catch { /* private mode */ }
        setChoice(next);
      },
      setTheme: (t) => {
        try {
          t === "system" ? localStorage.removeItem(KEY) : localStorage.setItem(KEY, t);
        } catch { /* private mode */ }
        setChoice(t === "system" ? null : t);
      },
    }),
    [theme, choice],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
