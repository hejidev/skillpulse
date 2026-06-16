// lib/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g. http://localhost:5000/api
  withCredentials: true,
});

/* =========================================
   REQUEST INTERCEPTOR
========================================= */
API.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* =========================================
   RESPONSE INTERCEPTOR
========================================= */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      // remove auth info if token is no longer valid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      // optional: redirect to login if you want
      // const isAuthPage = window.location.pathname.startsWith("/auth");
      // if (!isAuthPage) window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);

export default API;