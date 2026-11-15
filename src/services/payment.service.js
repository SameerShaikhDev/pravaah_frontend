import api from "./api";

const paymentService = {
  createOrder: (planKey) => api.post("/payments/create-order", { planKey }).then((r) => r.data),
  verify: (payload) => api.post("/payments/verify", payload).then((r) => r.data),
  // Same verify endpoint, extended with an optional seatOrderId (see tpo.service.createSeatOrder
  // for the create-side counterpart) - keeps Razorpay checkout-open logic reusable for both flows.
  verifySeatOrder: (payload, seatOrderId) => api.post("/payments/verify", { ...payload, seatOrderId }).then((r) => r.data),
};

export default paymentService;
