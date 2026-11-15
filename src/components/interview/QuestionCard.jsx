import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import Badge from "../common/Badge";
import useTextToSpeech from "../../utils/useTextToSpeech";

export default function QuestionCard({ question, autoSpeak = true }) {
  const { isSupported, speaking, speak, stop } = useTextToSpeech();

  useEffect(() => {
    if (autoSpeak && isSupported && question?.text) {
      speak(question.text);
    }
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?._id]);

  if (!question) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question._id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="glass-strong border-gradient rounded-xl3 p-5 sm:p-8 md:p-10"
      >
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="violet">{question.type}</Badge>
            {question.topic && <Badge tone="slate">{question.topic}</Badge>}
            <Badge
              tone={
                ["hard", "expert"].includes(question.difficulty) ? "coral" : question.difficulty === "medium" ? "amber" : "teal"
              }
            >
              {question.difficulty}
            </Badge>
          </div>
          {isSupported && (
            <button
              type="button"
              onClick={() => (speaking ? stop() : speak(question.text))}
              className={`p-2 rounded-lg transition-colors ${speaking ? "text-accent-hi bg-accent/10" : "text-ink-3 hover:text-ink hover:bg-ink/5"}`}
              aria-label={speaking ? "Stop reading question aloud" : "Read question aloud"}
              title={speaking ? "Stop" : "Read aloud"}
            >
              {speaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          )}
        </div>
        <p className="font-display text-xl md:text-2xl font-medium text-ink leading-snug">{question.text}</p>
      </motion.div>
    </AnimatePresence>
  );
}
