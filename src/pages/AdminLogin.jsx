import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import AuthShell from "../components/layout/AuthShell";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/formatters";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // BACKEND HOOK: AuthContext.login → POST /auth/login; non-admin accounts are rejected client-side exactly as before.
  async function onSubmit(values) {
    setLoading(true);
    try {
      const user = await login(values);
      if (user.role !== "admin") {
        toast.error("This login is for administrators only.");
        return;
      }
      toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell brandLabel="Pravaah Admin">
      <h1 className="font-display text-2xl font-semibold text-ink mb-1.5">Administrator sign in</h1>
      <p className="text-sm text-ink-3 mb-7">Restricted to placement cell and faculty accounts.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email address"
          type="email"
          icon={<Mail size={16} />}
          placeholder="admin@college.edu"
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
        <Button type="submit" className="w-full" size="lg" isLoading={loading}>
          Sign in
        </Button>
      </form>
      <p className="text-xs text-ink-4 text-center mt-7">
        Student?{" "}
        <Link to="/login" className="text-ink-3 hover:text-ink-2">
          Log in here
        </Link>
      </p>
    </AuthShell>
  );
}
