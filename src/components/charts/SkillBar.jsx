import React from "react";
import { motion } from "framer-motion";

export default function SkillBar({ label, score = 0 }) {
  const tone = score >= 75 ? "bg-success" : score >= 50 ? "bg-warn" : "bg-danger";
  return (
    <div>
      <div className="flex justify-between text-xs text-ink-3 mb-1.5">
        <span>{label}</span>
        <span className="font-mono text-ink-2">{score}/100</span>
      </div>
      <div className="h-2 rounded-full bg-line overflow-hidden">
        <motion.div
          className={`h-full ${tone} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
