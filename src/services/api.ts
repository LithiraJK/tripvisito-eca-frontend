import axios, { AxiosError } from "axios";
import { refreshTokens } from "./auth";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL && !import.meta.env.VITE_API_BASE_URL.includes("placeholder")
  ? import.meta.env.VITE_API_BASE_URL
  : "http://8.232.84.60:8080";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});



/**
 * Checks whether a request URL is a public (no-auth) endpoint.
 * Read-only trip routes (GET /trip/all, GET /trip/:id) are public.
 * Write routes (POST /trip/generate-trip, PUT /trip/edit) are NOT public.
 */
const isPublicEndpoint = (url: string | undefined, method: string | undefined): boolean => {
  if (!url) return false;
  const normalizedUrl = url.startsWith("/") ? url : `/${url}`;
  const normalizedMethod = (method || "get").toLowerCase();

  // Auth endpoints are always public
  if (normalizedUrl.startsWith("/auth/login") || normalizedUrl.startsWith("/auth/register")) {
    return true;
  }

  // Trip endpoints: only GET requests to browse/view are public
  if (normalizedUrl.startsWith("/trip/")) {
    // These write endpoints always need auth
    const authRequired = ["/trip/generate", "/trip/edit", "/trip/delete", "/trip/user-trips"];
    if (authRequired.some((path) => normalizedUrl.startsWith(path))) {
      return false;
    }
    // GET-only public access for /trip/all and /trip/:id
    return normalizedMethod === "get";
  }

  return false;
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    const isPublic = isPublicEndpoint(config.url, config.method);

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

    const isProtected = !isPublicEndpoint(originalRequest?.url, originalRequest?.method);

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
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
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
