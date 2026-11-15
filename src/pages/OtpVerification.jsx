import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import AuthShell from "../components/layout/AuthShell";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import authService from "../services/auth.service";
import { getErrorMessage } from "../utils/formatters";

export default function OtpVerification() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const purpose = location.state?.purpose || "reset";
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("otp");
  const [resetToken, setResetToken] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const otp = watch("otp");

  // BACKEND HOOKS: authService.verifyOtp (OTP → resetToken) then authService.resetPassword. Flow unchanged.
  async function verifyOtp() {
    setLoading(true);
    try {
      const res = await authService.verifyOtp({ email, otp, purpose });
      if (purpose === "email_verification") {
        toast.success("Email verified! You can log in now.");
        navigate("/login");
        return;
      }
      // Backend clears the OTP once it's verified and issues a short-lived resetToken instead -
      // that token (not the OTP again) is what authorizes the password change below.
      setResetToken(res.data.resetToken);
      toast.success("Code verified.");
      setStep("reset");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(values) {
    setLoading(true);
    try {
      await authService.resetPassword({ email, resetToken, newPassword: values.password });
      toast.success("Password reset. You can log in now.");
      navigate("/login");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      {step === "otp" ? (
        <>
          <h1 className="font-display text-2xl font-semibold text-ink mb-1.5">Enter the code</h1>
          <p className="text-sm text-ink-3 mb-7">
            We sent a 6-digit code to <span className="text-ink-2">{email || "your email"}</span>.
          </p>
          <form onSubmit={handleSubmit(verifyOtp)} className="space-y-5">
            <Input
              label="One-time code"
              icon={<ShieldCheck size={16} />}
              placeholder="123456"
              maxLength={6}
              error={errors.otp?.message}
              {...register("otp", { required: "Code is required" })}
            />
            <Button type="submit" className="w-full" size="lg" isLoading={loading}>
              Verify code
            </Button>
          </form>
        </>
      ) : (
        <>
          <h1 className="font-display text-2xl font-semibold text-ink mb-1.5">Set a new password</h1>
          <p className="text-sm text-ink-3 mb-7">Choose something you haven't used before.</p>
          <form onSubmit={handleSubmit(resetPassword)} className="space-y-5">
            <Input
              label="New password"
              type="password"
              placeholder="At least 8 characters"
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Must be at least 8 characters" },
              })}
            />
            <Button type="submit" className="w-full" size="lg" isLoading={loading}>
              Reset password
            </Button>
          </form>
        </>
      )}
      <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm text-ink-3 hover:text-ink mt-7">
        <ArrowLeft size={14} /> Back to login
      </Link>
    </AuthShell>
  );
}
