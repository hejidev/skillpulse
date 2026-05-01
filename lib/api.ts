import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// 🔥 Automatically attach token
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// ✅ RESPONSE INTERCEPTOR (handle 401 globally)
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // 🔥 Token expired or invalid
      localStorage.clear();

      // redirect user to login
      window.location.href = "/auth/login";
    }

    return Promise.reject(err);
  }
);

export default API;