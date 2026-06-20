"use client";

import { useQuery } from "@tanstack/react-query";
import { authService } from "./auth-api";
import { CURRENT_USER_KEY } from "@/features/query-keys";
import type { User } from "@/types/user";

/** کاربر فعلی را از /users/me می‌خواند (مبتنی بر کوکی httpOnly). */
export function useCurrentUser() {
  return useQuery<User | null>({
    queryKey: CURRENT_USER_KEY,
    queryFn: async () => {
      try {
        const res = await authService.me();
        return res.data.data;
      } catch {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useIsLoggedIn(): boolean {
  const { data } = useCurrentUser();
  return !!data;
}
