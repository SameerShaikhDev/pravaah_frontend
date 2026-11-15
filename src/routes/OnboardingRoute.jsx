import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLoader from "../components/common/PageLoader";

// Guards /onboarding itself - only student/professional accounts belong here, and once
// onboarding is already complete we send them straight to the real dashboard instead.
export default function OnboardingRoute() {
  const { isAuthenticated, isBootstrapping, user } = useAuth();

  if (isBootstrapping) return <PageLoader label="Checking your session" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!["student", "professional", "other"].includes(user?.role)) return <Navigate to="/dashboard" replace />;
  if (user?.onboarding?.completed) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
