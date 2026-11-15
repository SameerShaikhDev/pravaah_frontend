import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import AuthShell from "../components/layout/AuthShell";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/formatters";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // BACKEND HOOK: AuthContext.login → POST /auth/login. Role-based redirect logic below is unchanged.
  async function onSubmit(values) {
    setLoading(true);
    try {
      const user = await login(values);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
      let redirectTo = location.state?.from?.pathname;
      if (!redirectTo) {
        if (user.role === "admin") redirectTo = "/admin/dashboard";
        else if (user.role === "tpo") redirectTo = user.mustChangePassword ? "/tpo/change-password" : "/tpo/dashboard";
        else if (["student", "professional", "other"].includes(user.role) && !user.onboarding?.completed)
          redirectTo = "/onboarding";
        else redirectTo = "/dashboard";
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1.5">Welcome back</h1>
      <p className="text-sm text-ink-3 mb-7">Log in to continue your interview prep.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email address"
          type="email"
          icon={<Mail size={16} />}
          placeholder="you@college.edu"
          error={errors.email?.message}
          {...register("email", { required: "Email is required" })}
        />
        <Input
          label="Password"
          type="password"
          icon={<Lock size={16} />}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password", { required: "Password is required" })}
        />

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs text-accent-hi hover:text-accent-hi">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" isLoading={loading}>
          Log in
        </Button>
      </form>

      <p className="text-sm text-ink-3 text-center mt-7">
        New here?{" "}
        <Link to="/register" className="text-accent-hi hover:text-accent-hi font-medium">
          Create an account
        </Link>
      </p>
      <p className="text-xs text-ink-4 text-center mt-3">
        Faculty or admin?{" "}
        <Link to="/admin/login" className="text-ink-3 hover:text-ink-2">
          Sign in here
        </Link>
      </p>
    </AuthShell>
  );
}
