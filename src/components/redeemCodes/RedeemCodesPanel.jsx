import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, RefreshCw, Ban, Copy } from "lucide-react";
import Card from "../common/Card";
import Button from "../common/Button";
import Input from "../common/Input";
import Modal from "../common/Modal";
import Badge from "../common/Badge";
import DataTable from "../admin/DataTable";
import { SkeletonTable } from "../common/Skeleton";
import redeemCodeService from "../../services/redeemCode.service";
import { formatDate, getErrorMessage } from "../../utils/formatters";

const STATUS_TONE = { active: "teal", exhausted: "amber", expired: "slate", revoked: "coral" };

/**
 * `collegeId` is required when this panel is rendered for an Admin (who can act on any college).
 * When rendered for a TPO, leave it undefined - the backend infers their own college from the token.
 */
export default function RedeemCodesPanel({ collegeId, colleges }) {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [selectedCollegeId, setSelectedCollegeId] = useState(collegeId || colleges?.[0]?._id || "");
  const [form, setForm] = useState({ code: "", className: "", planKey: "basic", maxUses: 30, expiresAt: "" });

  const effectiveCollegeId = collegeId || selectedCollegeId;

  async function load() {
    if (!effectiveCollegeId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await redeemCodeService.list({ collegeId: effectiveCollegeId });
      setCodes(res.data.codes || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveCollegeId]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function suggestCode() {
    setSuggesting(true);
    try {
      const res = await redeemCodeService.suggest({ collegeId: effectiveCollegeId, className: form.className || undefined });
      update("code", res.data.suggestedCode);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSuggesting(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.code) return toast.error("Generate or type a code first.");
    setSubmitting(true);
    try {
      await redeemCodeService.create({
        code: form.code,
        collegeId: effectiveCollegeId,
        className: form.className || undefined,
        planKey: form.planKey,
        maxUses: Number(form.maxUses),
        expiresAt: form.expiresAt || undefined,
      });
      toast.success("Redeem code created.");
      setModalOpen(false);
      setForm({ code: "", className: "", planKey: "basic", maxUses: 30, expiresAt: "" });
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function revoke(id) {
    try {
      await redeemCodeService.revoke(id);
      toast.success("Code revoked.");
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  function copyCode(code) {
    navigator.clipboard.writeText(code);
    toast.success("Code copied.");
  }

  const columns = [
    {
      key: "code",
      label: "Code",
      render: (r) => (
        <span className="inline-flex items-center gap-2">
          <code className="text-ink">{r.code}</code>
          <button onClick={() => copyCode(r.code)} className="text-ink-4 hover:text-ink-2">
            <Copy size={13} />
          </button>
        </span>
      ),
    },
    { key: "className", label: "Class", render: (r) => r.className || "All" },
    { key: "plan", label: "Plan", render: (r) => r.plan?.name || "—" },
    { key: "usage", label: "Usage", render: (r) => `${r.usedCount} / ${r.maxUses}` },
    { key: "status", label: "Status", render: (r) => <Badge tone={STATUS_TONE[r.status] || "slate"}>{r.status}</Badge> },
    { key: "createdAt", label: "Created", render: (r) => formatDate(r.createdAt) },
    {
      key: "actions",
      label: "",
      render: (r) =>
        r.status === "active" && (
          <Button size="sm" variant="danger" icon={<Ban size={13} />} onClick={() => revoke(r._id)}>
            Revoke
          </Button>
        ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="font-display text-xl font-semibold text-ink">Redeem codes</h2>
        <div className="flex items-center gap-3">
          {colleges && !collegeId && (
            <select
              value={selectedCollegeId}
              onChange={(e) => setSelectedCollegeId(e.target.value)}
              className="bg-surface border border-line rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            >
              {colleges.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          )}
          <Button icon={<Plus size={16} />} onClick={() => setModalOpen(true)} disabled={!effectiveCollegeId}>
            Generate code
          </Button>
        </div>
      </div>

      <Card className="p-2">
        {loading ? (
          <SkeletonTable rows={5} cols={6} />
        ) : (
          <DataTable columns={columns} rows={codes} emptyLabel="No redeem codes generated yet." />
        )}
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Generate a redeem code">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Class / year (optional)"
            placeholder="TE — leave blank for all classes"
            value={form.className}
            onChange={(e) => update("className", e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-ink-2 mb-1.5">Code</label>
            <div className="flex gap-2">
              <Input
                value={form.code}
                onChange={(e) => update("code", e.target.value.toUpperCase())}
                placeholder="Click suggest, then edit if you like"
              />
              <Button
                type="button"
                variant="secondary"
                isLoading={suggesting}
                icon={<RefreshCw size={14} />}
                onClick={suggestCode}
              >
                Suggest
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-2 mb-1.5">Plan</label>
              <select
                value={form.planKey}
                onChange={(e) => update("planKey", e.target.value)}
                className="w-full bg-surface/60 border border-line rounded-lg py-2.5 px-4 text-sm text-ink outline-none focus:border-accent"
              >
                <option value="basic">Basic (₹199)</option>
                <option value="pro">Pro (₹299)</option>
              </select>
            </div>
            <Input
              label="Max uses"
              type="number"
              min="1"
              required
              value={form.maxUses}
              onChange={(e) => update("maxUses", e.target.value)}
            />
          </div>

          <Input
            label="Expires on (optional)"
            type="date"
            value={form.expiresAt}
            onChange={(e) => update("expiresAt", e.target.value)}
          />

          <Button type="submit" className="w-full" size="lg" isLoading={submitting}>
            Create redeem code
          </Button>
        </form>
      </Modal>
    </div>
  );
}
