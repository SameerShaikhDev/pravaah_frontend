import React from "react";
import AppShell from "./AppShell";
import { ADMIN_LINKS } from "../../constants/navLinks";

const TITLES = {
  "/admin/dashboard": "Overview",
  "/admin/students": "Manage students",
  "/admin/interviews": "Manage interviews",
  "/admin/questions": "Manage questions",
  "/admin/analytics": "Analytics",
  "/admin/users": "All users",
};

export default function AdminLayout() {
  return <AppShell links={ADMIN_LINKS} brandLabel="Pravaah Admin" titleFor={(p) => TITLES[p] || "Admin"} />;
}
