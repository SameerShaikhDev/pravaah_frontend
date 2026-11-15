import React, { useEffect, useState } from "react";
import { Gift, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import Card from "../common/Card";
import referralService from "../../services/referral.service";
import { getErrorMessage } from "../../utils/formatters";

/** Compact by default (Dashboard); pass `detailed` for the fuller Settings.jsx version with
 * a referral history list. */
export default function ReferralCard({ detailed = false }) {
  const [data, setData] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    referralService
      .getMyCode()
      .then((res) => setData(res.data))
      .catch((err) => toast.error(getErrorMessage(err)));

    if (detailed) {
      referralService
        .getMyReferrals()
        .then((res) => setReferrals(res.data.referrals || []))
        .catch(() => {});
    }
  }, [detailed]);

  if (!data) return null;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(data.shareLink);
    } catch {
      // Clipboard API is unavailable on non-HTTPS / some mobile webviews - fall back to execCommand
      const t = document.createElement("textarea");
      t.value = data.shareLink;
      t.style.cssText = "position:fixed;opacity:0;font-size:16px";
      document.body.appendChild(t);
      t.select();
      try { document.execCommand("copy"); } catch { /* ignore */ }
      t.remove();
    }
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
          <Gift size={18} className="text-accent-hi" />
        </span>
        <div>
          <h3 className="font-display font-semibold text-ink">Refer & Earn</h3>
          <p className="text-sm text-ink-4">Give a friend a free credit, get one yourself when they finish their first test.</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <code className="flex-1 text-sm px-3 py-2 rounded-lg bg-surface-2 border border-line text-ink-2 truncate">
          {data.shareLink}
        </code>
        <button
          onClick={handleCopy}
          className="shrink-0 w-9 h-9 rounded-lg glass border border-line flex items-center justify-center text-ink-2 hover:bg-surface-2 transition-colors"
        >
          {copied ? <Check size={15} className="text-success" /> : <Copy size={15} />}
        </button>
      </div>

      <p className="text-xs text-ink-4">
        Credits earned so far: <span className="text-ink font-medium">{data.referralCreditsEarned}</span>
      </p>

      {detailed && (
        <div className="pt-2 border-t border-line space-y-2">
          <p className="text-xs text-ink-4 uppercase tracking-wide">Referral history</p>
          {referrals.length === 0 ? (
            <p className="text-sm text-ink-4">No referrals yet — share your link to get started.</p>
          ) : (
            referrals.map((r) => (
              <div key={r._id} className="flex items-center justify-between text-sm">
                <span className="text-ink-2">{r.referredUser?.name || "A friend"}</span>
                <span className={r.status === "rewarded" ? "text-success" : "text-ink-4"}>
                  {r.status === "rewarded" ? "Credit earned" : "Pending first test"}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </Card>
  );
}
