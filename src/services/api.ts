import axios, { AxiosError } from "axios";
import { refreshTokens } from "./auth";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

const PUBLIC_ENDPOINTS = ["/auth/login", "/auth/register", "/trip"];

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    // Check if the URL exactly matches or starts with public endpoints (but not sub-paths)
    const isPublic = PUBLIC_ENDPOINTS.some((url) => {
      const requestUrl = config.url || '';
      return requestUrl === url || requestUrl === url.slice(1); // Remove leading slash
    });

    if (!isPublic && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    const isProtected = !PUBLIC_ENDPOINTS.some((url) => {
      const requestUrl = originalRequest.url || '';
      return requestUrl === url || requestUrl === url.slice(1) || requestUrl.startsWith(url);
    });

    if (
      error.response?.status === 401 &&
      isProtected &&
      !originalRequest._retry
    ) {
      console.log("🔄 401 detected - Attempting token refresh...");
      originalRequest._retry = true;

      const toastId = toast.loading("Refreshing session...");

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          toast.dismiss(toastId);
          window.location.href = "/login";
          throw new Error("No refresh token available");
        }

        const data = await refreshTokens(refreshToken);
        console.log(data);

        localStorage.setItem("accessToken", data.data.accessToken);
        if (data.data.refreshToken) {
          localStorage.setItem("refreshToken", data.data.refreshToken);
        }

        toast.dismiss(toastId);
        console.log("✅ Token refresh successful");

        // Retry original request with new access token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        console.log("🔄 Retrying original request...");
        return api(originalRequest);
      } catch (refreshErr) {
        toast.dismiss(toastId); // dismiss toast if refresh fails
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
