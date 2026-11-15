import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ChevronRight, Flag, Dumbbell } from "lucide-react";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import QuizFooter from "../components/common/QuizFooter";
import PageLoader from "../components/common/PageLoader";
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

/**
 * Self-paced weak-area practice quiz - deliberately no per-question countdown (unlike
 * AptitudeTest) since this is meant to be a low-pressure repeat-practice loop, not a timed
 * placement-drive simulation.
 */
export default function DrillSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drill, setDrill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    drillService
      .getById(id)
      .then((res) => {
        const fetched = res.data.drill;
        if (fetched.status === "completed") {
          const answers = {};
          fetched.questions.forEach((q) => {
            if (q.selectedOptionIndex != null) answers[q.order] = q.selectedOptionIndex;
          });
          setSelected(answers);
        }
        setDrill(fetched);
      })
      .catch((err) => {
        toast.error(getErrorMessage(err));
        navigate("/dashboard");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <PageLoader label="Loading your drill" />;
  if (!drill) return null;

  const questions = drill.questions || [];
  const current = questions[index];
  const isCompleted = drill.status === "completed";
  const isLast = index === questions.length - 1;
  const answeredCount = Object.keys(selected).length;

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const answers = questions.map((q) => ({
        questionOrder: q.order,
        selectedOptionIndex: selected[q.order] ?? null,
      }));
      const res = await drillService.submit(id, answers);
      setDrill(res.data.drill);
      toast.success(`Drill complete: ${res.data.drill.score}/${questions.length} correct`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (!current) return null;

  return (
    <div className="min-h-dvh bg-canvas flex flex-col">
      <header className="h-16 glass border-b border-line/70 flex items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs font-medium px-2 py-1 rounded-md bg-accent/10 text-accent-hi flex items-center gap-1.5">
            <Dumbbell size={12} /> Weak-area drill
          </span>
          <span className="text-sm text-ink-3 font-mono">
            Question {index + 1} / {questions.length}
          </span>
        </div>
        {isCompleted && (
          <Badge tone="teal">
            Score: {drill.score}/{questions.length}
          </Badge>
        )}
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="glass-strong rounded-xl2 p-5 sm:p-8 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Badge tone="violet">{TOPIC_LABELS[current.question?.topic] || current.question?.topic}</Badge>
            {isCompleted && (
              <Badge tone={current.isCorrect ? "teal" : "coral"}>{current.isCorrect ? "Correct" : "Incorrect"}</Badge>
            )}
          </div>
          <p className="text-base sm:text-lg text-ink leading-relaxed mb-6">{current.question?.text}</p>

          <div className="space-y-2.5">
            {(current.question?.options || []).map((opt, i) => {
              const isSelected = selected[current.order] === i;
              const isRightAnswer = isCompleted && current.question?.correctOptionIndex === i;
              return (
                <button
                  key={i}
                  disabled={isCompleted}
                  onClick={() => setSelected((s) => ({ ...s, [current.order]: i }))}
                  className={`w-full text-left px-4 py-3.5 sm:py-3 rounded-lg border text-sm transition-colors ${
                    isRightAnswer
                      ? "border-success bg-success/10 text-ink"
                      : isSelected
                        ? isCompleted
                          ? "border-danger bg-danger/10 text-ink"
                          : "border-accent bg-accent/10 text-ink"
                        : "border-line text-ink-2 hover:bg-ink/5 disabled:hover:bg-transparent"
                  }`}
                >
                  <span className="text-ink-4 mr-2">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <QuizFooter
          index={index}
          onPrev={() => setIndex((i) => Math.max(0, i - 1))}
          answeredCount={answeredCount}
          total={questions.length}
        >
          {isLast ? (
            isCompleted ? (
              <Button onClick={() => navigate("/dashboard")}>Back to dashboard</Button>
            ) : (
              <Button icon={<Flag size={16} />} iconPosition="right" isLoading={submitting} onClick={handleSubmit}>
                Submit drill
              </Button>
            )
          ) : (
            <Button
              icon={<ChevronRight size={16} />}
              iconPosition="right"
              onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
            >
              Next
            </Button>
          )}
        </QuizFooter>
      </main>
    </div>
  );
}
