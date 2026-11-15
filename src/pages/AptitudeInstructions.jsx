import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Brain, Timer, ListChecks, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { TARGET_ROLE_GROUPS } from "../constants";
import aptitudeService from "../services/aptitude.service";
import { getErrorMessage } from "../utils/formatters";

const OTHER_ROLE_VALUE = "Other (type your own)";

const DIFFICULTIES = [
  { value: "basic", label: "Basic" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "expert", label: "Expert" },
];

// The full 40-question exam is split into two 20-question parts so each "create test" request
// only needs one AI generation call in the worst case (see backend constants/aptitude.js) -
// this keeps aptitude test creation fast and reliable instead of timing out.
const PARTS = [
  { value: 1, label: "Part 1", desc: "20 Q — Quantitative + Logical Reasoning" },
  { value: 2, label: "Part 2", desc: "20 Q — Verbal + Data Interpretation + Domain" },
];

const CHECKLIST = [
  { icon: ListChecks, text: "20 MCQs per part — take Part 1 now, Part 2 whenever you're ready." },
  { icon: Timer, text: "35 seconds per question — it auto-advances when time runs out." },
  { icon: Sparkles, text: "Questions are matched to your target role's category automatically." },
];

export default function AptitudeInstructions() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPart = searchParams.get("part") === "2" ? 2 : 1;
  const prefillRole = searchParams.get("targetRole");

  const [selectedRole, setSelectedRole] = useState(prefillRole || "Software Engineer");
  const [customRole, setCustomRole] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [part, setPart] = useState(initialPart);
  const [creating, setCreating] = useState(false);
  const [proctored, setProctored] = useState(false);

  const isCustomRole = selectedRole === OTHER_ROLE_VALUE;
  const targetRole = isCustomRole ? customRole.trim() : selectedRole;

  async function handleStart() {
    if (isCustomRole && !targetRole) {
      toast.error("Please type your target role.");
      return;
    }
    setCreating(true);
    try {
      const res = await aptitudeService.createTest({ targetRole, difficulty, part, proctored });
      const test = res.data.test;
      navigate(`/aptitude/${test._id}`, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-pulse-gradient flex items-center justify-center shrink-0">
          <Brain size={20} className="text-white" />
        </span>
        <div>
          <h2 className="font-display text-xl font-semibold text-ink mb-1">Aptitude test</h2>
          <p className="text-sm text-ink-4">A timed, role-matched assessment — just like a real placement test.</p>
        </div>
      </div>

      <Card className="p-6">
        <label className="block text-sm font-medium text-ink-2 mb-3">Part</label>
        <div className="grid grid-cols-2 gap-2 mb-1">
          {PARTS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPart(p.value)}
              className={`text-left px-4 py-2.5 rounded-lg text-sm border transition ${part === p.value ? "border-accent bg-accent/10 text-ink" : "border-line text-ink-3 hover:border-line/80"}`}
            >
              <span className="block font-medium">{p.label}</span>
              <span className="block text-xs text-ink-4 mt-0.5">{p.desc}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <label className="block text-sm font-medium text-ink-2 mb-3">Target role / exam</label>
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
            placeholder="Type your target role, e.g. Junior Accounts Officer, KYC Analyst..."
            className="w-full bg-surface border border-line rounded-lg px-4 py-2.5 text-sm text-ink outline-none focus:border-accent mb-3"
          />
        )}

        <label className="block text-sm font-medium text-ink-2 mb-3 mt-3">Difficulty</label>
        <div className="grid grid-cols-4 gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.value}
              onClick={() => setDifficulty(d.value)}
              className={`py-2.5 rounded-lg text-sm border transition ${difficulty === d.value ? "border-accent bg-accent/10 text-ink" : "border-line text-ink-3 hover:border-line/80"}`}
            >
              {d.label}
            </button>
          ))}
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

      <Card className="p-6">
        <div className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={17} className="text-accent-hi shrink-0" />
            <div>
              <p className="text-sm font-medium text-ink">Proctored Mode</p>
              <p className="text-xs text-ink-4">
                Simulate a real placement drive — webcam presence + tab-switch monitoring. Pro plan add-on.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setProctored((p) => !p)}
            className={`shrink-0 w-11 h-6 rounded-full transition-colors relative ${proctored ? "bg-pulse-gradient" : "bg-line"}`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${proctored ? "translate-x-5" : "translate-x-0.5"}`}
            />
          </button>
        </div>
        {proctored && (
          <p className="text-xs text-warn bg-warn/10 border border-warn/30 rounded-lg px-3 py-2 mt-3">
            By starting this test, you consent to webcam access and tab-switch/fullscreen monitoring for the duration of the
            session. This requires an active plan with the Proctored Mode add-on.
          </p>
        )}
      </Card>

      <Button
        size="lg"
        className="w-full"
        isLoading={creating}
        icon={<ArrowRight size={16} />}
        iconPosition="right"
        onClick={handleStart}
      >
        Start Part {part}
      </Button>
    </div>
  );
}
