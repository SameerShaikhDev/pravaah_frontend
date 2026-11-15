import React from "react";
import AppShell from "./AppShell";
import { TPO_LINKS } from "../../constants/navLinks";

const TITLES = {
  "/tpo/dashboard": "Overview",
  "/tpo/students": "My students",
  "/tpo/redeem-codes": "Redeem codes",
  "/tpo/settings": "Settings",
};

export default function TpoLayout() {
  return <AppShell links={TPO_LINKS} brandLabel="Pravaah TPO" titleFor={(p) => TITLES[p] || "TPO"} />;
}
