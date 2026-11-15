import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Gauge, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import Card from "../common/Card";
import Badge from "../common/Badge";
import resumeService from "../../services/resume.service";
import { getErrorMessage } from "../../utils/formatters";

const BREAKDOWN_LABELS = {
  keywordMatch: "Keyword match",
  formatting: "ATS formatting",
  sectionCompleteness: "Section completeness",
  actionVerbs: "Action verbs",
};

function scoreTone(score) {
  if (score >= 75) return "teal";
  if (score >= 50) return "amber";
  return "coral";
}

/** Score + breakdown are always shown (the free hook, per the build spec); line-by-line
 * suggestions are blurred behind an upgrade CTA when `locked` comes back true from the
 * backend - see resume.service.getAts, which strips them server-side for non-entitled users. */
export default function AtsScoreGauge({ resumeId }) {
  const [ats, setAts] = useState(null);

  // BACKEND HOOK: GET resume ATS score via resumeService.getAts(resumeId); `locked` is decided server-side.
  useEffect(() => {
    if (!resumeId) return;
    resumeService
      .getAts(resumeId)
      .then((res) => setAts(res.data))
      .catch((err) => toast.error(getErrorMessage(err)));
  }, [resumeId]);

  if (!ats || ats.atsScore == null) return null;

  return (
    <Card className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-ink-3 text-xs">
          <Gauge size={14} /> ATS Score
        </div>
        <Badge tone={scoreTone(ats.atsScore)}>{ats.atsScore}/100</Badge>
      </div>

      <div className="space-y-3">
        {Object.entries(ats.atsBreakdown || {}).map(([key, value]) => (
          <div key={key}>
            <div className="flex items-center justify-between text-xs text-ink-3 mb-1">
              <span>{BREAKDOWN_LABELS[key] || key}</span>
              <span>{value}/100</span>
            </div>
            <div className="h-1.5 rounded-full bg-line overflow-hidden">
              <div className="h-full bg-pulse-gradient" style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-line">
        <div className="flex items-center gap-2 text-ink-3 text-xs mb-3">
          <Sparkles size={14} /> Line-by-line fixes
        </div>
        {ats.locked ? (
          <div className="relative">
            <ul className="space-y-2 blur-sm select-none pointer-events-none">
              {[
                "Strengthen your bullet points with measurable outcomes.",
                "Add missing keywords for your target role.",
                "Fix inconsistent section formatting.",
              ].map((s, i) => (
                <li key={i} className="text-sm text-ink-3">
                  • {s}
                </li>
              ))}
            </ul>
            <div className="absolute inset-0 flex items-center justify-center">
              <Link
                to="/onboarding"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-action text-white shadow-glow hover:opacity-90 transition-all"
              >
                <Lock size={14} /> Unlock full report
              </Link>
            </div>
          </div>
        ) : (
          <ul className="space-y-2">
            {(ats.atsSuggestions || []).map((s, i) => (
              <li key={i} className="text-sm text-ink-2">
                • {s}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
