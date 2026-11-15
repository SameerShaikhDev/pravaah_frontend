import React from "react";
import { motion } from "framer-motion";
import { Target, Users, Sparkles } from "lucide-react";
import Card from "../components/common/Card";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl font-semibold text-ink mb-6">Why we built Pravaah</h1>
        <p className="text-ink-3 text-lg leading-relaxed mb-6">
          Pravaah — meaning &ldquo;flow&rdquo; — started as a placement-season project for a college campus where mock interview
          slots with faculty were scarce and always booked out weeks in advance. Students needed a way to practice the format,
          pace, and pressure of a real interview without waiting for a human to be free.
        </p>
        <p className="text-ink-3 text-lg leading-relaxed">
          It's not trying to replace a career counsellor or a mentor. It's the repetition layer: the place you run through the
          same nervous system response of "explain your project out loud" enough times that it stops being scary by the time it
          matters.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-6 mt-16">
        <Card className="p-7">
          <Target className="text-accent-hi mb-4" size={22} />
          <h3 className="font-display font-semibold text-ink mb-2">Focused</h3>
          <p className="text-sm text-ink-3">Every question ties back to your resume and target role, not a generic bank.</p>
        </Card>
        <Card className="p-7">
          <Users className="text-success mb-4" size={22} />
          <h3 className="font-display font-semibold text-ink mb-2">Built for cohorts</h3>
          <p className="text-sm text-ink-3">
            Faculty can track readiness across an entire batch, not just one student at a time.
          </p>
        </Card>
        <Card className="p-7">
          <Sparkles className="text-warn mb-4" size={22} />
          <h3 className="font-display font-semibold text-ink mb-2">Actually adaptive</h3>
          <p className="text-sm text-ink-3">Follow-up questions respond to what you said, not a fixed script.</p>
        </Card>
      </div>
    </div>
  );
}
