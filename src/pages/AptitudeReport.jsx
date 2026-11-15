import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ThumbsUp,
  ThumbsDown,
  Trophy,
  Clock,
  Target,
  RotateCcw,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Dumbbell,
} from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import PageLoader from "../components/common/PageLoader";
import CertificateCard from "../components/certificate/CertificateCard";
import aptitudeService from "../services/aptitude.service";
import drillService from "../services/drill.service";
import { getErrorMessage } from "../utils/formatters";

const TOPIC_LABELS = {
  quantitative: "Quantitative",
  logical_reasoning: "Logical Reasoning",
  verbal_ability: "Verbal Ability",
  data_interpretation: "Data Interpretation",
  general_awareness: "General Awareness",
  domain_specific: "Domain Awareness",
};

function StatTile({ icon: Icon, label, value }) {
  return (
    <Card className="p-5 flex items-center gap-3">
      <span className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
        <Icon size={16} className="text-accent-hi" />
      </span>
      <div>
        <p className="text-lg font-semibold text-ink leading-none">{value}</p>
        <p className="text-xs text-ink-4 mt-1">{label}</p>
      </div>
    </Card>
  );
}

export default function AptitudeReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingDrill, setGeneratingDrill] = useState(false);

  useEffect(() => {
    aptitudeService
      .getReport(id)
      .then((res) => setReport(res.data.report))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader label="Building your aptitude report" />;
  if (!report) return <Card className="p-10 text-center max-w-lg mx-auto">Report not available.</Card>;

  async function handlePracticeWeakAreas() {
    setGeneratingDrill(true);
    try {
      const res = await drillService.generate(report._id);
      navigate(`/drills/${res.data.drill._id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setGeneratingDrill(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="font-display text-xl font-semibold text-ink">
          Aptitude report{report.part ? ` — Part ${report.part} / ${report.totalParts || 2}` : ""}
        </h2>
        <div className="flex items-center gap-2">
          {report.part === 1 && (
            <Button
              size="sm"
              icon={<ArrowRight size={14} />}
              iconPosition="right"
              onClick={() =>
                navigate(`/aptitude?part=2${report.targetRole ? `&targetRole=${encodeURIComponent(report.targetRole)}` : ""}`)
              }
            >
              Start Part 2
            </Button>
          )}
          <Button variant="secondary" size="sm" icon={<RotateCcw size={14} />} onClick={() => navigate("/aptitude")}>
            Take another test
          </Button>
        </div>
      </div>

      {report.percentage >= 40 && <CertificateCard sourceType="aptitude" sourceId={report._id} score={report.percentage} />}

      {report.proctored && (
        <Card className="p-6 flex items-center gap-3">
          {report.integrityScore >= 80 ? (
            <ShieldCheck size={20} className="text-success shrink-0" />
          ) : (
            <ShieldAlert size={20} className="text-warn shrink-0" />
          )}
          <div>
            <p className="font-medium text-ink">Proctored session · Integrity score: {report.integrityScore ?? "—"}/100</p>
            <p className="text-sm text-ink-4">
              {report.flaggedEventsCount > 0
                ? `${report.flaggedEventsCount} flagged event${report.flaggedEventsCount === 1 ? "" : "s"} during this session.`
                : "No integrity flags during this session."}
            </p>
          </div>
        </Card>
      )}

      <div className="grid sm:grid-cols-4 gap-4">
        <StatTile icon={Trophy} label="Score" value={`${report.score}/${report.totalMarks}`} />
        <StatTile icon={Target} label="Accuracy" value={`${report.accuracy}%`} />
        <StatTile icon={Clock} label="Avg time / question" value={`${report.avgTimePerQuestion}s`} />
        <StatTile
          icon={Trophy}
          label="Percentile"
          value={report.percentileVsLeaderboard != null ? `${report.percentileVsLeaderboard}th` : "—"}
        />
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display font-semibold text-ink">Overall score</h3>
          <span className="text-2xl font-semibold text-ink">{report.percentage}%</span>
        </div>
        <div className="h-2 rounded-full bg-line overflow-hidden">
          <div className="h-full bg-pulse-gradient transition-all" style={{ width: `${report.percentage}%` }} />
        </div>
        {report.summary && <p className="text-sm text-ink-3 leading-relaxed mt-4">{report.summary}</p>}
      </Card>

      <Card className="p-6">
        <h3 className="font-display font-semibold text-ink mb-4">Topic-wise breakdown</h3>
        <div className="space-y-3">
          {report.topicWiseBreakdown.map((t) => {
            const pct = t.attempted > 0 ? Math.round((t.correct / t.attempted) * 100) : 0;
            return (
              <div key={t.topic}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-ink-2">{TOPIC_LABELS[t.topic] || t.topic}</span>
                  <span className="text-ink-4">
                    {t.correct}/{t.attempted} correct · avg {t.avgTimeSec}s
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-line overflow-hidden">
                  <div
                    className={`h-full ${pct >= 70 ? "bg-success" : pct >= 40 ? "bg-warn" : "bg-danger"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6 flex flex-col sm:flex-row items-center gap-4 sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
            <Dumbbell size={18} className="text-accent-hi" />
          </span>
          <div>
            <p className="font-medium text-ink">Practice your weak areas</p>
            <p className="text-sm text-ink-4">A focused, 10-question drill built from your weakest topics above.</p>
          </div>
        </div>
        <Button size="sm" isLoading={generatingDrill} onClick={handlePracticeWeakAreas}>
          Start drill
        </Button>
      </Card>

      <div className="grid sm:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-3 text-success">
            <ThumbsUp size={16} />
            <h3 className="font-display font-semibold text-ink">Strengths</h3>
          </div>
          <ul className="space-y-2 text-sm text-ink-3 list-disc list-inside">
            {(report.strengths || []).length > 0 ? (
              report.strengths.map((s, i) => <li key={i}>{s}</li>)
            ) : (
              <li>Not enough data yet.</li>
            )}
          </ul>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-3 text-danger">
            <ThumbsDown size={16} />
            <h3 className="font-display font-semibold text-ink">Weak areas</h3>
          </div>
          <ul className="space-y-2 text-sm text-ink-3 list-disc list-inside">
            {(report.weakAreas || []).length > 0 ? (
              report.weakAreas.map((s, i) => <li key={i}>{s}</li>)
            ) : (
              <li>Not enough data yet.</li>
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}
