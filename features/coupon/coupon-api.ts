import api from "@/shared/api/client";
import type { ApiResponse } from "@/types/api";

export type CouponType = "percentage" | "fixed" | "free_shipping";
export type CouponScope = "cart" | "product" | "category";

/** Response of applying a coupon to the user's real cart. */
export interface ApplyCouponResult {
  coupon: {
    id: string;
    code: string;
    type: CouponType;
    scope: CouponScope;
    value: number;
  };
  discount: number;
  eligibleSubtotal: number;
}

/** A guest cart line sent for pre-login coupon validation (prices are display-only). */
export interface CouponLineInput {
  productId: string;
  categoryId?: string;
  unitPrice: number;
  quantity: number;
  hasProductDiscount?: boolean;
}

/** Response of the public (pre-login) coupon validation. */
export interface ValidateCouponResult {
  valid: boolean;
  /** true when the code is real but user-bound, so it can only be applied after login. */
  requiresLogin?: boolean;
  coupon?: { code: string; type: CouponType; scope: CouponScope; value: number };
  discount?: number;
  eligibleSubtotal?: number;
}

export const couponService = {
  /** Apply/validate a discount code on the server cart; returns the discount amount and stores it on the cart. */
  apply: (code: string) =>
    api.post<ApiResponse<ApplyCouponResult>>("/coupons/apply", { code }),

  /** Remove the applied discount code from the cart. */
  remove: () => api.delete("/coupons/apply"),

  /** Public pre-login validation of a discount code against the guest cart lines. */
  validate: (code: string, lines: CouponLineInput[]) =>
    api.post<ApiResponse<ValidateCouponResult>>("/coupons/validate", {
      code,
      lines,
    }),
};
