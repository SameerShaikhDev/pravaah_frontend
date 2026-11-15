import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { GraduationCap, CheckCircle2, Ticket, Users, ArrowRight } from "lucide-react";
import Card from "../../components/common/Card";
import StatCard from "../../components/dashboard/StatCard";
import Badge from "../../components/common/Badge";
import DataTable from "../../components/admin/DataTable";
import { SkeletonCard } from "../../components/common/Skeleton";
import tpoService from "../../services/tpo.service";
import { formatDate, getErrorMessage } from "../../utils/formatters";

const STATUS_TONE = { active: "teal", exhausted: "amber", expired: "slate", revoked: "coral" };
const SEAT_STATUS_TONE = { paid: "teal", pending: "amber", failed: "coral" };

export default function TpoDashboard() {
  const [data, setData] = useState(null);
  const [seatOrders, setSeatOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([tpoService.getDashboard(), tpoService.listSeatOrders({ limit: 5 })])
      .then(([dashRes, seatRes]) => {
        if (dashRes.status === "fulfilled") setData(dashRes.value.data);
        else toast.error(getErrorMessage(dashRes.reason));
        if (seatRes.status === "fulfilled") setSeatOrders(seatRes.value.data.seatOrders || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 gap-5">
        {Array.from({ length: 2 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const totalSeatsBought = seatOrders.filter((o) => o.status === "paid").reduce((s, o) => s + o.seatCount, 0);

  const columns = [
    { key: "code", label: "Code" },
    { key: "className", label: "Class", render: (r) => r.className || "All" },
    { key: "usage", label: "Usage", render: (r) => `${r.usedCount} / ${r.maxUses}` },
    { key: "status", label: "Status", render: (r) => <Badge tone={STATUS_TONE[r.status] || "slate"}>{r.status}</Badge> },
    { key: "createdAt", label: "Created", render: (r) => formatDate(r.createdAt) },
  ];

  const seatColumns = [
    { key: "plan", label: "Plan", render: (r) => r.plan?.name || "—" },
    { key: "seatCount", label: "Seats" },
    { key: "totalAmount", label: "Amount", render: (r) => `₹${r.totalAmount}` },
    { key: "status", label: "Status", render: (r) => <Badge tone={SEAT_STATUS_TONE[r.status] || "slate"}>{r.status}</Badge> },
    { key: "createdAt", label: "Created", render: (r) => formatDate(r.createdAt) },
  ];

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-3 gap-5">
        <StatCard icon={GraduationCap} label="Total students" value={data?.totalStudents ?? 0} tone="violet" />
        <StatCard icon={CheckCircle2} label="Onboarded students" value={data?.onboardedStudents ?? 0} tone="teal" />
        <StatCard icon={Users} label="Bulk seats purchased" value={totalSeatsBought} tone="amber" />
      </div>

      <Card className="p-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-display font-semibold text-ink mb-1">Buy bulk seats for your college</h3>
          <p className="text-xs text-ink-4">Purchase seats in bulk and get an auto-generated redeem code to distribute.</p>
        </div>
        <Link
          to="/tpo/buy-seats"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-action text-white shadow-glow hover:opacity-90"
        >
          Buy seats <ArrowRight size={15} />
        </Link>
      </Card>

      {seatOrders.length > 0 && (
        <Card className="p-6">
          <h3 className="font-display font-semibold text-ink mb-4">Recent seat orders</h3>
          <DataTable columns={seatColumns} rows={seatOrders} emptyLabel="No seat orders yet." />
        </Card>
      )}

      <Card className="p-6">
        <h3 className="font-display font-semibold text-ink mb-1 flex items-center gap-2">
          <Ticket size={16} /> Recent redeem codes
        </h3>
        <p className="text-xs text-ink-4 mb-4">Latest codes generated for your college.</p>
        <DataTable columns={columns} rows={data?.recentCodes || []} emptyLabel="No redeem codes generated yet." />
      </Card>
    </div>
  );
}
