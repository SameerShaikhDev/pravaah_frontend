/**
 * Loads Razorpay's Checkout script once (window.Razorpay is idempotent-checked), shared by
 * every flow that opens the Razorpay widget - the student onboarding payment step
 * (Onboarding.jsx) and the TPO bulk seat purchase (tpo/TpoBuySeats.jsx) - so there's exactly
 * one place that knows how to load the SDK.
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
