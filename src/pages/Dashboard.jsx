import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video, Trophy, TrendingUp, FileText, Plus } from "lucide-react";
import { toast } from "sonner";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import StatCard from "../components/dashboard/StatCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import PerformanceLineChart from "../components/charts/PerformanceLineChart";
import ReferralCard from "../components/referral/ReferralCard";
import { SkeletonCard } from "../components/common/Skeleton";
import interviewService from "../services/interview.service";
import leaderboardService from "../services/leaderboard.service";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/formatters";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState([]);
  const [rank, setRank] = useState(null);

  // BACKEND HOOKS (unchanged): GET /interviews/my → interviewService.getMine, GET /leaderboard/my-rank → leaderboardService.getMyRank.
  // Both are fetched in parallel; either may fail independently without breaking the page.
  useEffect(() => {
    async function load() {
      try {
        const [ivRes, rankRes] = await Promise.allSettled([
          interviewService.getMine({ limit: 8 }),
          leaderboardService.getMyRank(),
        ]);
        if (ivRes.status === "fulfilled") setInterviews(ivRes.value.data.interviews || ivRes.value.data || []);
        if (rankRes.status === "fulfilled") setRank(rankRes.value.data.rank);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const completed = interviews.filter((i) => i.status === "completed");
  const avgScore = completed.length
    ? Math.round(completed.reduce((s, i) => s + (i.result?.overallScore || 0), 0) / completed.length)
    : 0;
  const chartData = completed.slice(-6).map((i, idx) => ({ label: `#${idx + 1}`, score: i.result?.overallScore || 0 }));

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">Welcome back, {user?.name?.split(" ")[0]}</h2>
          <p className="text-sm text-ink-4">Here's how your preparation is going.</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => navigate("/interview/new/instructions")}>
          New mock interview
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={Video} label="Total interviews" value={user?.totalInterviews ?? interviews.length} tone="violet" />
        <StatCard icon={TrendingUp} label="Average score" value={`${avgScore}/100`} tone="teal" />
        <StatCard icon={Trophy} label="Leaderboard rank" value={rank ? `#${rank}` : "—"} tone="amber" />
        <StatCard
          icon={FileText}
          label="Resume status"
          value={user?.resume ? "Uploaded" : "Missing"}
          tone={user?.resume ? "teal" : "coral"}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-display font-semibold text-ink mb-5">Score trend</h3>
          {chartData.length ? (
            <PerformanceLineChart data={chartData} />
          ) : (
            <p className="text-sm text-ink-4 py-16 text-center">Complete a mock interview to see your trend here.</p>
          )}
        </Card>
        <Card className="p-6">
          <h3 className="font-display font-semibold text-ink mb-5">Recent activity</h3>
          <RecentActivity interviews={interviews} />
        </Card>
      </div>

      <ReferralCard />
    </div>
  );
}
