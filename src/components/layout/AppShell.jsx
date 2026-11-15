import React, { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AmbientBackground from "../visual/AmbientBackground";

/**
 * One shell for every authenticated area (student, admin, TPO). The role-specific layouts
 * below only supply nav links, the brand label, and page titles — the route guards that wrap
 * them (ProtectedRoute in App.jsx) are unchanged.
 */
export default function AppShell({ links, brandLabel, titleFor }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  // Any navigation (nav link, logo, browser back) closes the mobile drawer.
  useEffect(() => setSidebarOpen(false), [pathname]);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="relative min-h-dvh bg-canvas flex overflow-x-clip">
      <AmbientBackground intensity={0.7} />
      <Sidebar links={links} isOpen={sidebarOpen} onClose={closeSidebar} brandLabel={brandLabel} />
      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} title={titleFor(pathname)} />
        <main className="flex-1 p-4 sm:p-5 lg:p-8 max-w-[1400px] w-full mx-auto">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
