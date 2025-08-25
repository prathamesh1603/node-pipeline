import axios from "axios";

// Ensure the environment variable is loaded correctly
const API_URL = process.env.REACT_APP_BACKEND_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true,
});

// Attach token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
