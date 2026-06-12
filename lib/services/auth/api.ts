import api from "@/lib/api/client";

export const authService = {
  sendOtp: (phone: string) =>
    api("/auth/send-otp", {
      method: "POST",
      data: JSON.stringify({ phone }),
    }),

  verifyOtp: (phone: string, code: string) =>
    api<{ accessToken: string; refreshToken: string }>("/auth/verify-otp", {
      method: "POST",
      data: JSON.stringify({ phone, code }),
    }),

  refresh: (refreshToken: string) =>
    api("/auth/refresh", {
      method: "POST",
      data: JSON.stringify({ refreshToken }),
    }),
};
