import api from "./api";

const onboardingService = {
  getStatus: () => api.get("/onboarding/status").then((r) => r.data),
  submitProfileDetails: (payload) => api.post("/onboarding/profile-details", payload).then((r) => r.data),
  markResumeUploaded: (resumeId) => api.post("/onboarding/resume-uploaded", { resumeId }).then((r) => r.data),
  setTargetRole: (targetRole) => api.post("/onboarding/target-role", { targetRole }).then((r) => r.data),
  selectPlan: (planId) => api.post("/onboarding/select-plan", { planId }).then((r) => r.data),
};

export default onboardingService;
