import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import AuthShell from "../components/layout/AuthShell";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import authService from "../services/auth.service";
import { getErrorMessage } from "../utils/formatters";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // BACKEND HOOK: authService.forgotPassword → POST /auth/forgot-password.
  async function onSubmit(values) {
    setLoading(true);
    try {
      await authService.forgotPassword(values);
      toast.success("Reset code sent to your email.");
      navigate("/verify-otp", { state: { email: values.email, purpose: "reset" } });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1.5">Reset your password</h1>
      <p className="text-sm text-ink-3 mb-7">We'll email you a one-time code to verify it's you.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email address"
          type="email"
          icon={<Mail size={16} />}
          placeholder="you@college.edu"
          error={errors.email?.message}
          {...register("email", { required: "Email is required" })}
        />
        <Button type="submit" className="w-full" size="lg" isLoading={loading}>
          Send reset code
        </Button>
      </form>

      <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm text-ink-3 hover:text-ink mt-7">
        <ArrowLeft size={14} /> Back to login
      </Link>
    </AuthShell>
  );
}
