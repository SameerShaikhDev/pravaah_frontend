import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trophy, Brain, Sparkles, Award, Download, Loader2, ExternalLink } from "lucide-react";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import { SkeletonCard } from "../components/common/Skeleton";
import achievementsService from "../services/achievements.service";
import certificateService from "../services/certificate.service";
import { useFileDownload, certificateFilename } from "../utils/useFileDownload";
import { formatDate, getErrorMessage } from "../utils/formatters";

function CertificateRow({ cert }) {
  const { run, busyKey } = useFileDownload();
  const downloading = busyKey === cert._id;

  const handleDownload = () =>
    run(cert._id, () => certificateService.download(cert._id), certificateFilename(cert));

  return (
    <div className="flex items-center justify-between gap-3 border border-line rounded-lg px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-9 h-9 rounded-lg bg-pulse-gradient flex items-center justify-center shrink-0">
          <Award size={16} className="text-white" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink capitalize truncate">
            {cert.sourceType} certificate · {cert.score}/100
          </p>
          <p className="text-xs text-ink-4">{formatDate(cert.issuedAt)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <a
          href={cert.publicUrl}
          target="_blank"
          rel="noreferrer"
          className="w-9 h-9 rounded-lg glass border border-line flex items-center justify-center text-ink-2 hover:bg-surface-2 transition-colors"
          aria-label="Open verification page"
        >
          <ExternalLink size={15} />
        </a>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-action text-white shadow-glow hover:opacity-90 disabled:opacity-60"
        >
          {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          PDF
        </button>
      </div>
    </div>
  );
}

export default function Achievements() {
  const [data, setData] = useState(null);
  const [certificates, setCertificates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([achievementsService.getMy(), certificateService.getMy()])
      .then(([achRes, certRes]) => {
        if (achRes.status === "fulfilled") setData(achRes.value.data);
        else toast.error(getErrorMessage(achRes.reason));
        if (certRes.status === "fulfilled") setCertificates(certRes.value.data.certificates || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 gap-5">
        {Array.from({ length: 2 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!data) return <Card className="p-10 text-center max-w-lg mx-auto">Could not load your achievements.</Card>;

  const { bestInterviewScore, bestAptitudeScore, bestAptitudeRole, totalInterviews, totalAptitudeTests, strengths } = data;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-ink mb-1.5">Your achievements</h2>
        <p className="text-sm text-ink-4">Best scores, strong points, and certificates earned so far.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Card className="p-6">
          <div className="flex items-center gap-2 text-ink-3 text-xs mb-3">
            <Trophy size={14} /> Highest interview score
          </div>
          {bestInterviewScore != null ? (
            <>
              <p className="font-display text-3xl font-semibold text-ink">
                {bestInterviewScore}
                <span className="text-base text-ink-4">/100</span>
              </p>
              <p className="text-xs text-ink-4 mt-1">
                Across {totalInterviews} interview{totalInterviews === 1 ? "" : "s"}
              </p>
            </>
          ) : (
            <p className="text-sm text-ink-4">No interviews completed yet.</p>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 text-ink-3 text-xs mb-3">
            <Brain size={14} /> Highest aptitude score
          </div>
          {bestAptitudeScore != null ? (
            <>
              <p className="font-display text-3xl font-semibold text-ink">
                {Math.round(bestAptitudeScore)}
                <span className="text-base text-ink-4">%</span>
              </p>
              <p className="text-xs text-ink-4 mt-1">
                {bestAptitudeRole ? `${bestAptitudeRole} · ` : ""}Across {totalAptitudeTests} test
                {totalAptitudeTests === 1 ? "" : "s"}
              </p>
            </>
          ) : (
            <p className="text-sm text-ink-4">No aptitude tests completed yet.</p>
          )}
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 text-ink-3 text-xs mb-3">
          <Sparkles size={14} /> Your strong points
        </div>
        {strengths?.length ? (
          <div className="flex flex-wrap gap-2">
            {strengths.map((s) => (
              <Badge key={s} tone="teal">
                {s}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-4">Complete a few interviews or tests and your top strengths will show up here.</p>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="font-display font-semibold text-ink mb-4 flex items-center gap-2">
          <Award size={16} /> Certificates
        </h3>
        {!certificates?.length ? (
          <p className="text-sm text-ink-4">Complete an interview or aptitude test to earn your first certificate.</p>
        ) : (
          <div className="space-y-3">
            {certificates.map((c) => (
              <CertificateRow key={c._id} cert={c} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
