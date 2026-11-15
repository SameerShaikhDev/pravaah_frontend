import React from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { formatDateTime } from "../../utils/formatters";

export default function RecentActivity({ interviews = [] }) {
  if (!interviews.length) {
    return <p className="text-sm text-ink-4 py-6 text-center">No activity yet — start your first mock interview.</p>;
  }
  return (
    <ul className="space-y-1">
      {interviews.map((iv) => {
        const done = iv.status === "completed";
        return (
          <li key={iv._id} className="flex items-center gap-3 p-2.5 -mx-2.5 rounded-xl hover:bg-ink/5 transition-colors">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${done ? "bg-success/15 text-success" : "bg-warn/15 text-warn"}`}
            >
              {done ? <CheckCircle2 size={16} /> : <Clock size={16} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink truncate">{iv.targetRole || "Mock interview"}</p>
              <p className="text-xs text-ink-4">{formatDateTime(iv.createdAt)}</p>
            </div>
            <span className="text-xs text-ink-3 capitalize shrink-0">{iv.status.replace("_", " ")}</span>
          </li>
        );
      })}
    </ul>
  );
}
