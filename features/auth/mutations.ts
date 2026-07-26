"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService, UpdateProfileInput } from "./auth-api";
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
      // The cookies are set by the backend; we place the user in the cache
      qc.setQueryData(CURRENT_USER_KEY, res.data.data.user);
      qc.invalidateQueries({ queryKey: CURRENT_USER_KEY });
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateProfileInput) => {
      const res = await authService.updateProfile(data);
      return res.data.data;
    },
    onSuccess: (user) => {
      qc.setQueryData(CURRENT_USER_KEY, user);
      qc.invalidateQueries({ queryKey: CURRENT_USER_KEY });
      toast.success("پروفایل به‌روزرسانی شد.");
    },
    onError: () => toast.error("به‌روزرسانی پروفایل با خطا مواجه شد."),
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
