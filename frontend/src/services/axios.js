import axios from "axios";

const configuredBaseURL = import.meta.env.VITE_API_BASE_URL
    || "https://ridden-crispness-wish.ngrok-free.dev/api";


// api for ngrok
// const api = axios.create({
//     baseURL: configuredBaseURL.trim().replace(/\/+$/, ""),
//     headers: {
//         "Content-Type": "application/json",
//         "ngrok-skip-browser-warning": "69420",
//     },
// });

const api = axios.create({
    baseURL: configuredBaseURL?.trim().replace(/\/+$/, ""),
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;