import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Play, Send, ArrowLeft } from "lucide-react";
import Button from "../components/common/Button";
import Timer from "../components/interview/Timer";
import LanguageSelector from "../components/coding/LanguageSelector";
import CodeEditor from "../components/coding/CodeEditor";
import ConsoleOutput from "../components/coding/ConsoleOutput";
import PageLoader from "../components/common/PageLoader";
import interviewService from "../services/interview.service";
import codingService from "../services/coding.service";
import { STARTER_CODE } from "../constants";
import { getErrorMessage } from "../utils/formatters";

export default function CodingInterview() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const questionIndex = location.state?.questionIndex ?? 0;
  const isLastQuestion = location.state?.isLastQuestion ?? false;

  const [interview, setInterview] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(STARTER_CODE.javascript);
  const [output, setOutput] = useState("");
  const [testResults, setTestResults] = useState([]);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await interviewService.getById(id);
        setInterview(res.data.interview || res.data);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const question = interview?.questions?.[questionIndex];

  function handleLanguageChange(lang) {
    setLanguage(lang);
    setCode(STARTER_CODE[lang] || "");
  }

  async function handleRun() {
    setRunning(true);
    try {
      const testCases = (question?.testCases || []).map((tc) => ({ input: tc.input, expectedOutput: tc.expectedOutput }));
      const res = await codingService.runCode({ language, code, testCases });
      const data = res.data || {};
      const results = data.testCaseResults || [];
      let text = "";
      if (data.status === "not_supported_locally" || data.status === "runtime_error") {
        text = data.message || "This language cannot be executed right now.";
      } else if (results.length) {
        const passed = results.filter((r) => r.passed).length;
        text = `${passed}/${results.length} test cases passed`;
      } else if (data.output !== undefined && data.output !== null && data.output !== "") {
        text = String(data.output);
      } else {
        text = "No output produced.";
      }
      setOutput(text);
      setTestResults(results);
    } catch (err) {
      setOutput(getErrorMessage(err));
    } finally {
      setRunning(false);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await interviewService.submitAnswer(id, { questionId: question._id, answerText: code, generateFollowUp: false });
      if (isLastQuestion) {
        try {
          await interviewService.end(id);
          toast.success("Interview submitted for evaluation.");
        } catch (endErr) {
          if (endErr?.response?.status !== 409) throw endErr;
          toast.info("Evaluation already in progress — taking you to the result.");
        }
        navigate(`/interview/${id}/result`, { replace: true });
      } else {
        toast.success("Code submitted.");
        navigate(`/interview/${id}/room`, { state: { resumeIndex: questionIndex + 1 } });
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <PageLoader label="Loading coding round" />;

  return (
    <div className="min-h-dvh bg-canvas flex flex-col">
      <header className="h-16 glass border-b border-line/70 flex items-center justify-between gap-3 px-3 sm:px-6">
        <button
          onClick={() => navigate(`/interview/${id}/room`, { state: { resumeIndex: questionIndex } })}
          className="flex items-center gap-1.5 text-sm text-ink-3 hover:text-ink py-2"
        >
          <ArrowLeft size={16} /> <span className="hidden sm:inline">Back to interview</span><span className="sm:hidden">Back</span>
        </button>
        <Timer />
      </header>

      <main className="flex-1 grid lg:grid-cols-2 gap-0">
        <div className="p-5 sm:p-8 border-b lg:border-b-0 lg:border-r border-line/70 overflow-y-auto max-h-[40dvh] lg:max-h-none">
          <h2 className="font-display text-lg font-semibold text-ink mb-4">{question?.topic || "Coding challenge"}</h2>
          <p className="text-sm text-ink-2 leading-relaxed whitespace-pre-line">{question?.text}</p>
        </div>

        <div className="p-4 sm:p-6 flex flex-col gap-4 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <LanguageSelector value={language} onChange={handleLanguageChange} />
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" icon={<Play size={14} />} isLoading={running} onClick={handleRun}>
                Run
              </Button>
              <Button size="sm" icon={<Send size={14} />} isLoading={submitting} onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </div>
          <CodeEditor language={language} value={code} onChange={setCode} height="min(45dvh, 480px)" />
          <ConsoleOutput output={output} testResults={testResults} />
        </div>
      </main>
    </div>
  );
}
