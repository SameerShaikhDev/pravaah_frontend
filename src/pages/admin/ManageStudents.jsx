import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Search, Ban, CheckCircle2 } from "lucide-react";
import Card from "../../components/common/Card";
import DataTable from "../../components/admin/DataTable";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import { SkeletonTable } from "../../components/common/Skeleton";
import adminService from "../../services/admin.service";
import { formatDate, getErrorMessage } from "../../utils/formatters";

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await adminService.getAllStudents({ search });
      setStudents(res.data.students || res.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleStatus(student) {
    try {
      if (student.isActive) await adminService.deactivateStudent(student._id);
      else await adminService.activateStudent(student._id);
      toast.success("Status updated.");
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "totalInterviews", label: "Interviews" },
    { key: "averageScore", label: "Avg score", render: (r) => `${r.averageScore ?? 0}/100` },
    {
      key: "isActive",
      label: "Status",
      render: (r) => <Badge tone={r.isActive ? "teal" : "coral"}>{r.isActive ? "Active" : "Inactive"}</Badge>,
    },
    { key: "createdAt", label: "Joined", render: (r) => formatDate(r.createdAt) },
    {
      key: "actions",
      label: "",
      render: (r) => (
        <Button
          size="sm"
          variant={r.isActive ? "danger" : "secondary"}
          icon={r.isActive ? <Ban size={13} /> : <CheckCircle2 size={13} />}
          onClick={() => toggleStatus(r)}
        >
          {r.isActive ? "Deactivate" : "Activate"}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="font-display text-xl font-semibold text-ink">Manage students</h2>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-4" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder="Search by name or email"
            className="bg-surface border border-line rounded-lg pl-9 pr-4 py-2 text-sm text-ink outline-none focus:border-accent w-64"
          />
        </div>
      </div>
      <Card className="p-2">
        {loading ? (
          <SkeletonTable rows={6} cols={6} />
        ) : (
          <DataTable columns={columns} rows={students} emptyLabel="No students found." />
        )}
      </Card>
    </div>
  );
}
