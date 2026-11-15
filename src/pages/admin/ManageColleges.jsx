import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Building2, Copy } from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";
import DataTable from "../../components/admin/DataTable";
import { SkeletonTable } from "../../components/common/Skeleton";
import collegeService from "../../services/college.service";
import { formatDate, getErrorMessage } from "../../utils/formatters";

const emptyForm = {
  collegeName: "",
  collegeCode: "",
  address: "",
  city: "",
  state: "",
  classesRaw: "",
  tpoName: "",
  tpoEmail: "",
  tpoPhone: "",
};

export default function ManageColleges() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [lastCreated, setLastCreated] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const res = await collegeService.list();
      setColleges(res.data.colleges || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await collegeService.create({
        collegeName: form.collegeName,
        collegeCode: form.collegeCode,
        address: form.address,
        city: form.city,
        state: form.state,
        classes: form.classesRaw
          ? form.classesRaw
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
          : [],
        tpoName: form.tpoName,
        tpoEmail: form.tpoEmail,
        tpoPhone: form.tpoPhone,
      });
      toast.success("College and TPO account created.");
      setLastCreated(res.data);
      setForm(emptyForm);
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  function copyPassword() {
    navigator.clipboard.writeText(lastCreated.tempPassword);
    toast.success("Temporary password copied.");
  }

  const columns = [
    { key: "name", label: "College" },
    { key: "code", label: "Code", render: (r) => <Badge tone="violet">{r.code}</Badge> },
    { key: "tpo", label: "TPO", render: (r) => r.tpo?.name || "—" },
    { key: "tpoEmail", label: "TPO email", render: (r) => r.tpo?.email || "—" },
    { key: "classes", label: "Classes", render: (r) => (r.classes?.length ? r.classes.join(", ") : "All") },
    { key: "createdAt", label: "Created", render: (r) => formatDate(r.createdAt) },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="font-display text-xl font-semibold text-ink">Colleges &amp; TPOs</h2>
        <Button icon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
          Register a college
        </Button>
      </div>

      {lastCreated && (
        <Card className="p-5 border border-success/30">
          <p className="text-sm text-ink mb-2">
            <Building2 size={15} className="inline mr-1.5 -mt-0.5 text-success" />
            <b>{lastCreated.college.name}</b> registered. TPO login details were emailed to <b>{lastCreated.tpo.email}</b> — you
            can also share them directly:
          </p>
          <div className="flex items-center gap-3 flex-wrap text-sm">
            <span className="text-ink-3">
              Temp password: <code className="text-ink">{lastCreated.tempPassword}</code>
            </span>
            <Button size="sm" variant="secondary" icon={<Copy size={13} />} onClick={copyPassword}>
              Copy
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-2">
        {loading ? (
          <SkeletonTable rows={5} cols={5} />
        ) : (
          <DataTable columns={columns} rows={colleges} emptyLabel="No colleges registered yet." />
        )}
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Register a college" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="College name"
              required
              value={form.collegeName}
              onChange={(e) => update("collegeName", e.target.value)}
            />
            <Input
              label="College code"
              required
              hint="Short code, e.g. SANGAM. Used in redeem codes."
              value={form.collegeCode}
              onChange={(e) => update("collegeCode", e.target.value.toUpperCase())}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="City" value={form.city} onChange={(e) => update("city", e.target.value)} />
            <Input label="State" value={form.state} onChange={(e) => update("state", e.target.value)} />
          </div>
          <Input label="Address (optional)" value={form.address} onChange={(e) => update("address", e.target.value)} />
          <Input
            label="Classes (optional)"
            placeholder="TE, BE, SE — comma separated"
            hint="Leave blank if redeem codes should work for every class."
            value={form.classesRaw}
            onChange={(e) => update("classesRaw", e.target.value)}
          />

          <div className="border-t border-line pt-4">
            <p className="text-sm font-medium text-ink-2 mb-3">TPO account</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="TPO name" required value={form.tpoName} onChange={(e) => update("tpoName", e.target.value)} />
              <Input
                label="TPO email"
                type="email"
                required
                value={form.tpoEmail}
                onChange={(e) => update("tpoEmail", e.target.value)}
              />
            </div>
            <Input
              label="TPO phone (optional)"
              className="mt-4"
              value={form.tpoPhone}
              onChange={(e) => update("tpoPhone", e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" size="lg" isLoading={submitting}>
            Create college &amp; TPO login
          </Button>
        </form>
      </Modal>
    </div>
  );
}
