import api from "./api";

const adminService = {
  getAllStudents: (params) => api.get("/admin/students", { params }).then((r) => r.data),
  getAllProfessionals: (params) => api.get("/admin/professionals", { params }).then((r) => r.data),
  getStudentById: (id) => api.get(`/admin/students/${id}`).then((r) => r.data),
  deactivateStudent: (id) => api.patch(`/admin/students/${id}/deactivate`).then((r) => r.data),
  activateStudent: (id) => api.patch(`/admin/students/${id}/activate`).then((r) => r.data),
  getAllInterviews: (params) => api.get("/admin/interviews", { params }).then((r) => r.data),
  getDashboard: () => api.get("/admin/dashboard").then((r) => r.data),
  getAnalytics: () => api.get("/analytics/dashboard").then((r) => r.data),
  getStudentGrowth: (params) => api.get("/analytics/student-growth", { params }).then((r) => r.data),
};

export default adminService;
