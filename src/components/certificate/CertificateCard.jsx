import React, { useEffect, useState } from "react";
import { Award, Download, Linkedin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Card from "../common/Card";
import certificateService from "../../services/certificate.service";
import { useFileDownload, certificateFilename } from "../../utils/useFileDownload";
import { getErrorMessage } from "../../utils/formatters";

/**
 * Shown on Result.jsx / AptitudeReport.jsx after a passing score. Generation is idempotent on
 * the backend (per sourceId), so mounting this and firing `generate` immediately is safe even
 * if the certificate was already auto-generated on the completion flow - it just returns the
 * existing one.
 */
export default function CertificateCard({ sourceType, sourceId, score }) {
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const { run, busyKey } = useFileDownload();
  const downloading = busyKey === "cert";

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await certificateService.generate({ sourceType, sourceId, score });
        if (!cancelled) setCertificate(res.data.certificate);
      } catch (err) {
        if (!cancelled) toast.error(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (sourceId) load();
    return () => {
      cancelled = true;
    };
  }, [sourceType, sourceId, score]);

  const handleDownload = () =>
    run("cert", () => certificateService.download(certificate._id), certificateFilename(certificate));

  if (loading) {
    return (
      <Card className="p-6 flex items-center gap-3 text-ink-3 text-sm">
        <Loader2 className="animate-spin" size={16} /> Preparing your shareable certificate…
      </Card>
    );
  }

  if (!certificate) return null;

  const shareUrl = certificate.publicUrl;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <Card className="p-6 flex flex-col sm:flex-row items-center gap-4 sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-pulse-gradient flex items-center justify-center shrink-0">
          <Award size={22} className="text-white" />
        </div>
        <div>
          <p className="font-medium text-ink">Your certificate is ready</p>
          <p className="text-sm text-ink-4">Share it on LinkedIn to show off your score.</p>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 text-sm rounded-lg font-medium glass text-ink hover:bg-surface-2 border border-line transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
        >
          {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} Download
        </button>
        <a
          href={linkedInShareUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 text-sm rounded-lg font-medium bg-action text-white hover:opacity-90 shadow-glow transition-all duration-200 active:scale-[0.98]"
        >
          <Linkedin size={16} /> Share on LinkedIn
        </a>
      </div>
    </Card>
  );
}
