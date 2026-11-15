import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Mic, Code2, FileText, BarChart3, Trophy, ChevronDown, Video, Timer as TimerIcon, Play } from "lucide-react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import TiltCard from "../components/common/TiltCard";
import FlowField from "../components/visual/FlowField";
import Reveal from "../components/visual/Reveal";

/* NOTE: Landing is a purely presentational, public page — it makes no API calls. The CTAs route into the
   existing /register and /features routes (see App.jsx); auth/session handling lives in AuthContext. */

const STEPS = [
  { label: "Upload", text: "Drop in your resume. We pull out your skills and target role automatically." },
  { label: "Interview", text: "Answer questions out loud or in the editor, one at a time, at your own pace." },
  { label: "Review", text: "Get a scored report with what to fix before your next attempt." },
];

const TESTIMONIALS = [
  {
    name: "Priya Deshmukh",
    role: "Final year, CSE",
    quote:
      "The follow-up questions caught me off guard the same way real interviewers do. Good practice for thinking on my feet.",
  },
  {
    name: "Rohan Kulkarni",
    role: "Final year, IT",
    quote: "Coding round timer pressure felt real. My actual interview felt easier after a week of this.",
  },
  {
    name: "Ananya Joshi",
    role: "Third year, CSE",
    quote: "The report told me my answers were technically fine but too rushed. Fixed that before my next interview.",
  },
];

const FAQS = [
  {
    q: "Is this only for coding interviews?",
    a: "No — you can run mixed, technical, behavioral, or pure coding rounds depending on what you're preparing for.",
  },
  {
    q: "Do I need to upload a resume?",
    a: "It's optional but recommended. Without one, questions default to a general software engineering track.",
  },
  {
    q: "Can faculty see my scores?",
    a: "Only admins configured for your institution can view aggregate and individual reports for placement tracking.",
  },
  {
    q: "Does it work on mobile?",
    a: "The dashboard and reports are fully responsive. Live interview rounds are best on a laptop with a working microphone.",
  },
];

/* ---------- small visuals used inside the bento ---------- */
const WAVE = [
  "animate-wave-1",
  "animate-wave-3",
  "animate-wave-2",
  "animate-wave-4",
  "animate-wave-1",
  "animate-wave-3",
  "animate-wave-2",
  "animate-wave-4",
  "animate-wave-1",
  "animate-wave-2",
  "animate-wave-3",
  "animate-wave-1",
];

function ScoreBars() {
  const rows = [
    ["Technical", 86, "bg-success"],
    ["Communication", 74, "bg-warn"],
    ["Confidence", 68, "bg-warn"],
    ["Grammar", 91, "bg-success"],
  ];
  return (
    <div className="space-y-3 mt-6">
      {rows.map(([label, v, tone]) => (
        <div key={label}>
          <div className="flex justify-between text-xs text-ink-3 mb-1.5">
            <span>{label}</span>
            <span className="font-mono">{v}</span>
          </div>
          <div className="h-1.5 rounded-full bg-line overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${tone}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${v}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function CodeSnippet() {
  return (
    <pre className="mt-6 rounded-xl bg-canvas/70 border border-line p-4 text-[12px] leading-relaxed font-mono text-ink-3 overflow-hidden">
      <span className="text-accent-hi">def</span> <span className="text-ink">two_sum</span>(nums, target):{"\n"}
      {"    "}seen = {"{}"}
      {"\n"}
      {"    "}
      <span className="text-accent-hi">for</span> i, n <span className="text-accent-hi">in</span> enumerate(nums):{"\n"}
      {"        "}
      <span className="text-accent-hi">if</span> target - n <span className="text-accent-hi">in</span> seen:{"\n"}
      {"            "}
      <span className="text-accent-hi">return</span> [seen[target - n], i]{"\n"}
      <span className="text-success">✓ 12/12 tests passed</span>
    </pre>
  );
}

function BentoCard({ icon: Icon, title, desc, className = "", children }) {
  return (
    <Card hover className={`p-7 flex flex-col ${className}`}>
      <div className="w-11 h-11 rounded-xl bg-accent/15 border border-accent/20 flex items-center justify-center mb-5">
        <Icon size={20} className="text-accent-hi" />
      </div>
      <h3 className="font-display text-lg font-semibold text-ink mb-2">{title}</h3>
      <p className="text-sm text-ink-3 leading-relaxed max-w-md">{desc}</p>
      {children}
    </Card>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line">
      <button
        className="w-full flex items-center justify-between gap-6 text-left py-5 group"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="font-medium text-ink group-hover:text-accent-hi transition-colors">{q}</span>
        <ChevronDown
          className={`shrink-0 text-ink-3 transition-transform duration-300 ease-snap ${open ? "rotate-180 text-accent-hi" : ""}`}
          size={18}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-ink-3 leading-relaxed max-w-2xl">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* The hero's live-interview mock: the product's own signature moment, tilting in 3D. */
function HeroInterviewCard() {
  return (
    <div className="relative">
      <TiltCard max={7}>
        <div className="glass-strong border-gradient rounded-xl3 p-7 animate-float">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs text-ink-4 font-mono">Question 3 of 5</span>
            <span className="flex items-center gap-1.5 text-xs text-ink-3 font-mono">
              <TimerIcon size={13} /> 01:42
            </span>
          </div>
          <p className="text-ink text-[15px] leading-relaxed mb-7">
            &ldquo;Design a scalable URL shortening service. Walk me through your storage and caching choices.&rdquo;
          </p>
          <div className="flex items-center gap-4 mb-7">
            <span className="relative w-11 h-11 rounded-full bg-action flex items-center justify-center shrink-0">
              <span className="absolute inset-0 rounded-full bg-accent/50 animate-ping" aria-hidden="true" />
              <Mic size={18} className="relative text-white" />
            </span>
            <div className="waveform flex-1" aria-hidden="true">
              {WAVE.map((c, i) => (
                <span key={i} className={c} />
              ))}
            </div>
          </div>
          <div className="h-1.5 rounded-full bg-line overflow-hidden">
            <div className="h-full w-3/5 bg-pulse-gradient rounded-full" />
          </div>
        </div>
      </TiltCard>

      <div
        className="absolute -bottom-8 -right-3 sm:-right-6 glass-strong rounded-2xl px-5 py-4 hidden sm:block"
        style={{ transform: "translateZ(40px)" }}
      >
        <p className="text-xs text-ink-4 mb-1">Overall score</p>
        <p className="font-display text-3xl font-semibold text-success leading-none">
          82<span className="text-sm text-ink-4 font-normal">/100</span>
        </p>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden -mt-[68px] pt-[68px]">
        <div
          className="absolute inset-0"
          style={{
            maskImage: "linear-gradient(180deg,#000 55%,transparent)",
            WebkitMaskImage: "linear-gradient(180deg,#000 55%,transparent)",
          }}
        >
          <FlowField lines={16} />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-32 lg:pt-28 grid lg:grid-cols-[1.15fr_1fr] gap-16 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl sm:text-6xl font-semibold leading-[1.04] tracking-tight text-ink mb-7"
            >
              Practice the interview <span className="text-gradient">that talks back.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-ink-3 text-lg leading-relaxed mb-9 max-w-xl"
            >
              Pravaah runs full mock interviews — technical, behavioral, and coding — with an AI interviewer that reacts to your
              actual answers, then tells you exactly what to fix.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/register">
                <Button size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
                  Start a free mock interview
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="secondary" icon={<Play size={14} />}>
                  See how it works
                </Button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroInterviewCard />
          </motion.div>
        </div>
      </section>

      {/* FEATURES — bento, sized by how much each feature needs to show */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <Reveal className="max-w-xl mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink mb-3">Everything a real interview loop has</h2>
          <p className="text-ink-3">Minus the anxiety of it counting toward an actual offer.</p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
          <Reveal className="md:col-span-3 md:row-span-2">
            <BentoCard
              icon={Mic}
              title="Talks back, not just listens"
              desc="The AI asks follow-up questions based on what you actually said — like a real interviewer would."
              className="h-full"
            >
              <div className="mt-auto pt-10 space-y-3">
                <p className="max-w-[85%] rounded-2xl rounded-bl-md glass px-4 py-3 text-sm text-ink-2">
                  &ldquo;Tell me about a time a cache gave you stale data.&rdquo;
                </p>
                <p className="max-w-[85%] ml-auto rounded-2xl rounded-br-md bg-action px-4 py-3 text-sm text-white">
                  We used Redis in front of Postgres, and invalidation lagged behind writes&hellip;
                </p>
                <div className="max-w-[92%] rounded-2xl rounded-bl-md glass px-4 py-3">
                  <p className="text-sm text-ink-2 mb-3">
                    &ldquo;You mentioned caching — what happens when the cache and the database disagree?&rdquo;
                  </p>
                  <div className="waveform" aria-hidden="true">
                    {WAVE.map((c, i) => (
                      <span key={i} className={c} />
                    ))}
                  </div>
                </div>
              </div>
            </BentoCard>
          </Reveal>
          <Reveal className="md:col-span-3" delay={0.05}>
            <BentoCard
              icon={Code2}
              title="Live coding rounds"
              desc="A real Monaco editor with multi-language support, test execution, and instant console output."
              className="h-full"
            >
              <CodeSnippet />
            </BentoCard>
          </Reveal>
          <Reveal className="md:col-span-3" delay={0.1}>
            <BentoCard
              icon={BarChart3}
              title="Score breakdowns that mean something"
              desc="Technical, communication, confidence, and grammar — each scored and explained, not just a number."
              className="h-full"
            >
              <ScoreBars />
            </BentoCard>
          </Reveal>
          <Reveal className="md:col-span-2">
            <BentoCard
              icon={FileText}
              title="Resume-aware questions"
              desc="Upload your resume once. Every mock interview is tailored to your skills and target role."
              className="h-full"
            />
          </Reveal>
          <Reveal className="md:col-span-2" delay={0.05}>
            <BentoCard
              icon={Trophy}
              title="Campus leaderboard"
              desc="See how you stack up against classmates preparing for the same placement season."
              className="h-full"
            />
          </Reveal>
          <Reveal className="md:col-span-2" delay={0.1}>
            <BentoCard
              icon={Video}
              title="Practice under real conditions"
              desc="Camera preview, fullscreen mode, and a visible timer so the practice run feels like the real one."
              className="h-full"
            />
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS — a true sequence, so numbered */}
      <section className="border-y border-line/70 bg-surface/40">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <Reveal>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink mb-16 max-w-md">
              Three steps, start to score
            </h2>
          </Reveal>
          <div className="relative grid md:grid-cols-3 gap-10">
            <div
              className="hidden md:block absolute top-5 left-[8%] right-[8%] h-px bg-gradient-to-r from-accent/60 via-flow/50 to-transparent"
              aria-hidden="true"
            />
            {STEPS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1}>
                <div className="relative">
                  <span className="relative z-10 flex w-10 h-10 rounded-full bg-canvas border border-accent/50 items-center justify-center font-mono text-sm text-accent-hi mb-6 shadow-[0_0_24px_-6px_rgb(var(--accent)/0.7)]">
                    {i + 1}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-ink mb-2">{s.label}</h3>
                  <p className="text-sm text-ink-3 leading-relaxed max-w-xs">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink mb-14 max-w-xl">
            From students who used it before placements
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <Card className="p-7 h-full flex flex-col">
                <p className="text-ink-2 text-[15px] leading-relaxed mb-7">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-auto flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-pulse-gradient flex items-center justify-center text-xs font-semibold text-white">
                    {t.name[0]}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">{t.name}</p>
                    <p className="text-xs text-ink-4">{t.role}</p>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink mb-8">Questions before you start</h2>
        </Reveal>
        <div className="border-t border-line">
          {FAQS.map((f) => (
            <FaqItem key={f.q} {...f} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-28">
        <Reveal>
          <div className="relative overflow-hidden border-gradient glass-strong rounded-xl3 px-8 py-16 sm:px-14 text-center">
            <FlowField lines={9} interactive={false} />
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink mb-8 max-w-2xl mx-auto leading-tight">
                Your next interview shouldn&rsquo;t be the first time you say your answer out loud.
              </h2>
              <Link to="/register">
                <Button size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
                  Create your free account
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
