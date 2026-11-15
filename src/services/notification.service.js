import api from "./api";

const notificationService = {
  getMine: (params) => api.get("/notifications", { params }).then((r) => r.data),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`).then((r) => r.data),
  markAllAsRead: () => api.patch("/notifications/read-all").then((r) => r.data),
};

export default notificationService;
