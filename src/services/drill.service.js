import api from "./api";

const drillService = {
  generate: (reportId) => api.post("/drills/generate", { reportId }).then((r) => r.data),
  getById: (id) => api.get(`/drills/${id}`).then((r) => r.data),
  submit: (id, answers) => api.post(`/drills/${id}/submit`, { answers }).then((r) => r.data),
  getHistory: (params) => api.get("/drills/my", { params }).then((r) => r.data),
};

export default drillService;
