import api from "./api";

const authService = {
  register: (payload) => api.post("/auth/register", payload).then((r) => r.data),
  login: (payload) => api.post("/auth/login", payload).then((r) => r.data),
  logout: () => api.post("/auth/logout").then((r) => r.data),
  refreshToken: () => api.post("/auth/refresh-token").then((r) => r.data),
  sendOtp: (payload) => api.post("/auth/send-otp", payload).then((r) => r.data),
  verifyOtp: (payload) => api.post("/auth/verify-otp", payload).then((r) => r.data),
  forgotPassword: (payload) => api.post("/auth/forgot-password", payload).then((r) => r.data),
  resetPassword: (payload) => api.post("/auth/reset-password", payload).then((r) => r.data),
  getMe: () => api.get("/auth/me").then((r) => r.data),
  getPlanSummary: () => api.get("/auth/me/plan-summary").then((r) => r.data),
  changePassword: (payload) => api.post("/auth/change-password", payload).then((r) => r.data),
};

export default authService;
