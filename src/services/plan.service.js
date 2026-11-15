import api from "./api";

const planService = {
  list: () => api.get("/plans").then((r) => r.data),
  update: (key, payload) => api.patch(`/plans/${key}`, payload).then((r) => r.data),
};

export default planService;
