import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, User, GraduationCap, Briefcase, Compass, Gift } from "lucide-react";
import { toast } from "sonner";
import AuthShell from "../components/layout/AuthShell";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import authService from "../services/auth.service";
import { getErrorMessage } from "../utils/formatters";

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("student");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  // BACKEND HOOK: authService.register → POST /auth/register (payload incl. optional referralCode unchanged).
  async function onSubmit(values) {
    setLoading(true);
    try {
      await authService.register({
        name: values.name,
        email: values.email,
        password: values.password,
        role,
        ...(referralCode ? { referralCode } : {}),
      });
      toast.success("Account created — verify your email to continue.");
      navigate("/verify-otp", { state: { email: values.email, purpose: "email_verification" } });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1.5">Create your account</h1>
      <p className="text-sm text-ink-3 mb-6">Start practicing in under two minutes.</p>

      {referralCode && (
        <div className="flex items-center gap-2 text-sm text-success bg-success/10 border border-success/30 rounded-lg px-3.5 py-2.5 mb-6">
          <Gift size={16} className="shrink-0" />
          You were referred by a friend — you'll both get a free credit once you finish your first test.
        </div>
      )}

      {/* Step 1 of onboarding really starts right here: which kind of account this is. */}
      <div className="grid grid-cols-3 gap-3 mb-7">
        <button
          type="button"
          onClick={() => setRole("student")}
          className={`flex flex-col items-center gap-2 rounded-xl2 border p-3 sm:p-4 text-sm transition-colors ${
            role === "student" ? "border-accent bg-accent/10 text-ink" : "border-line text-ink-3 hover:border-ink-4"
          }`}
        >
          <GraduationCap size={22} />
          Student
        </button>
        <button
          type="button"
          onClick={() => setRole("professional")}
          className={`flex flex-col items-center gap-2 rounded-xl2 border p-3 sm:p-4 text-sm transition-colors ${
            role === "professional" ? "border-accent bg-accent/10 text-ink" : "border-line text-ink-3 hover:border-ink-4"
          }`}
        >
          <Briefcase size={22} />
          Professional
        </button>
        <button
          type="button"
          onClick={() => setRole("other")}
          className={`flex flex-col items-center gap-2 rounded-xl2 border p-3 sm:p-4 text-sm transition-colors ${
            role === "other" ? "border-accent bg-accent/10 text-ink" : "border-line text-ink-3 hover:border-ink-4"
          }`}
        >
          <Compass size={22} />
          Other
        </button>
      </div>
      {role === "other" && (
        <p className="text-xs text-ink-4 -mt-5 mb-7">
          Competitive exam aspirant (SSC/UPSC/Banking/Railways), freelancer, career break — anyone who isn't a college student or
          a working professional.
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Full name"
          icon={<User size={16} />}
          placeholder="Saniya Sharma"
          error={errors.name?.message}
          {...register("name", { required: "Name is required", maxLength: { value: 100, message: "Name is too long" } })}
        />
        <Input
          label="Email address"
          type="email"
          icon={<Mail size={16} />}
          placeholder={role === "student" ? "you@college.edu" : role === "professional" ? "you@company.com" : "you@example.com"}
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
          })}
        />
        <Input
          label="Password"
          type="password"
          icon={<Lock size={16} />}
          placeholder="At least 8 characters"
          hint="Must include an uppercase letter, a lowercase letter, and a number."
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Must be at least 8 characters" },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
              message: "Needs uppercase, lowercase, and a number",
            },
          })}
        />
        <Input
          label="Confirm password"
          type="password"
          icon={<Lock size={16} />}
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (v) => v === password || "Passwords do not match",
          })}
        />

        <Button type="submit" className="w-full" size="lg" isLoading={loading}>
          Create account
        </Button>
      </form>

      <p className="text-sm text-ink-3 text-center mt-7">
        Already have an account?{" "}
        <Link to="/login" className="text-accent-hi hover:text-accent-hi font-medium">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
