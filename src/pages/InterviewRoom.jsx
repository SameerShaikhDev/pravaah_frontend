import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Maximize, Minimize, ChevronLeft, ChevronRight, PhoneOff, Code2 } from "lucide-react";
import Button from "../components/common/Button";
import Timer from "../components/interview/Timer";
import ProgressBar from "../components/interview/ProgressBar";
import QuestionCard from "../components/interview/QuestionCard";
import VoiceRecorder from "../components/interview/VoiceRecorder";
import CameraPreview from "../components/interview/CameraPreview";
import PageLoader from "../components/common/PageLoader";
import AmbientBackground from "../components/visual/AmbientBackground";
import interviewService from "../services/interview.service";
import { getErrorMessage } from "../utils/formatters";

export default function InterviewRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [interview, setInterview] = useState(null);
  const [index, setIndex] = useState(location.state?.resumeIndex ?? 0);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const endInFlightRef = useRef(false);

  useEffect(() => {
    // BACKEND HOOK: GET /interviews/:id  (interviewService.getById) — loads the question set.
    async function load() {
      try {
        const res = await interviewService.getById(id);
        const fetched = res.data.interview || res.data;
        setInterview(fetched);

        // If the interview was already completed server-side (e.g. the
        // last question was answered via the coding round), don't show
        // stale questions again — jump straight to the result.
        if (fetched.status === "completed") {
          navigate(`/interview/${id}/result`, { replace: true });
          return;
        }
      } catch (err) {
        toast.error(getErrorMessage(err));
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function toggleFullscreen() {
    if (!fullscreen) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
    setFullscreen((f) => !f);
  }

  const questions = interview?.questions || [];
  const current = questions[index];
  const isLastQuestion = index === questions.length - 1;

  async function handleNext() {
    if (!current) return;

    if (current.type === "coding") {
      navigate(`/interview/${id}/coding`, {
        state: { questionIndex: index, isLastQuestion },
      });
      return;
    }

    setSubmitting(true);
    try {
      // BACKEND HOOK: POST /interviews/:id/answer  (interviewService.submitAnswer) — payload shape unchanged.
      await interviewService.submitAnswer(id, {
        questionId: current._id,
        answerText: answer || "No answer provided",
        generateFollowUp: false,
      });
      setAnswer("");
      if (!isLastQuestion) {
        setIndex((i) => i + 1);
      } else {
        await handleEnd();
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEnd() {
    if (endInFlightRef.current) return;
    endInFlightRef.current = true;
    setSubmitting(true);
    try {
      // BACKEND HOOK: POST /interviews/:id/end  (interviewService.end) — 409 handling preserved below.
      await interviewService.end(id);
      toast.success("Interview submitted for evaluation.");
      navigate(`/interview/${id}/result`, { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      if (status === 409) {
        // Another end request is already being processed (or the
        // interview was already completed) — just follow through to
        // the result page instead of showing a confusing error.
        toast.info("Evaluation already in progress — taking you to the result.");
        navigate(`/interview/${id}/result`, { replace: true });
      } else {
        toast.error(getErrorMessage(err));
      }
    } finally {
      setSubmitting(false);
      endInFlightRef.current = false;
    }
  }

  if (loading) return <PageLoader label="Preparing your interview room" />;

  return (
    <div className="relative min-h-dvh bg-canvas flex flex-col">
      <AmbientBackground />
      <header className="relative z-10 h-16 glass border-0 border-b border-line/70 flex items-center justify-between gap-3 sm:gap-6 px-3 sm:px-6">
        <div className="flex-1 min-w-0 max-w-md">
          <ProgressBar current={index + 1} total={questions.length || 1} />
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <Timer />
          <button
            onClick={toggleFullscreen}
            className="hidden sm:block p-2 rounded-xl text-ink-3 hover:text-ink hover:bg-ink/5 transition-colors"
            aria-label="Toggle fullscreen"
          >
            {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
          <Button variant="danger" size="sm" icon={<PhoneOff size={14} />} onClick={handleEnd} isLoading={submitting}>
            End
          </Button>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 grid lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <QuestionCard question={current} />

          {current?.type === "coding" ? (
            <div className="glass rounded-xl2 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-sm text-ink-3">This is a coding question — answer it in the dedicated editor.</p>
              <Button icon={<Code2 size={16} />} onClick={handleNext}>
                Open code editor
              </Button>
            </div>
          ) : (
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here, or use the microphone below..."
              rows={5}
              aria-label="Your answer"
              className="w-full glass rounded-xl2 p-5 text-[15px] leading-relaxed text-ink placeholder:text-ink-4 outline-none transition-[border-color,box-shadow] focus:border-accent focus:ring-4 focus:ring-accent/15 resize-none"
            />
          )}

          <div className="flex items-center justify-between gap-3">
            <Button
              variant="secondary"
              icon={<ChevronLeft size={16} />}
              disabled={index === 0}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
            >
              Previous
            </Button>
            <Button icon={<ChevronRight size={16} />} iconPosition="right" isLoading={submitting} onClick={handleNext}>
              {index === questions.length - 1 ? "Finish interview" : "Next question"}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <CameraPreview />
          {current?.type !== "coding" && (
            <div className="glass rounded-xl2 p-6">
              <VoiceRecorder onTranscript={setAnswer} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
