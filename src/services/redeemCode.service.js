import api from "./api";

const redeemCodeService = {
  suggest: (params) => api.get("/redeem-codes/suggest", { params }).then((r) => r.data),
  create: (payload) => api.post("/redeem-codes", payload).then((r) => r.data),
  list: (params) => api.get("/redeem-codes", { params }).then((r) => r.data),
  revoke: (id) => api.patch(`/redeem-codes/${id}/revoke`).then((r) => r.data),
  redeem: (code) => api.post("/redeem-codes/redeem", { code }).then((r) => r.data),
};

export default redeemCodeService;
