import api from "./api";

const aptitudeService = {
  // First-time creation for a given category/difficulty can trigger an AI question-generation
  // call on the backend (a few seconds to ~30-40s incl. retries/fallback). Give it a generous
  // explicit timeout here instead of relying on axios's default (0 = no timeout, which just
  // hangs) or letting an unrelated platform/proxy timeout kill it with a confusing error.
  createTest: ({ targetRole, difficulty, part = 1, proctored = false }) =>
    api.post("/aptitude/tests", { targetRole, difficulty, part, proctored }, { timeout: 60000 }).then((r) => r.data),
  getTest: (id) => api.get(`/aptitude/tests/${id}`).then((r) => r.data),
  answer: (id, { questionOrder, selectedOptionIndex, timeTakenSec }) =>
    api.post(`/aptitude/tests/${id}/answer`, { questionOrder, selectedOptionIndex, timeTakenSec }).then((r) => r.data),
  logProctorEvent: (id, type) => api.post(`/aptitude/tests/${id}/proctor-event`, { type }).then((r) => r.data),
  submit: (id) => api.post(`/aptitude/tests/${id}/submit`).then((r) => r.data),
  getReport: (id) => api.get(`/aptitude/tests/${id}/report`).then((r) => r.data),
  getLeaderboard: (limit = 20) => api.get("/aptitude/leaderboard", { params: { limit } }).then((r) => r.data),
  getHistory: (params) => api.get("/aptitude/my", { params }).then((r) => r.data),
};

export default aptitudeService;
