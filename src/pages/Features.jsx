import React from "react";
import { motion } from "framer-motion";
import { Mic, Code2, FileText, BarChart3, Trophy, Video, Maximize, Clock } from "lucide-react";
import Card from "../components/common/Card";
import Reveal from "../components/visual/Reveal";

const GROUPS = [
  {
    title: "Before the interview",
    items: [
      {
        icon: FileText,
        title: "Resume parsing",
        desc: "We extract skills, projects, and experience level to shape the question set to you.",
      },
      {
        icon: Clock,
        title: "Flexible formats",
        desc: "Choose mixed, technical, behavioral, or coding-only, and set how many questions you want.",
      },
    ],
  },
  {
    title: "During the interview",
    items: [
      {
        icon: Mic,
        title: "Voice-first answers",
        desc: "Speak your answer with a live waveform indicator, or type if you prefer.",
      },
      {
        icon: Video,
        title: "Camera preview",
        desc: "See yourself as the interviewer would, to keep eye contact and posture in check.",
      },
      {
        icon: Maximize,
        title: "Fullscreen focus mode",
        desc: "Removes distractions so the practice run feels closer to the real thing.",
      },
      {
        icon: Code2,
        title: "Monaco-powered coding round",
        desc: "Full syntax highlighting, multiple languages, run and submit, with visible test case results.",
      },
    ],
  },
  {
    title: "After the interview",
    items: [
      {
        icon: BarChart3,
        title: "Four-axis scoring",
        desc: "Technical, communication, confidence, and grammar are scored independently, not blended into one number.",
      },
      {
        icon: Trophy,
        title: "Leaderboard placement",
        desc: "See your rank against classmates and track improvement across attempts.",
      },
    ],
  },
];

export default function Features() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mb-16">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink mb-4">
          Every part of a real interview loop, practiced separately
        </h1>
        <p className="text-ink-3 text-lg">
          Pravaah breaks the interview process into stages you can drill individually or run end-to-end.
        </p>
      </motion.div>

      <div className="space-y-16">
        {GROUPS.map((group) => (
          <Reveal key={group.title}>
            <h2 className="font-display text-xl font-semibold text-ink mb-6">{group.title}</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {group.items.map((item) => (
                <Card key={item.title} hover className="p-7 flex gap-5">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-accent/15 border border-accent/20 flex items-center justify-center">
                    <item.icon size={20} className="text-accent-hi" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-ink mb-1.5">{item.title}</h3>
                    <p className="text-sm text-ink-3 leading-relaxed">{item.desc}</p>
                  </div>
                </Card>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
