import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Card from "../../components/common/Card";
import DataTable from "../../components/admin/DataTable";
import Badge from "../../components/common/Badge";
import { SkeletonTable } from "../../components/common/Skeleton";
import adminService from "../../services/admin.service";
import { formatDate, getErrorMessage } from "../../utils/formatters";

export default function ManageInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await adminService.getAllInterviews({});
        setInterviews(res.data.interviews || res.data || []);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const columns = [
    { key: "student", label: "Student", render: (r) => r.student?.name || "—" },
    { key: "targetRole", label: "Target role" },
    { key: "type", label: "Type" },
    {
      key: "status",
      label: "Status",
      render: (r) => <Badge tone={r.status === "completed" ? "teal" : "amber"}>{r.status.replace("_", " ")}</Badge>,
    },
    { key: "score", label: "Score", render: (r) => (r.result?.overallScore != null ? `${r.result.overallScore}/100` : "—") },
    { key: "createdAt", label: "Date", render: (r) => formatDate(r.createdAt) },
  ];

  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-semibold text-ink">Manage interviews</h2>
      <Card className="p-2">
        {loading ? (
          <SkeletonTable rows={6} cols={6} />
        ) : (
          <DataTable columns={columns} rows={interviews} emptyLabel="No interviews recorded yet." />
        )}
      </Card>
    </div>
  );
}
