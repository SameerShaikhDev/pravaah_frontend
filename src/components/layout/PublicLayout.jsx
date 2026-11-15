import React from "react";
import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";
import Footer from "./Footer";
import AmbientBackground from "../visual/AmbientBackground";

export default function PublicLayout() {
  return (
    <div className="relative min-h-dvh bg-canvas flex flex-col">
      <AmbientBackground />
      <div className="relative z-10 flex flex-col flex-1">
        <PublicNavbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
