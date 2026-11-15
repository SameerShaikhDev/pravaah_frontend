import React, { useState } from "react";
import { Mic, Square } from "lucide-react";
import clsx from "clsx";

// BACKEND HOOK: none here. Speech is transcribed in-browser (Web Speech API) and handed up via `onTranscript`;
// the parent (InterviewRoom) is what submits the final text to the API.
export default function VoiceRecorder({ onTranscript }) {
  const [recording, setRecording] = useState(false);
  const [supported] = useState(() => "webkitSpeechRecognition" in window || "SpeechRecognition" in window);
  const recognitionRef = React.useRef(null);

  function toggleRecording() {
    if (!supported) return;
    if (recording) {
      recognitionRef.current?.stop();
      setRecording(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    let finalTranscript = "";
    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + " ";
        else interim += transcript;
      }
      onTranscript?.(finalTranscript + interim);
    };
    recognition.onend = () => setRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative flex items-center justify-center w-24 h-24">
        {recording && (
          <>
            <span className="absolute inset-0 rounded-full bg-danger/25 animate-ping" aria-hidden="true" />
            <span className="absolute -inset-2 rounded-full border border-danger/30 animate-pulse-slow" aria-hidden="true" />
          </>
        )}
        <button
          onClick={toggleRecording}
          disabled={!supported}
          aria-label={recording ? "Stop recording" : "Start recording"}
          aria-pressed={recording}
          className={clsx(
            "relative w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-300 ease-snap",
            "hover:scale-105 active:scale-95",
            recording ? "bg-danger shadow-[0_0_40px_-4px_rgb(var(--danger)/0.8)]" : "bg-action shadow-glow",
            !supported && "opacity-40 cursor-not-allowed hover:scale-100",
          )}
        >
          {recording ? <Square size={22} className="text-white" /> : <Mic size={26} className="text-white" />}
        </button>
      </div>
      <div className="h-7">
        {recording && (
          <div className="waveform" aria-hidden="true">
            <span className="animate-wave-1" />
            <span className="animate-wave-2" />
            <span className="animate-wave-3" />
            <span className="animate-wave-4" />
            <span className="animate-wave-2" />
            <span className="animate-wave-1" />
            <span className="animate-wave-3" />
          </div>
        )}
      </div>
      <p className="text-xs text-ink-3 text-center" role="status">
        {supported
          ? recording
            ? "Listening — tap to stop"
            : "Tap to speak your answer"
          : "Voice input not supported in this browser — type instead"}
      </p>
    </div>
  );
}
