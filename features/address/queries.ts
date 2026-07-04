"use client";

import { useQuery } from "@tanstack/react-query";
import { addressService } from "./address-api";
import { queryKeys } from "@/features/query-keys";
import { useIsLoggedIn } from "@/features/auth/queries";

/** آدرس‌های ذخیره‌شده‌ی کاربر (فقط وقتی وارد شده باشد). */
export function useAddresses() {
  const isLoggedIn = useIsLoggedIn();
  return useQuery({
    queryKey: queryKeys.addresses,
    queryFn: async () => {
      const res = await addressService.getAll();
      return res.data.data;
    },
    enabled: isLoggedIn,
  });
}
