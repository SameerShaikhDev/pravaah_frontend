import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Card from "../../components/common/Card";
import PerformanceLineChart from "../../components/charts/PerformanceLineChart";
import { SkeletonCard } from "../../components/common/Skeleton";
import adminService from "../../services/admin.service";
import { getErrorMessage } from "../../utils/formatters";

export default function AnalyticsDashboard() {
  const [growth, setGrowth] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await adminService.getStudentGrowth({});
        setGrowth(res.data.growth || res.data || []);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <SkeletonCard />;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-semibold text-ink">Analytics</h2>
      <Card className="p-6">
        <h3 className="font-display font-semibold text-ink mb-5">Student growth over time</h3>
        {growth.length ? (
          <PerformanceLineChart data={growth.map((g) => ({ label: g._id || g.label || g.month, score: g.count ?? g.value ?? 0 }))} />
        ) : (
          <p className="text-sm text-ink-4 py-16 text-center">Connect GET /analytics/student-growth to populate this chart.</p>
        )}
      </Card>
    </div>
  );
}
