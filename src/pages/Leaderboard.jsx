import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trophy, Medal } from "lucide-react";
import Card from "../components/common/Card";
import { SkeletonTable } from "../components/common/Skeleton";
import leaderboardService from "../services/leaderboard.service";
import { initials, getErrorMessage } from "../utils/formatters";

const MEDAL_COLORS = ["text-warn", "text-ink-2", "text-amber-700"];

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await leaderboardService.getTop({ limit: 20 });
        setEntries(res.data.leaderboard || res.data || []);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <Trophy className="mx-auto text-warn mb-4" size={32} />
        <h1 className="font-display text-3xl font-semibold text-ink mb-2">Campus leaderboard</h1>
        <p className="text-ink-4 text-sm">Top performers across all mock interviews this term.</p>
      </div>

      {loading ? (
        <SkeletonTable rows={8} cols={3} />
      ) : (
        <Card className="p-3">
          {entries.map((e, i) => (
            <div key={e.student?._id || i} className="flex items-center gap-4 px-4 py-3.5 border-b border-line last:border-0">
              <span className={`w-6 text-center font-display font-semibold ${i < 3 ? MEDAL_COLORS[i] : "text-ink-4"}`}>
                {i < 3 ? <Medal size={18} className={MEDAL_COLORS[i]} /> : i + 1}
              </span>
              <div className="w-9 h-9 rounded-full bg-pulse-gradient flex items-center justify-center text-white text-xs font-semibold">
                {initials(e.student?.name || e.name || "U")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-ink truncate">{e.student?.name || e.name}</p>
              </div>
              <span className="font-mono text-sm text-success">{e.averageScore ?? e.score}/100</span>
            </div>
          ))}
          {!entries.length && <p className="text-center text-ink-4 py-10">Leaderboard is empty right now.</p>}
        </Card>
      )}
    </div>
  );
}
