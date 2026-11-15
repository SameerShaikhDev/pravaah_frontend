import api from "./api";

const codingService = {
  getQuestions: (params) => api.get("/coding/questions", { params }).then((r) => r.data),
  getQuestionById: (id) => api.get(`/coding/questions/${id}`).then((r) => r.data),
  createQuestion: (payload) => api.post("/coding/questions", payload).then((r) => r.data),
  runCode: (payload) => api.post("/coding/run", payload).then((r) => r.data),
  saveCode: (questionId, payload) =>
    api.post(`/coding/questions/${questionId}/save`, payload).then((r) => r.data),
  submitCode: (questionId, payload) =>
    api.post(`/coding/questions/${questionId}/submit`, payload).then((r) => r.data),
  getSubmissionHistory: (params) => api.get("/coding/submissions", { params }).then((r) => r.data),
};

export default codingService;
