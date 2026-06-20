"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "./order-api";
import { CART_KEY } from "@/features/query-keys";

export type CreateOrderInput = {
  couponCode?: string;
  shippingAddress?: Record<string, unknown>;
};

/** ثبت سفارش از روی سبد سرور؛ پس از موفقیت سبد را باطل می‌کند. */
export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateOrderInput) => {
      const res = await orderService.create(data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CART_KEY });
    },
  });
}
