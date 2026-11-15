import React from "react";
import AppShell from "./AppShell";
import { STUDENT_LINKS } from "../../constants/navLinks";

const TITLES = {
  "/dashboard": "Dashboard",
  "/resume": "Resume",
  "/resume/analysis": "Resume analysis",
  "/history": "Interview history",
  "/achievements": "Achievements",
  "/leaderboard": "Leaderboard",
  "/profile": "Profile",
  "/settings": "Settings",
  "/interview": "Interview instructions",
};

export default function DashboardLayout() {
  return <AppShell links={STUDENT_LINKS} brandLabel="Pravaah" titleFor={(p) => TITLES[p] || "Dashboard"} />;
}
