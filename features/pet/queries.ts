"use client";

import { useQuery } from "@tanstack/react-query";
import { petService } from "./pet-api";
import { queryKeys } from "@/features/query-keys";
import { useIsLoggedIn } from "@/features/auth/queries";

/** پت‌های ذخیره‌شده‌ی کاربر (فقط وقتی وارد شده باشد). */
export function usePets() {
  const isLoggedIn = useIsLoggedIn();
  return useQuery({
    queryKey: queryKeys.pets,
    queryFn: async () => {
      const res = await petService.getAll();
      return res.data.data;
    },
    enabled: isLoggedIn,
  });
}
