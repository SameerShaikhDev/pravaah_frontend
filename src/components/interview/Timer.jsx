import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { formatSecondsToClock } from "../../utils/formatters";
export default function Timer({ running = true, onTick }) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(
      () =>
        setSeconds((s) => {
          const next = s + 1;
          onTick?.(next);
          return next;
        }),
      1000,
    );
    return () => clearInterval(id);
  }, [running]);
  return (
    <div className="flex items-center gap-1.5 text-sm font-mono text-ink-2 glass px-3 py-1.5 rounded-lg">
      <Clock size={14} className="text-accent-hi" /> {formatSecondsToClock(seconds)}
    </div>
  );
}
