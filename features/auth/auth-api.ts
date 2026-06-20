import api from "@/shared/api/client";
import type { User } from "@/types/user";
import type { ApiResponse } from "@/types/api";

export const authService = {
  sendOtp: (phone: string) =>
    api.post<ApiResponse<{ message: string }>>("/auth/send-otp", { phone }),

  verifyOtp: (phone: string, code: string) =>
    api.post<ApiResponse<{ user: User; isNewUser: boolean }>>(
      "/auth/verify-otp",
      { phone, code },
    ),

  // refresh و logout بر پایه‌ی کوکی httpOnly کار می‌کنند (بدون بدنه)
  refresh: () => api.post("/auth/refresh"),
  logout: () => api.post("/auth/logout"),

  me: () =>
    api.get<ApiResponse<User>>("/users/me", {
      adapter: "fetch",
      fetchOptions: { cache: "no-store" },
    }),
};
