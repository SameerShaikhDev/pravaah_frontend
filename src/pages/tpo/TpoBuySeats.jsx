import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Users, IndianRupee, Ticket, Copy, Check } from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import planService from "../../services/plan.service";
import tpoService from "../../services/tpo.service";
import paymentService from "../../services/payment.service";
import { loadRazorpayScript } from "../../utils/razorpay";
import { getErrorMessage } from "../../utils/formatters";

/** Reuses the exact same Razorpay checkout-open pattern as Onboarding.jsx's PaymentStep,
 * via the shared loadRazorpayScript util - same widget, just paying for seatCount seats
 * instead of one plan for one user. */
export default function TpoBuySeats() {
  const [plans, setPlans] = useState([]);
  const [planKey, setPlanKey] = useState(null);
  const [seatCount, setSeatCount] = useState(50);
  const [submitting, setSubmitting] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    planService
      .list()
      .then((res) => {
        setPlans(res.data.plans || []);
        if (res.data.plans?.length) setPlanKey(res.data.plans[0].key);
      })
      .catch((err) => toast.error(getErrorMessage(err)));
  }, []);

  const selectedPlan = plans.find((p) => p.key === planKey);
  const total = selectedPlan ? selectedPlan.price * Number(seatCount || 0) : 0;

  async function handleBuy() {
    if (!planKey || !seatCount || seatCount < 1) return toast.error("Pick a plan and enter a valid seat count.");
    setSubmitting(true);
    try {
      const scriptOk = await loadRazorpayScript();
      if (!scriptOk) throw new Error("Could not load payment gateway. Check your connection and try again.");

      const orderRes = await tpoService.createSeatOrder({ planKey, seatCount: Number(seatCount) });
      const { orderId, amount, currency, keyId, seatOrderId } = orderRes.data;

      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        order_id: orderId,
        name: "Pravaah",
        description: `${seatCount} seats - ${selectedPlan?.name}`,
        theme: { color: "#7c3aed" },
        handler: async (response) => {
          try {
            await paymentService.verifySeatOrder(
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              seatOrderId,
            );
            const usage = await tpoService.getSeatOrderUsage(seatOrderId);
            setGeneratedCode(usage.data.code);
            toast.success("Seats purchased! Your redeem code is ready.");
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

  function handleCopy() {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast.success("Code copied!");
    setTimeout(() => setCopied(false), 2000);
  }

  if (generatedCode) {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <Card className="p-8 text-center space-y-4">
          <Ticket size={36} className="mx-auto text-success" />
          <h2 className="font-display text-xl font-semibold text-ink">Seats activated!</h2>
          <p className="text-sm text-ink-4">Share this code with your students - it can be redeemed {seatCount} times.</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-lg font-mono px-4 py-3 rounded-lg bg-surface-2 border border-line text-ink tracking-wide">
              {generatedCode}
            </code>
            <button
              onClick={handleCopy}
              className="shrink-0 w-11 h-11 rounded-lg glass border border-line flex items-center justify-center text-ink-2 hover:bg-surface-2"
            >
              {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
            </button>
          </div>
          <Button variant="secondary" onClick={() => setGeneratedCode(null)}>
            Buy more seats
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-ink mb-1.5">Buy bulk seats</h2>
        <p className="text-sm text-ink-4">
          Purchase a batch of seats for your college - you'll get one redeem code your students can all use.
        </p>
      </div>

      <Card className="p-6 space-y-5">
        <div>
          <p className="text-sm font-medium text-ink-2 mb-2">Choose a plan</p>
          <div className="grid grid-cols-2 gap-3">
            {plans.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setPlanKey(p.key)}
                className={`text-left rounded-xl2 border p-3 sm:p-4 transition-colors ${
                  planKey === p.key ? "border-accent bg-accent/10" : "border-line hover:border-ink-4"
                }`}
              >
                <p className="text-sm font-medium text-ink">{p.name}</p>
                <p className="text-xs text-ink-4">₹{p.price} / seat</p>
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Number of seats"
          type="number"
          min={1}
          max={2000}
          icon={<Users size={16} />}
          value={seatCount}
          onChange={(e) => setSeatCount(e.target.value)}
        />

        <div className="flex items-center justify-between pt-3 border-t border-line">
          <span className="text-sm text-ink-3">Total</span>
          <span className="flex items-center gap-1 font-display text-xl font-semibold text-ink">
            <IndianRupee size={18} />
            {total.toLocaleString("en-IN")}
          </span>
        </div>

        <Button className="w-full" size="lg" isLoading={submitting} onClick={handleBuy}>
          Pay & activate seats
        </Button>
      </Card>
    </div>
  );
}
