import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Sparkles, Briefcase, GraduationCap, ArrowRight } from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import { SkeletonCard } from "../components/common/Skeleton";
import AtsScoreGauge from "../components/resume/AtsScoreGauge";
import resumeService from "../services/resume.service";
import { getErrorMessage } from "../utils/formatters";

export default function ResumeAnalysis() {
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await resumeService.getLatest();
        setResume(res.data.resume || res.data);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <SkeletonCard />;
  if (!resume) {
    return (
      <Card className="p-10 text-center max-w-lg">
        <p className="text-ink-3 mb-5">No resume uploaded yet.</p>
        <Button onClick={() => navigate("/resume")}>Upload a resume</Button>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-ink mb-1.5">Resume analysis</h2>
        <p className="text-sm text-ink-4">Here's what we extracted from your resume.</p>
      </div>

      <Card className="p-6 grid sm:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 text-ink-3 text-xs mb-2">
            <GraduationCap size={14} /> Experience level
          </div>
          <p className="text-ink font-medium">{resume.experienceLevel || "Not detected"}</p>
        </div>
        <div>
          <div className="flex items-center gap-2 text-ink-3 text-xs mb-2">
            <Briefcase size={14} /> Suggested target role
          </div>
          <p className="text-ink font-medium">{resume.targetRole || "Software Engineer"}</p>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 text-ink-3 text-xs mb-3">
          <Sparkles size={14} /> Detected skills
        </div>
        <div className="flex flex-wrap gap-2">
          {(resume.skills || []).length ? (
            resume.skills.map((s) => (
              <Badge key={s} tone="violet">
                {s}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-ink-4">No skills detected.</p>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <div className="text-ink-3 text-xs mb-3">Suggested interview topics</div>
        <div className="flex flex-wrap gap-2">
          {(resume.interviewTopics || []).map((t) => (
            <Badge key={t} tone="teal">
              {t}
            </Badge>
          ))}
        </div>
      </Card>

      <AtsScoreGauge resumeId={resume._id} />

      <div className="flex flex-wrap gap-3">
        <Button
          size="lg"
          icon={<ArrowRight size={16} />}
          iconPosition="right"
          onClick={() => navigate("/interview/new/instructions")}
        >
          Start a tailored mock interview
        </Button>
        <Button size="lg" variant="secondary" onClick={() => navigate("/resume/builder")}>
          Open resume builder
        </Button>
      </div>
    </div>
  );
}
