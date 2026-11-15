import api from "./api";

const resumeService = {
  upload: (file, onProgress) => {
    const form = new FormData();
    form.append("resume", file);
    return api
      .post("/resumes/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          if (onProgress && evt.total) {
            onProgress(Math.round((evt.loaded / evt.total) * 100));
          }
        },
      })
      .then((r) => r.data);
  },
  getMine: () => api.get("/resumes/my").then((r) => r.data),
  getLatest: () => api.get("/resumes/latest").then((r) => r.data),
  getById: (id) => api.get(`/resumes/${id}`).then((r) => r.data),
  remove: (id) => api.delete(`/resumes/${id}`).then((r) => r.data),
  getAts: (id) => api.get(`/resumes/${id}/ats`).then((r) => r.data),
  saveBuilderDraft: (id, draft, templateId) => api.put(`/resumes/${id}/builder`, { draft, templateId }).then((r) => r.data),
  exportBuilder: (id) => api.get(`/resumes/${id}/builder/export`, { responseType: "blob" }).then((r) => r.data),
};

export default resumeService;
