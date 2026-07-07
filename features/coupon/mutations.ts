"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { couponService } from "./coupon-api";
import { CART_KEY } from "@/features/query-keys";

/** اعمال کد تخفیف روی سبد سرور؛ خروجی شامل مبلغ تخفیف است. */
export function useApplyCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => {
      const res = await couponService.apply(code);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
  });
}

/** حذف کد تخفیف اعمال‌شده از سبد سرور. */
export function useRemoveCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => couponService.remove(),
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
  });
}
