"use client";

import { useMutation } from "@tanstack/react-query";
import { couponService, type CouponLineInput } from "./coupon-api";

// Note: applying/removing a coupon changes only the cart's stored couponCode/discountAmount, not its
// line items, and the checkout page tracks the discount in local state — so we intentionally do NOT
// invalidate CART_KEY here (it would trigger a needless full GET /cart refetch).

/** Apply a discount code to the server cart; the output includes the discount amount. */
export function useApplyCoupon() {
  return useMutation({
    mutationFn: async (code: string) => {
      const res = await couponService.apply(code);
      return res.data.data;
    },
  });
}

/** Remove the applied discount code from the server cart. */
export function useRemoveCoupon() {
  return useMutation({
    mutationFn: () => couponService.remove(),
  });
}

/** Pre-login (public) validation of a discount code against the guest cart lines. */
export function useValidateCoupon() {
  return useMutation({
    mutationFn: async ({
      code,
      lines,
    }: {
      code: string;
      lines: CouponLineInput[];
    }) => {
      const res = await couponService.validate(code, lines);
      return res.data.data;
    },
  });
}
