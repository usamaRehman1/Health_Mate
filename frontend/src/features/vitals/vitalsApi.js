import api from "../../services/axios";

export const getVitalsAPI = (familyMemberId) =>
  api.get("/vital", {
    params: familyMemberId ? { familyMemberId } : undefined,
  });

export const addVitalAPI = (vital) => api.post("/vital", vital);
