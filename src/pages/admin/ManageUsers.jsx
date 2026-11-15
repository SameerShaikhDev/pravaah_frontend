import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Card from "../../components/common/Card";
import DataTable from "../../components/admin/DataTable";
import Badge from "../../components/common/Badge";
import { SkeletonTable } from "../../components/common/Skeleton";
import adminService from "../../services/admin.service";
import { formatDate, getErrorMessage } from "../../utils/formatters";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [stuRes, proRes] = await Promise.allSettled([adminService.getAllStudents({}), adminService.getAllProfessionals({})]);
        const students = stuRes.status === "fulfilled" ? stuRes.value.data?.students || [] : [];
        const professionals = proRes.status === "fulfilled" ? proRes.value.data?.professionals || [] : [];
        if (stuRes.status === "rejected" && proRes.status === "rejected") throw stuRes.reason;
        setUsers([...students, ...professionals].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role", render: (r) => <Badge tone={r.role === "admin" ? "violet" : "slate"}>{r.role}</Badge> },
    {
      key: "isEmailVerified",
      label: "Verified",
      render: (r) => <Badge tone={r.isEmailVerified ? "teal" : "amber"}>{r.isEmailVerified ? "Yes" : "No"}</Badge>,
    },
    { key: "createdAt", label: "Joined", render: (r) => formatDate(r.createdAt) },
  ];

  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-semibold text-ink">All users</h2>
      <Card className="p-2">{loading ? <SkeletonTable rows={6} cols={5} /> : <DataTable columns={columns} rows={users} />}</Card>
    </div>
  );
}
