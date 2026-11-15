import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Eye } from "lucide-react";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import { SkeletonTable } from "../components/common/Skeleton";
import interviewService from "../services/interview.service";
import { formatDate, getErrorMessage } from "../utils/formatters";

export default function InterviewHistory() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await interviewService.getMine({});
        setInterviews(res.data.interviews || res.data || []);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <SkeletonTable rows={6} cols={4} />;

  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-semibold text-ink">Interview history</h2>
      {!interviews.length ? (
        <Card className="p-10 text-center text-ink-4">No interviews yet.</Card>
      ) : (
        <div className="grid gap-4">
          {interviews.map((iv) => (
            <Card key={iv._id} className="p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium text-ink">{iv.targetRole || "Mock interview"}</p>
                <p className="text-xs text-ink-4">
                  {formatDate(iv.createdAt)} &middot; {iv.type}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge tone={iv.status === "completed" ? "teal" : "amber"}>{iv.status.replace("_", " ")}</Badge>
                {iv.result?.overallScore != null && (
                  <span className="font-mono text-sm text-ink-2">{iv.result.overallScore}/100</span>
                )}
                {iv.status === "completed" && (
                  <Link to={`/interview/${iv._id}/report`} className="text-accent-hi hover:text-accent-hi">
                    <Eye size={17} />
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
