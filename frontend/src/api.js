import axios from "axios";

// Fallback to local 5000 if no env variable is set
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Automatically add the token to every request if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
