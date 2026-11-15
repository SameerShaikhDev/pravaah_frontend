import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { AudioWaveform, Check, UploadCloud, FileText, CheckCircle2, Loader2, Ticket, CreditCard, Search } from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import PageLoader from "../components/common/PageLoader";
import { useAuth } from "../context/AuthContext";
import onboardingService from "../services/onboarding.service";
import resumeService from "../services/resume.service";
import planService from "../services/plan.service";
import redeemCodeService from "../services/redeemCode.service";
import paymentService from "../services/payment.service";
import authService from "../services/auth.service";
import jobRoleService from "../services/jobRole.service";
import { getErrorMessage } from "../utils/formatters";
import { loadRazorpayScript } from "../utils/razorpay";

const STEP_LABELS = {
  profile_details: "Your details",
  target_role_set: "Target role",
  resume_uploaded: "Resume",
  plan_selected: "Choose a plan",
  payment_pending: "Payment",
  completed: "Done",
};

export default function Onboarding() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState("profile_details");
  // The step sequence actually applicable to this user - resume_uploaded is dropped
  // entirely when their target role doesn't require one (set once target-role step runs).
  const [stepOrder, setStepOrder] = useState([
    "role_selected",
    "profile_details",
    "target_role_set",
    "resume_uploaded",
    "plan_selected",
    "payment_pending",
    "completed",
  ]);

  useEffect(() => {
    onboardingService
      .getStatus()
      .then((res) => {
        setStep(res.data.currentStep === "role_selected" ? "profile_details" : res.data.currentStep);
        if (Array.isArray(res.data.stepOrder)) setStepOrder(res.data.stepOrder);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  async function refreshMe() {
    const res = await authService.getMe();
    setUser(res.data.user);
  }

  // Recomputes which steps apply (skips resume_uploaded when resumeRequired is false) and
  // moves to the next one in that sequence.
  function goNext(justCompletedStep, resumeRequired) {
    let order = stepOrder;
    if (typeof resumeRequired === "boolean") {
      order = resumeRequired
        ? [
            "role_selected",
            "profile_details",
            "target_role_set",
            "resume_uploaded",
            "plan_selected",
            "payment_pending",
            "completed",
          ]
        : ["role_selected", "profile_details", "target_role_set", "plan_selected", "payment_pending", "completed"];
      setStepOrder(order);
    }
    const idx = order.indexOf(justCompletedStep);
    const next = idx >= 0 && idx + 1 < order.length ? order[idx + 1] : justCompletedStep;
    setStep(next);
  }

  if (loading) return <PageLoader label="Setting up your onboarding" />;

  const progressSteps = stepOrder.filter((s) => s !== "role_selected" && s !== "completed");
  const activeIndex = progressSteps.indexOf(step);

  return (
    <div className="min-h-dvh bg-radial-glow px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 font-display text-lg font-semibold text-ink mb-8">
          <span className="w-8 h-8 rounded-lg bg-pulse-gradient flex items-center justify-center">
            <AudioWaveform size={18} className="text-white" />
          </span>
          Pravaah
        </div>

        <div className="flex items-center gap-2 mb-2">
          {progressSteps.map((s, i) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div
                className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-medium ${
                  i < activeIndex
                    ? "bg-success text-white"
                    : i === activeIndex
                      ? "bg-action text-white"
                      : "bg-surface text-ink-4 border border-line"
                }`}
              >
                {i < activeIndex ? <Check size={14} /> : i + 1}
              </div>
              {i < progressSteps.length - 1 && <div className={`h-0.5 flex-1 ${i < activeIndex ? "bg-success" : "bg-line"}`} />}
            </div>
          ))}
        </div>
        <p className="text-xs text-ink-4 mb-6">{STEP_LABELS[step]}</p>

        <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {step === "profile_details" && <ProfileDetailsStep role={user?.role} onDone={() => goNext("profile_details")} />}
          {step === "target_role_set" && (
            <TargetRoleStep onDone={(resumeRequired) => goNext("target_role_set", resumeRequired)} />
          )}
          {step === "resume_uploaded" && <ResumeStep onDone={() => goNext("resume_uploaded")} />}
          {step === "plan_selected" && <PlanStep onDone={() => goNext("plan_selected")} />}
          {step === "payment_pending" && (
            <PaymentStep
              onDone={async () => {
                await refreshMe();
                toast.success("You're all set! Let's get started.");
                navigate("/dashboard", { replace: true });
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}

function StepShell({ title, subtitle, children }) {
  return (
    <Card className="p-8">
      <h1 className="font-display text-xl font-semibold text-ink mb-1.5">{title}</h1>
      {subtitle && <p className="text-sm text-ink-3 mb-6">{subtitle}</p>}
      {children}
    </Card>
  );
}

function ProfileDetailsStep({ role, onDone }) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(
    role === "professional"
      ? { surname: "", companyName: "", designation: "", yearsOfExperience: "" }
      : role === "other"
        ? { surname: "", currentStatus: "", bio: "" }
        : { surname: "", collegeCode: "", rollNo: "", className: "", degree: "", graduationYear: "" },
  );

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onboardingService.submitProfileDetails(form);
      onDone();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const title =
    role === "professional"
      ? "Tell us about your work"
      : role === "other"
        ? "Tell us a bit about you"
        : "Tell us about your college";
  const subtitle =
    role === "professional"
      ? "This helps us tailor mock interviews to your career stage."
      : role === "other"
        ? "No pressure here — just enough context to personalize your prep."
        : "Ask your TPO for your college's registration code if you don't have it.";

  return (
    <StepShell title={title} subtitle={subtitle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Surname" placeholder="Sharma" value={form.surname} onChange={(e) => update("surname", e.target.value)} />

        {role === "professional" && (
          <>
            <Input
              label="Company name"
              placeholder="TCS, Infosys, a startup..."
              required
              value={form.companyName}
              onChange={(e) => update("companyName", e.target.value)}
            />
            <Input
              label="Designation"
              placeholder="Software Engineer"
              required
              value={form.designation}
              onChange={(e) => update("designation", e.target.value)}
            />
            <Input
              label="Years of experience"
              type="number"
              min="0"
              placeholder="2"
              value={form.yearsOfExperience}
              onChange={(e) => update("yearsOfExperience", e.target.value)}
            />
          </>
        )}

        {role === "other" && (
          <>
            <Input
              label="What best describes you right now?"
              placeholder="e.g. Preparing for SSC CGL, Freelance designer, On a career break"
              value={form.currentStatus}
              onChange={(e) => update("currentStatus", e.target.value)}
            />
            <div>
              <label className="text-sm text-ink-2 mb-1.5 block">Short bio (optional)</label>
              <textarea
                className="w-full rounded-lg glass px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 outline-none focus:border-accent border border-line resize-none"
                rows={3}
                maxLength={500}
                placeholder="A line or two about your background or goals."
                value={form.bio}
                onChange={(e) => update("bio", e.target.value)}
              />
            </div>
          </>
        )}

        {role === "student" && (
          <>
            <Input
              label="College registration code"
              placeholder="e.g. SANGAM"
              required
              value={form.collegeCode}
              onChange={(e) => update("collegeCode", e.target.value.toUpperCase())}
              hint="Given by your TPO when your college was registered."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Roll / register no."
                placeholder="21CS045"
                required
                value={form.rollNo}
                onChange={(e) => update("rollNo", e.target.value)}
              />
              <Input
                label="Class / year"
                placeholder="TE / BE / 2026"
                required
                value={form.className}
                onChange={(e) => update("className", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Degree (optional)"
                placeholder="B.Sc. CS"
                value={form.degree}
                onChange={(e) => update("degree", e.target.value)}
              />
              <Input
                label="Graduation year (optional)"
                type="number"
                placeholder="2026"
                value={form.graduationYear}
                onChange={(e) => update("graduationYear", e.target.value)}
              />
            </div>
          </>
        )}

        <Button type="submit" className="w-full" size="lg" isLoading={submitting}>
          Continue
        </Button>
      </form>
    </StepShell>
  );
}

// Cascading Category -> Sub-category -> Role picker backed by the JobRole catalog, with a
// free-text search fallback (searchable combobox) for anyone who'd rather just type.
function TargetRoleStep({ onDone }) {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [roles, setRoles] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    jobRoleService
      .listCategories()
      .then((res) => setCategories(res.data.categories || []))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoadingCats(false));
  }, []);

  useEffect(() => {
    if (!category) {
      setSubCategories([]);
      setSubCategory("");
      return;
    }
    jobRoleService
      .listSubCategories(category)
      .then((res) => setSubCategories(res.data.subCategories || []))
      .catch((err) => toast.error(getErrorMessage(err)));
  }, [category]);

  useEffect(() => {
    if (!category) {
      setRoles([]);
      return;
    }
    jobRoleService
      .listRoles({ category, subCategory: subCategory || undefined })
      .then((res) => setRoles(res.data.roles || []))
      .catch((err) => toast.error(getErrorMessage(err)));
  }, [category, subCategory]);

  useEffect(() => {
    if (!search.trim() || search.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const handle = setTimeout(() => {
      jobRoleService
        .listRoles({ search: search.trim() })
        .then((res) => setSearchResults(res.data.roles || []))
        .catch(() => {});
    }, 300);
    return () => clearTimeout(handle);
  }, [search]);

  async function submitRole(title) {
    if (!title || !title.trim()) return toast.error("Pick or search for the role/exam you're preparing for.");
    setSubmitting(true);
    try {
      const res = await onboardingService.setTargetRole(title.trim());
      onDone(res.data.resumeRequired);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <StepShell title="What are you preparing for?" subtitle="Browse the catalog, or search across every role directly.">
      <div className="space-y-5">
        <div>
          <label className="text-sm text-ink-2 mb-1.5 block">Search roles</label>
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-4" />
            <input
              className="w-full rounded-lg glass pl-10 pr-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 outline-none focus:border-accent border border-line"
              placeholder="e.g. KYC Analyst, SSC CGL, Data Scientist..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {searchResults.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {searchResults.slice(0, 12).map((r) => (
                <button
                  type="button"
                  key={r._id}
                  onClick={() => submitRole(r.title)}
                  className="px-3 py-1.5 rounded-full text-xs glass text-ink-2 hover:bg-ink/5"
                >
                  {r.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-px bg-line" />

        {loadingCats ? (
          <Loader2 className="animate-spin mx-auto text-ink-4" />
        ) : (
          <>
            <div>
              <label className="text-sm text-ink-2 mb-1.5 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    type="button"
                    key={c.category}
                    onClick={() => {
                      setCategory(c.category);
                      setSelectedRole("");
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                      category === c.category
                        ? "bg-accent/20 text-accent-hi border border-accent"
                        : "glass text-ink-2 hover:bg-ink/5"
                    }`}
                  >
                    {c.categoryLabel}
                  </button>
                ))}
              </div>
            </div>

            {subCategories.length > 0 && (
              <div>
                <label className="text-sm text-ink-2 mb-1.5 block">Sub-category</label>
                <div className="flex flex-wrap gap-2">
                  {subCategories.map((sc) => (
                    <button
                      type="button"
                      key={sc.subCategory}
                      onClick={() => setSubCategory(sc.subCategory === subCategory ? "" : sc.subCategory)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                        subCategory === sc.subCategory
                          ? "bg-accent/20 text-accent-hi border border-accent"
                          : "glass text-ink-2 hover:bg-ink/5"
                      }`}
                    >
                      {sc.subCategoryLabel}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {roles.length > 0 && (
              <div>
                <label className="text-sm text-ink-2 mb-1.5 block">Role</label>
                <div className="max-h-56 overflow-y-auto grid gap-1.5 pr-1">
                  {roles.map((r) => (
                    <button
                      type="button"
                      key={r._id}
                      onClick={() => setSelectedRole(r.title)}
                      className={`text-left px-3.5 py-2.5 rounded-lg text-sm transition-colors border ${
                        selectedRole === r.title ? "border-accent bg-accent/10 text-ink" : "border-line text-ink-2 hover:bg-ink/5"
                      }`}
                    >
                      {r.title}
                      {r.requiresResume === false && (
                        <span className="ml-2 text-[10px] uppercase tracking-wide text-success">No resume needed</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <Button
          className="w-full"
          size="lg"
          isLoading={submitting}
          disabled={!selectedRole}
          onClick={() => submitRole(selectedRole)}
        >
          Continue{selectedRole ? ` with "${selectedRole}"` : ""}
        </Button>
      </div>
    </StepShell>
  );
}

function ResumeStep({ onDone }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  }

  async function handleUpload() {
    if (!file) return toast.error("Choose a resume file first.");
    setUploading(true);
    try {
      const res = await resumeService.upload(file, setProgress);
      await onboardingService.markResumeUploaded(res.data.resume._id);
      toast.success("Resume uploaded and parsed.");
      onDone();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  return (
    <StepShell title="Upload your resume" subtitle="We'll use it to tailor interview questions to your skills and target role.">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-xl2 p-10 text-center transition-colors ${dragOver ? "border-accent bg-accent/5" : "border-line"}`}
      >
        {file ? (
          <CheckCircle2 className="mx-auto text-success mb-4" size={32} />
        ) : (
          <UploadCloud className="mx-auto text-ink-4 mb-4" size={32} />
        )}
        <p className="text-sm text-ink-2 mb-1">{file ? file.name : "Drag and drop your resume here"}</p>
        <p className="text-xs text-ink-4 mb-5">PDF, up to 5MB</p>
        <label className="inline-block cursor-pointer">
          <span className="px-4 py-2 rounded-lg glass text-sm text-ink hover:bg-ink/5">Browse files</span>
          <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>
      </div>

      {uploading && (
        <div className="mt-5 h-1.5 rounded-full bg-line overflow-hidden">
          <div className="h-full bg-pulse-gradient transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}

      <Button className="w-full mt-6" size="lg" isLoading={uploading} onClick={handleUpload} icon={<FileText size={16} />}>
        Upload &amp; continue
      </Button>
    </StepShell>
  );
}

function PlanStep({ onDone }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(null);

  useEffect(() => {
    planService
      .list()
      .then((res) => setPlans(res.data.plans))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  async function choosePlan(plan) {
    setSelecting(plan._id);
    try {
      await onboardingService.selectPlan(plan._id);
      onDone();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setSelecting(null);
    }
  }

  if (loading) {
    return (
      <StepShell title="Choose your plan">
        <Loader2 className="animate-spin mx-auto text-ink-4" />
      </StepShell>
    );
  }

  return (
    <StepShell
      title="Choose your plan"
      subtitle="You can pay online or use a redeem code from your college/TPO on the next step."
    >
      <div className="grid sm:grid-cols-2 gap-4">
        {plans.map((plan) => (
          <div key={plan._id} className="rounded-xl2 border border-line p-5 flex flex-col">
            <p className="font-display text-lg font-semibold text-ink">{plan.name}</p>
            <p className="text-2xl font-semibold text-ink mt-1 mb-3">
              ₹{plan.price}
              <span className="text-sm text-ink-4 font-normal"> / {plan.durationDays} days</span>
            </p>
            <ul className="space-y-1.5 mb-5 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="text-xs text-ink-3 flex items-start gap-1.5">
                  <Check size={13} className="text-success mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Button
              variant={plan.key === "pro" ? "primary" : "secondary"}
              isLoading={selecting === plan._id}
              onClick={() => choosePlan(plan)}
            >
              Choose {plan.name}
            </Button>
          </div>
        ))}
      </div>
    </StepShell>
  );
}

function PaymentStep({ onDone }) {
  const [mode, setMode] = useState("online");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    planService
      .list()
      .then((res) => setPlans(res.data.plans))
      .catch(() => {});
  }, []);

  async function payOnline(planKey) {
    setSubmitting(true);
    try {
      const scriptOk = await loadRazorpayScript();
      if (!scriptOk) throw new Error("Could not load payment gateway. Check your connection and try again.");

      const orderRes = await paymentService.createOrder(planKey);
      const { orderId, amount, currency, keyId } = orderRes.data;

      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        order_id: orderId,
        name: "Pravaah",
        description: "Interview prep plan",
        theme: { color: "#7c3aed" },
        handler: async (response) => {
          try {
            await paymentService.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            onDone();
          } catch (err) {
            toast.error(getErrorMessage(err));
          } finally {
            setSubmitting(false);
          }
        },
        modal: { ondismiss: () => setSubmitting(false) },
      });
      rzp.on("payment.failed", () => {
        toast.error("Payment failed. You can try again anytime.");
        setSubmitting(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setSubmitting(false);
    }
  }

  async function redeem(e) {
    e.preventDefault();
    if (!code.trim()) return toast.error("Enter your redeem code.");
    setSubmitting(true);
    try {
      await redeemCodeService.redeem(code.trim());
      onDone();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <StepShell title="Activate your plan" subtitle="Pay online, or enter a redeem code if your college/TPO gave you one.">
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => setMode("online")}
          className={`flex flex-col items-center gap-2 rounded-xl2 border p-3 sm:p-4 text-sm transition-colors ${mode === "online" ? "border-accent bg-accent/10 text-ink" : "border-line text-ink-3"}`}
        >
          <CreditCard size={20} /> Pay online
        </button>
        <button
          type="button"
          onClick={() => setMode("redeem")}
          className={`flex flex-col items-center gap-2 rounded-xl2 border p-3 sm:p-4 text-sm transition-colors ${mode === "redeem" ? "border-accent bg-accent/10 text-ink" : "border-line text-ink-3"}`}
        >
          <Ticket size={20} /> Redeem code
        </button>
      </div>

      {mode === "online" ? (
        <div className="space-y-3">
          {plans.map((plan) => (
            <Button
              key={plan._id}
              variant="secondary"
              className="w-full justify-between"
              isLoading={submitting}
              onClick={() => payOnline(plan.key)}
            >
              <span>
                Pay ₹{plan.price} for {plan.name}
              </span>
            </Button>
          ))}
        </div>
      ) : (
        <form onSubmit={redeem} className="space-y-4">
          <Input
            label="Redeem code"
            placeholder="e.g. SANGAM-TE-7K3QX"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
          <Button type="submit" className="w-full" size="lg" isLoading={submitting}>
            Apply code
          </Button>
        </form>
      )}
    </StepShell>
  );
}
