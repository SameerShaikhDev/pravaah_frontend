import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLoader from "../components/common/PageLoader";

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, isBootstrapping, user } = useAuth();
  const location = useLocation();

  if (isBootstrapping) return <PageLoader label="Checking your session" />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Student/Professional accounts must finish onboarding (profile, resume, target role,
  // plan + payment/redeem) before they can reach the main app.
  if (["student", "professional", "other"].includes(user?.role) && !user?.onboarding?.completed) {
    return <Navigate to="/onboarding" replace />;
  }

  // A TPO created by an admin must set their own password before doing anything else -
  // but don't redirect them away from the change-password page itself (avoids a loop).
  if (user?.role === "tpo" && user?.mustChangePassword && location.pathname !== "/tpo/change-password") {
    return <Navigate to="/tpo/change-password" replace />;
  }

  return <Outlet />;
}
