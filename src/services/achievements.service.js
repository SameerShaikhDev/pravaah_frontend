import api from "./api";

const achievementsService = {
  getMy: () => api.get("/achievements/my").then((r) => r.data),
};

export default achievementsService;
