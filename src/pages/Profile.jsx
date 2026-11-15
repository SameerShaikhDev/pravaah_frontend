import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { User, Mail, GraduationCap, Briefcase, Zap, Calendar, ArrowUpRight, Award } from "lucide-react";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import { useAuth } from "../context/AuthContext";
import { initials, formatDate, getErrorMessage } from "../utils/formatters";
import authService from "../services/auth.service";
import certificateService from "../services/certificate.service";
import { useFileDownload, certificateFilename } from "../utils/useFileDownload";

function PlanCard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    authService
      .getPlanSummary()
      .then((res) => setSummary(res.data))
      .catch((err) => toast.error(getErrorMessage(err)));
  }, []);

  if (!summary) return null;

  const { plan, planExpiresAt, isExpired, interviewCreditsRemaining, interviewsToday, aptitudeTestsToday } = summary;

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-pulse-gradient flex items-center justify-center shrink-0">
            <Zap size={18} className="text-white" />
          </span>
          <div>
            <h3 className="font-display font-semibold text-ink">
              {plan ? plan.name : "No active plan"}
              {isExpired && (
                <Badge tone="coral" className="ml-2">
                  Expired
                </Badge>
              )}
            </h3>
            {planExpiresAt && (
              <p className="text-xs text-ink-4 flex items-center gap-1 mt-0.5">
                <Calendar size={11} /> {isExpired ? "Expired on" : "Renews on"} {formatDate(planExpiresAt)}
              </p>
            )}
          </div>
        </div>
        <Link
          to="/billing"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-lg bg-action text-white shadow-glow hover:opacity-90"
        >
          {plan ? "Renew / Upgrade" : "Choose a plan"} <ArrowUpRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-line">
        <div>
          <p className="text-xs text-ink-4 mb-1">Credits left</p>
          <p className="text-lg font-display font-semibold text-ink">{interviewCreditsRemaining}</p>
        </div>
        <div>
          <p className="text-xs text-ink-4 mb-1">Interviews today</p>
          <p className="text-lg font-display font-semibold text-ink">{interviewsToday}</p>
        </div>
        <div>
          <p className="text-xs text-ink-4 mb-1">Aptitude tests today</p>
          <p className="text-lg font-display font-semibold text-ink">{aptitudeTestsToday}</p>
        </div>
      </div>
    </Card>
  );
}

function CertificatesTab() {
  const [certificates, setCertificates] = useState(null);
  const { run, busyKey: downloadingId } = useFileDownload();

  useEffect(() => {
    certificateService
      .getMy()
      .then((res) => setCertificates(res.data.certificates || []))
      .catch((err) => toast.error(getErrorMessage(err)));
  }, []);

  if (certificates === null) return null;

  return (
    <Card className="p-6">
      <h3 className="font-display font-semibold text-ink mb-5 flex items-center gap-2">
        <Award size={16} /> Certificates
      </h3>
      {certificates.length === 0 ? (
        <p className="text-sm text-ink-4">Complete an interview or aptitude test to earn your first certificate.</p>
      ) : (
        <div className="space-y-3">
          {certificates.map((c) => (
            <div key={c._id} className="flex items-center justify-between text-sm border border-line rounded-lg px-4 py-3">
              <div>
                <p className="text-ink font-medium capitalize">
                  {c.sourceType} · Score {c.score}/100
                </p>
                <p className="text-xs text-ink-4">{formatDate(c.issuedAt)}</p>
              </div>
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => run(c._id, () => certificateService.download(c._id), certificateFilename(c))}
                  disabled={downloadingId === c._id}
                  className="text-accent-hi hover:text-accent-hi text-xs font-medium disabled:opacity-60"
                >
                  {downloadingId === c._id ? "Downloading…" : "Download"}
                </button>
                <a
                  href={c.publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-success hover:text-success text-xs font-medium"
                >
                  Verify link
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default function Profile() {
  const { user, setUser } = useAuth();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name,
      college: user?.college || "",
      degree: user?.degree || "",
      targetRole: user?.targetRole || "",
      bio: user?.bio || "",
    },
  });

  function onSubmit(values) {
    setUser({ ...user, ...values });
    toast.success("Profile updated locally — connect a PATCH /users/me endpoint to persist this.");
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Card className="p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-action flex items-center justify-center text-white font-display text-xl font-semibold">
          {initials(user?.name || "U")}
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">{user?.name}</h2>
          <p className="text-sm text-ink-4">{user?.email}</p>
        </div>
      </Card>

      <PlanCard />

      <Card className="p-6">
        <h3 className="font-display font-semibold text-ink mb-5">Personal details</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-5">
          <Input label="Full name" icon={<User size={16} />} {...register("name")} />
          <Input label="Email" icon={<Mail size={16} />} value={user?.email} disabled />
          <Input label="College" icon={<GraduationCap size={16} />} {...register("college")} />
          <Input label="Target role" icon={<Briefcase size={16} />} {...register("targetRole")} />
          <div className="sm:col-span-2">
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </Card>

      <CertificatesTab />
    </div>
  );
}
