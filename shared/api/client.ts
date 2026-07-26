import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// 1. Initial setup
const baseURL = process.env.NEXT_PUBLIC_API_URL;
const api = axios.create({
  baseURL,
  withCredentials: true, // To send cookies
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

// 2. Request Interceptor (smart for server and client)
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  // If we are on the server (SSR/Server Actions)
  if (typeof window === "undefined") {
    // Dynamic import to avoid an error on the client
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();

    // Convert cookies to a string (Cookie: a=1; b=2)
    const cookieString = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    config.headers.Cookie = cookieString;
  }
  return config;
});

// 3. Response Interceptor (handles 401 and Refresh)
// This is the same logic as before but placed in this file
let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push(() => resolve(api(originalRequest)));
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/auth/refresh"); // With withCredentials: true the cookies are sent
        isRefreshing = false;
        refreshQueue.forEach((cb) => cb(null));
        refreshQueue = [];
        return api(originalRequest);
      } catch (err) {
        isRefreshing = false;
        refreshQueue = [];
        // Redirect to login if needed
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
