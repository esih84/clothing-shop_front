"use client";

import { useQuery } from "@tanstack/react-query";
import { shippingMethodService } from "./shipping-method-api";
import { queryKeys } from "@/features/query-keys";

/** The shipping methods the admin has enabled; the checkout filters them by city. */
export function useShippingMethods() {
  return useQuery({
    queryKey: queryKeys.shippingMethods,
    queryFn: async () => {
      const res = await shippingMethodService.getActive();
      return res.data.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}
