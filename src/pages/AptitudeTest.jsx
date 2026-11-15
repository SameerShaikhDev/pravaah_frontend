import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Clock, ChevronRight, Flag, ShieldCheck } from "lucide-react";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import QuizFooter from "../components/common/QuizFooter";
import PageLoader from "../components/common/PageLoader";
import aptitudeService from "../services/aptitude.service";
import useWebcam from "../utils/useWebcam";
import useProctoring from "../utils/useProctoring";
import { getErrorMessage } from "../utils/formatters";

const TOPIC_LABELS = {
  quantitative: "Quantitative",
  logical_reasoning: "Logical Reasoning",
  verbal_ability: "Verbal Ability",
  data_interpretation: "Data Interpretation",
  general_awareness: "General Awareness",
  domain_specific: "Domain Awareness",
};

export default function AptitudeTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState({}); // order -> selectedOptionIndex, local UI state
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(35);
  const questionStartRef = useRef(Date.now());
  const submittingRef = useRef(false);

  useEffect(() => {
    aptitudeService
      .getTest(id)
      .then((res) => {
        const fetched = res.data.test;
        if (fetched.status === "completed") {
          navigate(`/aptitude/${id}/report`, { replace: true });
          return;
        }
        if (fetched.status === "expired") {
          toast.error("This test's time is up.");
          navigate("/aptitude", { replace: true });
          return;
        }
        setTest(fetched);
      })
      .catch((err) => {
        toast.error(getErrorMessage(err));
        navigate("/aptitude");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const questions = test?.questions || [];
  const current = questions[index];
  const totalTime = current?.question?.timeLimitSec || 35;

  const { videoRef } = useWebcam({ enabled: Boolean(test?.proctored) });
  useProctoring({ testId: id, enabled: Boolean(test?.proctored) });

  const goToNext = useCallback(
    async ({ auto = false } = {}) => {
      if (submittingRef.current || !current) return;
      submittingRef.current = true;
      const timeTakenSec = Math.min(totalTime, Math.round((Date.now() - questionStartRef.current) / 1000));
      try {
        await aptitudeService.answer(id, {
          questionOrder: current.order,
          selectedOptionIndex: selected[current.order] ?? null,
          timeTakenSec,
        });
      } catch (err) {
        if (!auto) toast.error(getErrorMessage(err));
      }

      if (index + 1 < questions.length) {
        setIndex((i) => i + 1);
        questionStartRef.current = Date.now();
        setSecondsLeft(questions[index + 1]?.question?.timeLimitSec || 35);
        submittingRef.current = false;
      } else {
        await finishTest();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current, index, questions, selected, id, totalTime],
  );

  // Per-question countdown - auto-advances (recording a skip if unanswered) at zero, exactly
  // like a real campus-placement timed assessment.
  useEffect(() => {
    if (!current) return;
    setSecondsLeft(current.question?.timeLimitSec || 35);
    const tick = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(tick);
          goToNext({ auto: true });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  async function finishTest() {
    setSubmitting(true);
    try {
      await aptitudeService.submit(id);
      navigate(`/aptitude/${id}/report`, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
      submittingRef.current = false;
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <PageLoader label="Loading your aptitude test" />;
  if (!current) return null;

  const answeredCount = Object.keys(selected).length;
  const isLast = index === questions.length - 1;
  const urgentTime = secondsLeft <= 10;

  return (
    <div className="min-h-dvh bg-canvas flex flex-col">
      <header className="h-16 glass border-b border-line/70 flex items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          {test?.part && (
            <span className="hidden sm:inline text-xs font-medium px-2 py-1 rounded-md bg-accent/10 text-accent-hi">
              Part {test.part} / {test.totalParts || 2}
            </span>
          )}
          <span className="text-sm text-ink-3 font-mono">
            Question {index + 1} / {questions.length}
          </span>
          <div className="h-1.5 w-40 rounded-full bg-line overflow-hidden hidden sm:block">
            <div
              className="h-full bg-pulse-gradient transition-all"
              style={{ width: `${((index + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        <div
          className={`flex items-center gap-1.5 text-sm font-mono px-3 py-1.5 rounded-lg ${urgentTime ? "bg-danger/15 text-danger" : "glass text-ink-2"}`}
        >
          <Clock size={14} /> 0:{String(secondsLeft).padStart(2, "0")}
        </div>
      </header>

      {test?.proctored && (
        <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 flex items-center gap-2 glass border border-line rounded-lg p-1.5 sm:px-3 sm:py-2 shadow-glass">
          <video ref={videoRef} autoPlay muted playsInline className="w-16 h-12 rounded-md object-cover bg-black" />
          <Badge tone="violet" className="hidden sm:inline-flex">
            <ShieldCheck size={11} className="mr-1" />
            Proctored
          </Badge>
        </div>
      )}

      <main className={`flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 ${test?.proctored ? "pb-24 sm:pb-10" : ""}`}>
        <div className="glass-strong rounded-xl2 p-5 sm:p-8 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Badge tone="violet">{TOPIC_LABELS[current.question?.topic] || current.question?.topic}</Badge>
            <Badge
              tone={
                ["hard", "expert"].includes(current.question?.difficulty)
                  ? "coral"
                  : current.question?.difficulty === "medium"
                    ? "amber"
                    : "teal"
              }
            >
              {current.question?.difficulty}
            </Badge>
          </div>
          <p className="text-base sm:text-lg text-ink leading-relaxed mb-6">{current.question?.text}</p>

          <div className="space-y-2.5">
            {(current.question?.options || []).map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelected((s) => ({ ...s, [current.order]: i }))}
                className={`w-full text-left px-4 py-3.5 sm:py-3 rounded-lg border text-sm transition-colors ${
                  selected[current.order] === i ? "border-accent bg-accent/10 text-ink" : "border-line text-ink-2 hover:bg-ink/5"
                }`}
              >
                <span className="text-ink-4 mr-2">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            ))}
          </div>
        </div>

        <QuizFooter
          index={index}
          onPrev={() => setIndex((i) => Math.max(0, i - 1))}
          answeredCount={answeredCount}
          total={questions.length}
        >
          <Button
            icon={isLast ? <Flag size={16} /> : <ChevronRight size={16} />}
            iconPosition="right"
            isLoading={submitting}
            onClick={() => goToNext()}
          >
            {isLast ? "Finish test" : "Next"}
          </Button>
        </QuizFooter>
      </main>
    </div>
  );
}
