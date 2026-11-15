import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Mic, Video, Timer, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { INTERVIEW_TYPES, TARGET_ROLE_GROUPS } from "../constants";
import interviewService from "../services/interview.service";
import { getErrorMessage } from "../utils/formatters";

const OTHER_ROLE_VALUE = "Other (type your own)";

const LEVELS = [
  { value: "basic", label: "Basic", description: "Foundational, single-step questions. Great for a first pass.", pro: false },
  { value: "medium", label: "Medium", description: "A realistic day-to-day interview mix.", pro: false },
  { value: "hard", label: "Hard", description: "Multi-part, trade-off heavy questions.", pro: true },
  { value: "expert", label: "Expert", description: "Senior/staff-level bar — dense, ambiguous, deeply probing.", pro: true },
];

const CHECKLIST = [
  { icon: Mic, text: "Microphone access will be requested for voice answers." },
  { icon: Video, text: "Camera preview is optional and only visible to you." },
  { icon: Timer, text: "Each question is timed — the clock keeps running once you start." },
  { icon: ShieldCheck, text: "You can end the interview early, but unanswered questions score zero." },
];

export default function InterviewInstructions() {
  const navigate = useNavigate();
  const [type, setType] = useState("mixed");
  const [selectedRole, setSelectedRole] = useState("Software Engineer");
  const [customRole, setCustomRole] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [level, setLevel] = useState("medium");
  const [creating, setCreating] = useState(false);

  const isCustomRole = selectedRole === OTHER_ROLE_VALUE;
  const targetRole = isCustomRole ? customRole.trim() : selectedRole;

  async function handleStart() {
    if (isCustomRole && !targetRole) {
      toast.error("Please type your target role.");
      return;
    }
    setCreating(true);
    try {
      const res = await interviewService.create({ type, targetRole, numberOfQuestions, level });
      const interview = res.data.interview;
      await interviewService.start(interview._id);
      navigate(`/interview/${interview._id}/room`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-ink mb-1.5">Before you begin</h2>
        <p className="text-sm text-ink-4">Set up your mock interview and review what to expect.</p>
      </div>

      <Card className="p-6">
        <label className="block text-sm font-medium text-ink-2 mb-3">Target role</label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full bg-surface border border-line rounded-lg px-4 py-2.5 text-sm text-ink outline-none focus:border-accent mb-3"
        >
          {TARGET_ROLE_GROUPS.map((g) => (
            <optgroup key={g.group} label={g.group}>
              {g.roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {isCustomRole && (
          <input
            autoFocus
            value={customRole}
            onChange={(e) => setCustomRole(e.target.value)}
            placeholder="Type your target role, e.g. SSC CPO, Bank PO, Software Engineer..."
            className="w-full bg-surface border border-line rounded-lg px-4 py-2.5 text-sm text-ink outline-none focus:border-accent mb-3"
          />
        )}
        <label className="block text-sm font-medium text-ink-2 mb-3 mt-3">Interview format</label>
        <div className="grid sm:grid-cols-2 gap-3">
          {INTERVIEW_TYPES.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setType(opt.value)}
              className={`text-left p-4 rounded-xl border transition ${type === opt.value ? "border-accent bg-accent/10" : "border-line hover:border-line/80"}`}
            >
              <p className="text-sm font-medium text-ink mb-1">{opt.label}</p>
              <p className="text-xs text-ink-4">{opt.description}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <label className="block text-sm font-medium text-ink-2 mb-3">Difficulty level</label>
        <div className="grid sm:grid-cols-2 gap-3">
          {LEVELS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setLevel(opt.value)}
              className={`text-left p-4 rounded-xl border transition ${level === opt.value ? "border-accent bg-accent/10" : "border-line hover:border-line/80"}`}
            >
              <p className="text-sm font-medium text-ink mb-1 flex items-center gap-1.5">
                {opt.label}
                {opt.pro && (
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-accent-hi bg-accent/10 px-1.5 py-0.5 rounded">
                    <Sparkles size={10} /> Pro
                  </span>
                )}
              </p>
              <p className="text-xs text-ink-4">{opt.description}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-ink-2">Number of questions</label>
          <span className="font-mono text-sm text-accent-hi">{numberOfQuestions}</span>
        </div>
        <input
          type="range"
          min={3}
          max={15}
          value={numberOfQuestions}
          onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
          className="w-full accent-violet-500"
        />
        <div className="flex justify-between text-xs text-ink-4 mt-1">
          <span>3 (quick)</span>
          <span>15 (thorough)</span>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-semibold text-ink mb-4">What to expect</h3>
        <div className="space-y-3">
          {CHECKLIST.map((c) => (
            <div key={c.text} className="flex items-start gap-3 text-sm text-ink-3">
              <c.icon size={16} className="text-success mt-0.5 shrink-0" /> {c.text}
            </div>
          ))}
        </div>
      </Card>

      <Button
        size="lg"
        className="w-full"
        isLoading={creating}
        icon={<ArrowRight size={16} />}
        iconPosition="right"
        onClick={handleStart}
      >
        Start interview
      </Button>
    </div>
  );
}
