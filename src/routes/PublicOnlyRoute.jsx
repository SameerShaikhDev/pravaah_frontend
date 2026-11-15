import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLoader from "../components/common/PageLoader";

function homeForUser(user) {
  if (user?.role === "admin") return "/admin/dashboard";
  if (user?.role === "tpo") return user?.mustChangePassword ? "/tpo/change-password" : "/tpo/dashboard";
  if (["student", "professional", "other"].includes(user?.role) && !user?.onboarding?.completed) return "/onboarding";
  return "/dashboard";
}

export default function PublicOnlyRoute() {
  const { isAuthenticated, isBootstrapping, user } = useAuth();

  if (isBootstrapping) return <PageLoader label="Loading" />;

  if (isAuthenticated) {
    return <Navigate to={homeForUser(user)} replace />;
  }

  return <Outlet />;
}
