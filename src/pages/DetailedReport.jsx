import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Download, ThumbsUp, ThumbsDown, ListChecks } from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import PageLoader from "../components/common/PageLoader";
import interviewService from "../services/interview.service";
import { getErrorMessage } from "../utils/formatters";

export default function DetailedReport() {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [report, setReport] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // GET /interviews/:id returns result/report as un-populated ids, so the real report and result
  // documents come from GET /interviews/:id/report-status (status === "completed").
  useEffect(() => {
    async function load() {
      try {
        const [ivRes, statusRes] = await Promise.allSettled([
          interviewService.getById(id),
          interviewService.getReportStatus(id),
        ]);
        if (ivRes.status === "fulfilled") setInterview(ivRes.value.data.interview || ivRes.value.data);
        if (statusRes.status === "fulfilled") {
          const data = statusRes.value.data || {};
          if (data.status === "completed") {
            setReport(data.report || null);
            setResult(data.result || null);
          }
        } else {
          toast.error(getErrorMessage(statusRes.reason));
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <PageLoader label="Building your report" />;
  if (!report) return <Card className="p-10 text-center max-w-lg">Report not available yet.</Card>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-ink">Detailed report</h2>
        <Button variant="secondary" size="sm" icon={<Download size={14} />} onClick={() => window.print()}>
          Download / Print
        </Button>
      </div>

      <Card className="p-6">
        <h3 className="font-display font-semibold text-ink mb-3">Summary</h3>
        <p className="text-sm text-ink-3 leading-relaxed">{report.summary}</p>
      </Card>

      <Card className="p-6">
        <h3 className="font-display font-semibold text-ink mb-3">Detailed feedback</h3>
        <p className="text-sm text-ink-3 leading-relaxed whitespace-pre-line">{report.detailedFeedback}</p>
      </Card>

      <div className="grid sm:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-3 text-success">
            <ThumbsUp size={16} />
            <h3 className="font-display font-semibold text-ink">Strengths</h3>
          </div>
          <ul className="space-y-2 text-sm text-ink-3 list-disc list-inside">
            {(result?.strengths || []).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-3 text-danger">
            <ThumbsDown size={16} />
            <h3 className="font-display font-semibold text-ink">Weaknesses</h3>
          </div>
          <ul className="space-y-2 text-sm text-ink-3 list-disc list-inside">
            {(result?.weaknesses || []).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4 text-accent-hi">
          <ListChecks size={16} />
          <h3 className="font-display font-semibold text-ink">Improvement plan</h3>
        </div>
        <ol className="space-y-3 text-sm text-ink-3">
          {(report.improvementPlan || []).map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-6 h-6 shrink-0 rounded-full bg-accent/15 text-accent-hi text-xs flex items-center justify-center font-mono">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </Card>

      {(report.questionWiseFeedback || []).length > 0 && (
        <Card className="p-6">
          <h3 className="font-display font-semibold text-ink mb-4">Question-wise feedback</h3>
          <div className="space-y-4">
            {report.questionWiseFeedback.map((fb, i) => (
              <div key={i} className="border-b border-line pb-4 last:border-0">
                <div className="flex justify-between text-xs text-ink-4 mb-1.5">
                  <span>Question {i + 1}</span>
                  <span className="font-mono">{fb.score}/10</span>
                </div>
                {(() => {
                  const q = (interview?.questions || []).find((x) => String(x._id) === String(fb.question));
                  return q?.text ? <p className="text-sm text-ink-2 mb-1.5">{q.text}</p> : null;
                })()}
                <p className="text-sm text-ink-3">{fb.feedback}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
