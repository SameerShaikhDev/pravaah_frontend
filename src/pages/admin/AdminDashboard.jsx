import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Users, ClipboardList, TrendingUp, CheckCircle2, GraduationCap, Building2, IndianRupee, UserCheck } from "lucide-react";
import Card from "../../components/common/Card";
import StatCard from "../../components/dashboard/StatCard";
import PerformanceLineChart from "../../components/charts/PerformanceLineChart";
import { SkeletonCard } from "../../components/common/Skeleton";
import adminService from "../../services/admin.service";
import { getErrorMessage } from "../../utils/formatters";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [growth, setGrowth] = useState([]);
  const [loading, setLoading] = useState(true);

  // GET /admin/dashboard → totals; GET /analytics/student-growth → [{ _id: "YYYY-MM-DD", count }].
  useEffect(() => {
    async function load() {
      const [statsRes, growthRes] = await Promise.allSettled([adminService.getDashboard(), adminService.getStudentGrowth({})]);
      if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
      else toast.error(getErrorMessage(statsRes.reason));
      if (growthRes.status === "fulfilled") setGrowth(growthRes.value.data?.growth || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading)
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );

  const trend = growth.map((g) => ({ label: g._id, score: g.count }));

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={Users} label="Total students" value={stats?.totalStudents ?? "—"} tone="violet" />
        <StatCard icon={ClipboardList} label="Interviews conducted" value={stats?.totalInterviews ?? "—"} tone="teal" />
        <StatCard
          icon={TrendingUp}
          label="Average score"
          value={stats?.averageScore != null ? `${stats.averageScore}/100` : "—"}
          tone="amber"
        />
        <StatCard icon={CheckCircle2} label="Completed interviews" value={stats?.completedInterviews ?? "—"} tone="coral" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={UserCheck} label="Professionals" value={stats?.totalProfessionals ?? "—"} tone="violet" />
        <StatCard icon={Building2} label="Colleges" value={stats?.totalColleges ?? "—"} tone="teal" />
        <StatCard icon={GraduationCap} label="Active redeem codes" value={stats?.activeRedeemCodes ?? "—"} tone="amber" />
        <StatCard icon={IndianRupee} label="Total revenue" value={stats?.totalRevenue != null ? `₹${stats.totalRevenue}` : "—"} tone="coral" />
      </div>
      <Card className="p-6">
        <h3 className="font-display font-semibold text-ink mb-5">New students (last 30 days)</h3>
        {trend.length ? (
          <PerformanceLineChart data={trend} />
        ) : (
          <p className="text-sm text-ink-4 py-16 text-center">
            No new student sign-ups in the last 30 days.
          </p>
        )}
      </Card>
    </div>
  );
}
