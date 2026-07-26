"use client";

import { useQuery } from "@tanstack/react-query";
import { addressService } from "./address-api";
import { queryKeys } from "@/features/query-keys";
import { useIsLoggedIn } from "@/features/auth/queries";

/** The user's saved addresses (only when logged in). */
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
