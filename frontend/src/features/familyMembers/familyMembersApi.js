import api from "../../services/axios";

export const getFamilyMembersAPI = () => api.get("/family-members");
export const addFamilyMemberAPI = (member) => api.post("/family-members", member);
export const deleteFamilyMemberAPI = (id) => api.delete(`/family-members/${id}`);
