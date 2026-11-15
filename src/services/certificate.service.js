import api from "./api";

const certificateService = {
  generate: ({ sourceType, sourceId, score }) =>
    api.post("/certificates/generate", { sourceType, sourceId, score }).then((r) => r.data),
  getMy: () => api.get("/certificates/my").then((r) => r.data),
  // Public - no auth header needed, but the shared `api` instance is fine to reuse.
  verify: (slug) => api.get(`/certificates/verify/${slug}`).then((r) => r.data),
  // Proxied through our backend as a blob so the click always triggers a real file save,
  // regardless of the browser/Cloudinary-account quirks a direct cross-origin link can hit.
  download: (id) => api.get(`/certificates/${id}/download`, { responseType: "blob" }).then((r) => r.data),
};

export default certificateService;
