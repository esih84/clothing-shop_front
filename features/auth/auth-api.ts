import api from "@/shared/api/client";
import type { User } from "@/types/user";
import type { ApiResponse } from "@/types/api";

/** Profile fields the user is allowed to edit (phone is intentionally excluded). */
export type UpdateProfileInput = {
  firstName?: string;
  lastName?: string;
  email?: string;
  birthDate?: string;
};

export const authService = {
  sendOtp: (phone: string) =>
    api.post<ApiResponse<{ message: string }>>("/auth/send-otp", { phone }),

  verifyOtp: (phone: string, code: string) =>
    api.post<ApiResponse<{ user: User; isNewUser: boolean }>>(
      "/auth/verify-otp",
      { phone, code },
    ),

  // refresh and logout work based on the httpOnly cookie (no body)
  refresh: () => api.post("/auth/refresh"),
  logout: () => api.post("/auth/logout"),

  me: () =>
    api.get<ApiResponse<User>>("/users/me", {
      adapter: "fetch",
      fetchOptions: { cache: "no-store" },
    }),

  updateProfile: (data: UpdateProfileInput) =>
    api.put<ApiResponse<User>>("/users/me", data),
};
