import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import DataTable from "../../components/admin/DataTable";
import { SkeletonTable } from "../../components/common/Skeleton";
import tpoService from "../../services/tpo.service";
import { formatDate, getErrorMessage } from "../../utils/formatters";

export default function TpoStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await tpoService.getMyStudents({ search });
      setStudents(res.data.students || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "rollNo", label: "Roll no." },
    { key: "className", label: "Class" },
    {
      key: "onboarding",
      label: "Onboarding",
      render: (r) => (
        <Badge tone={r.onboarding?.completed ? "teal" : "amber"}>{r.onboarding?.completed ? "Completed" : "In progress"}</Badge>
      ),
    },
    { key: "createdAt", label: "Joined", render: (r) => formatDate(r.createdAt) },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="font-display text-xl font-semibold text-ink">My students</h2>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-4" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder="Search by name, email or roll no."
            className="bg-surface border border-line rounded-lg pl-9 pr-4 py-2 text-sm text-ink outline-none focus:border-accent w-72"
          />
        </div>
      </div>
      <Card className="p-2">
        {loading ? (
          <SkeletonTable rows={6} cols={6} />
        ) : (
          <DataTable columns={columns} rows={students} emptyLabel="No students from your college yet." />
        )}
      </Card>
    </div>
  );
}
