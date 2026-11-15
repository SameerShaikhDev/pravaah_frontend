import api from "./api";

const jobRoleService = {
  listCategories: () => api.get("/job-roles/categories").then((r) => r.data),
  listSubCategories: (category) =>
    api.get(`/job-roles/categories/${encodeURIComponent(category)}/sub-categories`).then((r) => r.data),
  listRoles: (params) => api.get("/job-roles", { params }).then((r) => r.data),
};

export default jobRoleService;
