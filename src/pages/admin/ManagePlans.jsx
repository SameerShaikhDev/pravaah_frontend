import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Badge from "../../components/common/Badge";
import PageLoader from "../../components/common/PageLoader";
import planService from "../../services/plan.service";
import { getErrorMessage } from "../../utils/formatters";

// Machine-readable feature flags introduced by the monetization pack - kept in sync with
// backend constants/plans.js PLAN_FEATURE_FLAGS. Every new paid capability should be
// expressible here so it can be toggled per plan without a redeploy.
const FEATURE_FLAGS = [
  { key: "resume_builder", label: "AI Resume Builder + ATS suggestions" },
  { key: "weak_area_drills", label: "Weak-area targeted drills" },
  { key: "proctored_mode", label: "Proctored exam mode" },
];

export default function ManagePlans() {
  const [plans, setPlans] = useState(null);
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    planService
      .list()
      .then((res) => setPlans(res.data.plans || []))
      .catch((err) => {
        toast.error(getErrorMessage(err));
        setPlans([]);
      });
  }, []);

  if (plans === null) return <PageLoader label="Loading plans" />;

  function toggleFlag(planKey, flag) {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.key !== planKey) return p;
        const has = p.features.includes(flag);
        return { ...p, features: has ? p.features.filter((f) => f !== flag) : [...p.features, flag] };
      }),
    );
  }

  function updatePrice(planKey, price) {
    setPlans((prev) => prev.map((p) => (p.key === planKey ? { ...p, price: Number(price) } : p)));
  }

  async function handleSave(plan) {
    setSaving(plan.key);
    try {
      await planService.update(plan.key, { price: plan.price, features: plan.features });
      toast.success(`${plan.name} plan updated.`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-ink mb-1">Manage plans</h2>
        <p className="text-sm text-ink-4">Edit pricing and toggle which premium features each plan unlocks.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <Card key={plan.key} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-ink">{plan.name}</h3>
              <Badge tone="violet">{plan.key}</Badge>
            </div>

            <Input label="Price (₹)" type="number" value={plan.price} onChange={(e) => updatePrice(plan.key, e.target.value)} />

            <div>
              <p className="text-sm font-medium text-ink-2 mb-2">Premium features</p>
              <div className="space-y-2">
                {FEATURE_FLAGS.map((f) => (
                  <label key={f.key} className="flex items-center gap-2.5 text-sm text-ink-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={plan.features.includes(f.key)}
                      onChange={() => toggleFlag(plan.key, f.key)}
                      className="accent-accent w-4 h-4"
                    />
                    {f.label}
                  </label>
                ))}
              </div>
            </div>

            <Button size="sm" icon={<Save size={14} />} isLoading={saving === plan.key} onClick={() => handleSave(plan)}>
              Save changes
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
