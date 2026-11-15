import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BadgeCheck, ShieldX, Loader2 } from "lucide-react";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import certificateService from "../services/certificate.service";
import { getErrorMessage } from "../utils/formatters";

const SOURCE_LABELS = { interview: "AI Mock Interview", aptitude: "Aptitude Assessment" };

export default function CertificateVerify() {
  const { slug } = useParams();
  const [cert, setCert] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    certificateService
      .verify(slug)
      .then((res) => setCert(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <Card className="p-8 text-center space-y-4">
        {loading ? (
          <div className="py-8 flex flex-col items-center gap-3 text-ink-3">
            <Loader2 className="animate-spin" size={24} />
            Verifying certificate…
          </div>
        ) : error || !cert ? (
          <>
            <ShieldX size={40} className="mx-auto text-danger" />
            <h1 className="font-display text-xl font-semibold text-ink">Certificate not found</h1>
            <p className="text-sm text-ink-4">{error || "This verification link is invalid or has expired."}</p>
          </>
        ) : cert.revoked ? (
          <>
            <ShieldX size={40} className="mx-auto text-danger" />
            <h1 className="font-display text-xl font-semibold text-ink">Certificate revoked</h1>
            <p className="text-sm text-ink-4">This certificate is no longer valid.</p>
          </>
        ) : (
          <>
            <BadgeCheck size={40} className="mx-auto text-success" />
            <h1 className="font-display text-xl font-semibold text-ink">Verified Certificate</h1>
            <p className="text-ink-2">
              <span className="font-medium text-ink">{cert.name}</span> completed a{" "}
              {SOURCE_LABELS[cert.sourceType] || cert.sourceType} on Pravaah
            </p>
            <Badge tone="teal">Score: {cert.score}/100</Badge>
            <p className="text-xs text-ink-4">
              Issued on {new Date(cert.issuedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </>
        )}
      </Card>
    </div>
  );
}
