import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight, Award } from "lucide-react";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import ScoreRadarChart from "../components/charts/ScoreRadarChart";
import SkillBar from "../components/charts/SkillBar";
import PageLoader from "../components/common/PageLoader";
import CertificateCard from "../components/certificate/CertificateCard";
import interviewService from "../services/interview.service";
import { verdictLabel, getErrorMessage } from "../utils/formatters";

function scoreColorClass(score = 0) {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-warn";
  return "text-danger";
}

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 120000; // give up after 2 minutes

export default function Result() {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [failureInfo, setFailureInfo] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let timeoutId;
    const startedAt = Date.now();

    async function poll() {
      try {
        const res = await interviewService.getReportStatus(id);
        const data = res.data || res;
        if (cancelled) return;

        setStatus(data.status);

        if (data.status === "completed") {
          setResult(data.result);
          setLoading(false);
          return;
        }

        if (data.status === "failed") {
          setFailureInfo({ stage: data.failedStage, reason: data.failureReason });
          toast.error("Report generation failed. Please try again.");
          setLoading(false);
          return;
        }

        if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
          toast.error("Report is taking longer than expected. Please refresh in a bit.");
          setLoading(false);
          return;
        }

        timeoutId = setTimeout(poll, POLL_INTERVAL_MS);
      } catch (err) {
        if (cancelled) return;
        toast.error(getErrorMessage(err));
        setLoading(false);
      }
    }

    async function loadInterview() {
      try {
        const res = await interviewService.getById(id);
        if (!cancelled) setInterview(res.data.interview || res.data);
      } catch (err) {
        // non-fatal, polling still handles the result
      }
    }

    loadInterview();
    poll();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [id]);

  if (loading) {
    const label =
      status === "processing" || status === "in_progress"
        ? "Generating your report — this can take a moment"
        : "Fetching your result";
    return <PageLoader label={label} />;
  }
  if (!result) {
    return (
      <Card className="p-10 text-center max-w-lg mx-auto space-y-4">
        <p>Result not available yet.</p>
        <p className="text-sm text-ink-4">
          {status === "failed" ? "Report generation failed." : "This can happen if generation is taking unusually long."}
        </p>
        {status === "failed" && failureInfo?.reason && (
          <p className="text-xs text-ink-4 font-mono break-words">
            {failureInfo.stage ? `[${failureInfo.stage}] ` : ""}
            {failureInfo.reason}
          </p>
        )}
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-action text-white text-sm font-medium"
        >
          Try again
        </button>
      </Card>
    );
  }

  // skillBreakdown scores are stored 0-10 (see Result model), but
  // ScoreRadarChart/SkillBar both render on a 0-100 scale (domain, "/100"
  // label, and the >=75/>=50 color thresholds). Scale here at the display
  // boundary so an 8/10 answer doesn't render as a near-empty red bar.
  const radarData = (result.skillBreakdown || []).map((s) => ({ skill: s.skill, score: s.score * 10 }));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-pulse-gradient flex items-center justify-center mx-auto mb-4">
          <Award size={28} className="text-white" />
        </div>
        <p className="text-sm text-ink-4 mb-1">Overall score</p>
        <p className="font-display text-5xl font-semibold text-ink mb-3">
          {result.overallScore}
          <span className="text-xl text-ink-4">/100</span>
        </p>
        <Badge tone={result.verdict === "no_hire" ? "coral" : result.verdict === "borderline" ? "amber" : "teal"}>
          {verdictLabel(result.verdict)}
        </Badge>
      </div>

      {result.verdict !== "no_hire" && <CertificateCard sourceType="interview" sourceId={id} score={result.overallScore} />}

      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: "Technical", value: result.technicalScore },
          { label: "Communication", value: result.communicationScore },
          { label: "Problem solving", value: result.problemSolvingScore },
          { label: "Confidence", value: result.confidenceScore },
        ].map((m) => (
          <Card key={m.label} className="p-5 text-center">
            <p className="text-xs text-ink-4 mb-1">{m.label}</p>
            {/* These sub-scores are 0-10 (see Result model), not 0-100 —
                pass the scaled value into scoreColorClass so an 8 or 9
                doesn't get flagged red by the 0-100 thresholds. */}
            <p className={`font-display text-2xl font-semibold ${scoreColorClass(m.value * 10)}`}>
              {m.value}
              <span className="text-sm text-ink-4">/10</span>
            </p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-display font-semibold text-ink mb-4">Skill breakdown</h3>
          {radarData.length ? <ScoreRadarChart data={radarData} /> : <p className="text-sm text-ink-4">Not enough data.</p>}
        </Card>
        <Card className="p-6 space-y-4">
          <h3 className="font-display font-semibold text-ink mb-1">Per-skill scores</h3>
          {(result.skillBreakdown || []).map((s) => (
            <SkillBar key={s.skill} label={s.skill} score={s.score * 10} />
          ))}
        </Card>
      </div>

      <Link to={`/interview/${id}/report`}>
        <Card hover className="p-6 flex items-center justify-between">
          <div>
            <p className="font-medium text-ink">View the detailed report</p>
            <p className="text-sm text-ink-4">Strengths, weaknesses, and a step-by-step improvement plan.</p>
          </div>
          <ArrowRight className="text-accent-hi" size={20} />
        </Card>
      </Link>
    </div>
  );
}
