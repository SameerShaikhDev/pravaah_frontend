import { useTheme } from "../../context/ThemeContext";

// Recharts writes colours into SVG attributes, where CSS variables don't resolve —
// so charts take concrete hex values per theme. Keep in sync with the tokens in styles/index.css.
const PALETTES = {
  dark: {
    grid: "#242E4A",
    tick: "#98A2BC",
    muted: "#7A85A3",
    tooltipBg: "#12192C",
    text: "#EEF1FA",
    accent: "#7C6CFF",
    flow: "#2EE6D0",
  },
  light: {
    grid: "#DAE0F0",
    tick: "#525D7A",
    muted: "#646F8A",
    tooltipBg: "#FFFFFF",
    text: "#0B1020",
    accent: "#5B48E8",
    flow: "#009E94",
  },
};

export function useChartColors() {
  const { isDark } = useTheme();
  const c = isDark ? PALETTES.dark : PALETTES.light;
  return {
    ...c,
    tooltipStyle: {
      background: c.tooltipBg,
      border: `1px solid ${c.grid}`,
      borderRadius: 12,
      color: c.text,
      boxShadow: "0 12px 32px -12px rgba(0,0,0,0.45)",
      fontSize: 12,
    },
  };
}
