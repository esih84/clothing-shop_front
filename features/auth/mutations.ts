"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "./auth-api";
import { CURRENT_USER_KEY } from "@/features/query-keys";

export function useSendOtp() {
  return useMutation({
    mutationFn: (phone: string) => authService.sendOtp(phone),
  });
}

export function useVerifyOtp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ phone, code }: { phone: string; code: string }) =>
      authService.verifyOtp(phone, code),
    onSuccess: (res) => {
      // کوکی‌ها توسط بک‌اند ست شده‌اند؛ کاربر را در کش قرار می‌دهیم
      qc.setQueryData(CURRENT_USER_KEY, res.data.data.user);
      qc.invalidateQueries({ queryKey: CURRENT_USER_KEY });
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      qc.setQueryData(CURRENT_USER_KEY, null);
      qc.invalidateQueries({ queryKey: CURRENT_USER_KEY });
    },
  });
}
