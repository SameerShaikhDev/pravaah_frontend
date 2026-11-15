import React from "react";
import Card from "../common/Card";

// Tones map to the semantic palette: violet = brand, teal = positive, amber = highlight, coral = needs attention.
const TONES = {
  violet: "bg-accent/15 text-accent-hi border-accent/25",
  teal: "bg-success/15 text-success border-success/25",
  amber: "bg-warn/15 text-warn border-warn/25",
  coral: "bg-danger/15 text-danger border-danger/25",
};

export default function StatCard({ icon: Icon, label, value, tone = "violet" }) {
  return (
    <Card className="p-5 flex items-center gap-4" hover>
      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${TONES[tone]}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-ink-4 mb-0.5">{label}</p>
        <p className="font-display text-2xl font-semibold text-ink truncate tabular-nums">{value}</p>
      </div>
    </Card>
  );
}
