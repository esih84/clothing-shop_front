import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// 1. تنظیمات اولیه
const baseURL = process.env.NEXT_PUBLIC_API_URL;
const api = axios.create({
  baseURL,
  withCredentials: true, // برای ارسال کوکی‌ها
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

// 2. Request Interceptor (هوشمند برای سرور و کلاینت)
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  // اگر در سرور هستیم (SSR/Server Actions)
  if (typeof window === "undefined") {
    // داینامیک ایمپورت برای جلوگیری از خطا در کلاینت
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();

    // تبدیل کوکی‌ها به استرینگ (Cookie: a=1; b=2)
    const cookieString = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    config.headers.Cookie = cookieString;
  }
  return config;
});

// 3. Response Interceptor (مدیریت 401 و Refresh)
// این بخش همان منطق قبلی است ولی در همین فایل قرار می‌گیرد
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
        await api.post("/auth/refresh"); // با withCredentials: true کوکی‌ها فرستاده می‌شوند
        isRefreshing = false;
        refreshQueue.forEach((cb) => cb(null));
        refreshQueue = [];
        return api(originalRequest);
      } catch (err) {
        isRefreshing = false;
        refreshQueue = [];
        // هدایت به لاگین در صورت نیاز
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
