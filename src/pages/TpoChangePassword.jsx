import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthShell from "../components/layout/AuthShell";
import { Lock, ShieldCheck } from "lucide-react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import authService from "../services/auth.service";
import { getErrorMessage } from "../utils/formatters";

export default function TpoChangePassword() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const newPassword = watch("newPassword");

  async function onSubmit(values) {
    setLoading(true);
    try {
      await authService.changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
      setUser({ ...user, mustChangePassword: false });
      toast.success("Password updated. Welcome to your TPO dashboard!");
      navigate("/tpo/dashboard", { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell brandLabel="Pravaah TPO">
      <ShieldCheck className="text-accent-hi mb-3" size={28} />
      <h1 className="font-display text-2xl font-semibold text-ink mb-1.5">Set a new password</h1>
      <p className="text-sm text-ink-3 mb-7">
        For your account's security, please replace the temporary password an admin set for you.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Temporary password"
          type="password"
          icon={<Lock size={16} />}
          placeholder="From the email you received"
          error={errors.currentPassword?.message}
          {...register("currentPassword", { required: "Enter the temporary password you were given" })}
        />
        <Input
          label="New password"
          type="password"
          icon={<Lock size={16} />}
          placeholder="At least 8 characters"
          hint="Must include an uppercase letter, a lowercase letter, and a number."
          error={errors.newPassword?.message}
          {...register("newPassword", {
            required: "New password is required",
            minLength: { value: 8, message: "Must be at least 8 characters" },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
              message: "Needs uppercase, lowercase, and a number",
            },
          })}
        />
        <Input
          label="Confirm new password"
          type="password"
          icon={<Lock size={16} />}
          placeholder="Re-enter your new password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Please confirm your new password",
            validate: (v) => v === newPassword || "Passwords do not match",
          })}
        />

        <Button type="submit" className="w-full" size="lg" isLoading={loading}>
          Update password &amp; continue
        </Button>
      </form>
    </AuthShell>
  );
}
