/** @type {import('tailwindcss').Config} */
// All colours resolve to CSS variables declared in src/styles/index.css, so every
// utility (text-ink, bg-surface, border-line ...) is automatically correct in both themes
// and supports opacity modifiers (bg-accent/10).
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: "class",
  future: { hoverOnlyWhenSupported: true },
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: token("canvas"),
        surface: { DEFAULT: token("surface"), 2: token("surface-2") },
        line: token("line"),
        ink: { DEFAULT: token("ink"), 2: token("ink-2"), 3: token("ink-3"), 4: token("ink-4") },
        accent: { DEFAULT: token("accent"), hi: token("accent-hi") },
        flow: token("flow"),
        success: token("success"),
        warn: token("warn"),
        danger: token("danger"),
      },
      fontFamily: {
        display: ["'Bricolage Grotesque'", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["'Instrument Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        // brand gradient (decorative) and action gradient (buttons — darker for AA contrast with white text)
        "pulse-gradient": "linear-gradient(135deg, rgb(var(--accent)) 0%, rgb(var(--flow)) 100%)",
        action: "linear-gradient(135deg, rgb(var(--btn-a)) 0%, rgb(var(--btn-b)) 100%)",
      },
      boxShadow: {
        glass: "var(--shadow-glass)",
        glow: "var(--shadow-glow)",
        lift: "var(--shadow-lift)",
      },
      borderRadius: { xl2: "1.25rem", xl3: "1.75rem" },
      transitionTimingFunction: { snap: "cubic-bezier(0.22, 1, 0.36, 1)" },
      animation: {
        "pulse-slow": "pulse-slow 2.4s ease-in-out infinite",
        float: "float 7s ease-in-out infinite",
        shimmer: "shimmer 1.8s linear infinite",
        shake: "shake 0.35s ease-in-out",
        "wave-1": "wave 1.2s ease-in-out infinite",
        "wave-2": "wave 1.2s ease-in-out 0.15s infinite",
        "wave-3": "wave 1.2s ease-in-out 0.3s infinite",
        "wave-4": "wave 1.2s ease-in-out 0.45s infinite",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: 1, transform: "scale(1)" },
          "50%": { opacity: 0.7, transform: "scale(1.06)" },
        },
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px)" },
          "75%": { transform: "translateX(4px)" },
        },
        wave: { "0%, 100%": { transform: "scaleY(0.3)" }, "50%": { transform: "scaleY(1)" } },
      },
    },
  },
  plugins: [],
};
