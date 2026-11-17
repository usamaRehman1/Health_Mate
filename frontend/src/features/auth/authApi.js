import api from "../../services/axios";

export const getUserAPI = (id) => api.get("/auth", { params: { id } });
export const loginAPI = (data) => api.post("/auth/login", data);
export const registerAPI = (data) => api.post("/auth/signup", data);