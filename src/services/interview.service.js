import api from "./api";

const interviewService = {
  create: (payload) => api.post("/interviews", payload).then((r) => r.data),
  getMine: (params) => api.get("/interviews/my", { params }).then((r) => r.data),
  getById: (id) => api.get(`/interviews/${id}`).then((r) => r.data),
  start: (id) => api.post(`/interviews/${id}/start`).then((r) => r.data),
  submitAnswer: (id, payload) => api.post(`/interviews/${id}/answer`, payload).then((r) => r.data),
  end: (id) => api.post(`/interviews/${id}/end`).then((r) => r.data),
  getReportStatus: (id) => api.get(`/interviews/${id}/report-status`).then((r) => r.data),
};

export default interviewService;
