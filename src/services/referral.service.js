import api from "./api";

const referralService = {
  getMyCode: () => api.get("/referrals/my-code").then((r) => r.data),
  getMyReferrals: (params) => api.get("/referrals/my-referrals", { params }).then((r) => r.data),
};

export default referralService;
