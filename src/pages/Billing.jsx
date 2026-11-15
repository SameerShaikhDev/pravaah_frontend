import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CreditCard, Ticket, Check } from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { SkeletonCard } from "../components/common/Skeleton";
import { useAuth } from "../context/AuthContext";
import planService from "../services/plan.service";
import paymentService from "../services/payment.service";
import redeemCodeService from "../services/redeemCode.service";
import authService from "../services/auth.service";
import { loadRazorpayScript } from "../utils/razorpay";
import { getErrorMessage } from "../utils/formatters";

/** Standalone renew/upgrade flow, reachable from Profile.jsx's "Your Plan" card - same
 * Razorpay checkout pattern as Onboarding.jsx's PaymentStep, but usable any time after
 * onboarding (renewal, mid-cycle upgrade), not just once at signup. */
export default function Billing() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [mode, setMode] = useState("online");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    planService
      .list()
      .then((res) => setPlans(res.data.plans || []))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  async function refreshUser() {
    try {
      const res = await authService.getMe();
      setUser(res.data.user);
    } catch {
      // non-fatal - the payment already succeeded, just skip the local refresh
    }
  }

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
        description: "Renew / upgrade plan",
        theme: { color: "#7c3aed" },
        handler: async (response) => {
          try {
            await paymentService.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            await refreshUser();
            toast.success("Plan activated!");
            navigate("/profile");
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
      await refreshUser();
      toast.success("Code redeemed — your plan is active!");
      navigate("/profile");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <SkeletonCard />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-ink mb-1.5">Renew or upgrade your plan</h2>
        <p className="text-sm text-ink-4">Pay online, or enter a redeem code if your college/TPO gave you one.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
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
        <div className="grid sm:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <Card key={plan.key} className="p-6 space-y-4">
              <div>
                <h3 className="font-display font-semibold text-ink">{plan.name}</h3>
                <p className="text-2xl font-display font-semibold text-ink mt-1">
                  ₹{plan.price}
                  <span className="text-sm text-ink-4 font-normal">/{plan.durationDays} days</span>
                </p>
              </div>
              <ul className="space-y-1.5">
                {plan.features
                  ?.filter((f) => !f.includes("_"))
                  .map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-ink-3">
                      <Check size={13} className="text-success mt-0.5 shrink-0" /> {f}
                    </li>
                  ))}
              </ul>
              <Button className="w-full" isLoading={submitting} onClick={() => payOnline(plan.key)}>
                Choose {plan.name}
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6">
          <form onSubmit={redeem} className="space-y-4">
            <Input
              label="Redeem code"
              placeholder="e.g. XYZCOLLEGE-SEATS-AB12C"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button type="submit" className="w-full" isLoading={submitting}>
              Redeem
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
