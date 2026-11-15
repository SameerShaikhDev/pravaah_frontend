import api from "./api";

const collegeService = {
  create: (payload) => api.post("/colleges", payload).then((r) => r.data),
  list: (params) => api.get("/colleges", { params }).then((r) => r.data),
};

export default collegeService;
