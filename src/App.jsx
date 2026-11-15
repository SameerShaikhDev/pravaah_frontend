import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import PublicLayout from "./components/layout/PublicLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import AdminLayout from "./components/layout/AdminLayout";
import TpoLayout from "./components/layout/TpoLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import OnboardingRoute from "./routes/OnboardingRoute";
import PageLoader from "./components/common/PageLoader";
import { useTheme } from "./context/ThemeContext";

const Landing = lazy(() => import("./pages/Landing"));
const Features = lazy(() => import("./pages/Features"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const OtpVerification = lazy(() => import("./pages/OtpVerification"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const TpoChangePassword = lazy(() => import("./pages/TpoChangePassword"));
const NotFound = lazy(() => import("./pages/NotFound"));

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Achievements = lazy(() => import("./pages/Achievements"));
const Billing = lazy(() => import("./pages/Billing"));
const Settings = lazy(() => import("./pages/Settings"));
const ResumeUpload = lazy(() => import("./pages/ResumeUpload"));
const ResumeAnalysis = lazy(() => import("./pages/ResumeAnalysis"));
const InterviewInstructions = lazy(() => import("./pages/InterviewInstructions"));
const InterviewRoom = lazy(() => import("./pages/InterviewRoom"));
const CodingInterview = lazy(() => import("./pages/CodingInterview"));
const Result = lazy(() => import("./pages/Result"));
const DetailedReport = lazy(() => import("./pages/DetailedReport"));
const InterviewHistory = lazy(() => import("./pages/InterviewHistory"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const AptitudeInstructions = lazy(() => import("./pages/AptitudeInstructions"));
const AptitudeTest = lazy(() => import("./pages/AptitudeTest"));
const AptitudeReport = lazy(() => import("./pages/AptitudeReport"));
const DrillSession = lazy(() => import("./pages/DrillSession"));
const ResumeBuilder = lazy(() => import("./pages/ResumeBuilder"));
const CertificateVerify = lazy(() => import("./pages/CertificateVerify"));

const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ManageStudents = lazy(() => import("./pages/admin/ManageStudents"));
const ManageInterviews = lazy(() => import("./pages/admin/ManageInterviews"));
const ManageQuestions = lazy(() => import("./pages/admin/ManageQuestions"));
const ManageUsers = lazy(() => import("./pages/admin/ManageUsers"));
const AnalyticsDashboard = lazy(() => import("./pages/admin/AnalyticsDashboard"));
const ManageColleges = lazy(() => import("./pages/admin/ManageColleges"));
const ManageRedeemCodes = lazy(() => import("./pages/admin/ManageRedeemCodes"));
const ManagePlans = lazy(() => import("./pages/admin/ManagePlans"));

const TpoDashboard = lazy(() => import("./pages/tpo/TpoDashboard"));
const TpoStudents = lazy(() => import("./pages/tpo/TpoStudents"));
const TpoRedeemCodes = lazy(() => import("./pages/tpo/TpoRedeemCodes"));
const TpoBuySeats = lazy(() => import("./pages/tpo/TpoBuySeats"));

// Toasts follow the active theme.
function ThemedToaster() {
  const { theme } = useTheme();
  return (
    <Toaster
      theme={theme}
      position="top-right"
      richColors
      closeButton
      toastOptions={{ classNames: { toast: "!rounded-2xl !font-body !backdrop-blur-xl" } }}
    />
  );
}

export default function App() {
  return (
    <>
      <ThemedToaster />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public marketing pages */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/features" element={<Features />} />
            <Route path="/about" element={<About />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/certificates/verify/:slug" element={<CertificateVerify />} />
          </Route>

          {/* Auth pages — redirect away if already logged in */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<OtpVerification />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Route>

          {/* Onboarding wizard — student/professional accounts land here right after email verification */}
          <Route element={<OnboardingRoute />}>
            <Route path="/onboarding" element={<Onboarding />} />
          </Route>

          {/* Student / Working Professional dashboard */}
          <Route element={<ProtectedRoute allowedRoles={["student", "professional", "other"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/resume" element={<ResumeUpload />} />
              <Route path="/resume/analysis" element={<ResumeAnalysis />} />
              <Route path="/resume/builder" element={<ResumeBuilder />} />
              <Route path="/history" element={<InterviewHistory />} />
              <Route path="/interview/:id/instructions" element={<InterviewInstructions />} />
              <Route path="/interview/:id/result" element={<Result />} />
              <Route path="/interview/:id/report" element={<DetailedReport />} />
              <Route path="/aptitude" element={<AptitudeInstructions />} />
              <Route path="/aptitude/:id/report" element={<AptitudeReport />} />
            </Route>
            {/* Full-screen focus flows without sidebar chrome */}
            <Route path="/interview/:id/room" element={<InterviewRoom />} />
            <Route path="/interview/:id/coding" element={<CodingInterview />} />
            <Route path="/aptitude/:id" element={<AptitudeTest />} />
            <Route path="/drills/:id" element={<DrillSession />} />
          </Route>

          {/* Admin dashboard */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/colleges" element={<ManageColleges />} />
              <Route path="/admin/redeem-codes" element={<ManageRedeemCodes />} />
              <Route path="/admin/students" element={<ManageStudents />} />
              <Route path="/admin/interviews" element={<ManageInterviews />} />
              <Route path="/admin/questions" element={<ManageQuestions />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
              <Route path="/admin/plans" element={<ManagePlans />} />
            </Route>
          </Route>

          {/* TPO change-password gate — no sidebar chrome, forced before anything else */}
          <Route element={<ProtectedRoute allowedRoles={["tpo"]} />}>
            <Route path="/tpo/change-password" element={<TpoChangePassword />} />
          </Route>

          {/* TPO dashboard */}
          <Route element={<ProtectedRoute allowedRoles={["tpo"]} />}>
            <Route element={<TpoLayout />}>
              <Route path="/tpo/dashboard" element={<TpoDashboard />} />
              <Route path="/tpo/students" element={<TpoStudents />} />
              <Route path="/tpo/redeem-codes" element={<TpoRedeemCodes />} />
              <Route path="/tpo/buy-seats" element={<TpoBuySeats />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
