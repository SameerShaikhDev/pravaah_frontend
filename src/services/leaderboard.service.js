import api from "./api";

const leaderboardService = {
  getTop: (params) => api.get("/leaderboard/top", { params }).then((r) => r.data),
  getMyRank: () => api.get("/leaderboard/my-rank").then((r) => r.data),
};

export default leaderboardService;
