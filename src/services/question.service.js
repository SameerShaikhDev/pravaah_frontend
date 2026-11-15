import api from "./api";

const questionService = {
  getAll: (params) => api.get("/questions", { params }).then((r) => r.data),
  getById: (id) => api.get(`/questions/${id}`).then((r) => r.data),
  create: (payload) => api.post("/questions", payload).then((r) => r.data),
  update: (id, payload) => api.put(`/questions/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/questions/${id}`).then((r) => r.data),
};

export default questionService;
