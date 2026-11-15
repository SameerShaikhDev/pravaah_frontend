import api from "./api";

const tpoService = {
  getMyStudents: (params) => api.get("/tpo/students", { params }).then((r) => r.data),
  getDashboard: () => api.get("/tpo/dashboard").then((r) => r.data),
  createSeatOrder: ({ planKey, seatCount }) => api.post("/tpo/seat-orders", { planKey, seatCount }).then((r) => r.data),
  listSeatOrders: (params) => api.get("/tpo/seat-orders", { params }).then((r) => r.data),
  getSeatOrderUsage: (id) => api.get(`/tpo/seat-orders/${id}/usage`).then((r) => r.data),
};

export default tpoService;
