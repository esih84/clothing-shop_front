import api from "@/shared/api/client";
import type { ApiResponse } from "@/types/api";

export type CouponType = "percentage" | "fixed" | "free_shipping";
export type CouponScope = "cart" | "product" | "category";

/** پاسخ اعمال کوپن روی سبد واقعی کاربر. */
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

export const couponService = {
  /** اعمال/اعتبارسنجی کد تخفیف روی سبد سرور؛ مبلغ تخفیف را برمی‌گرداند و روی سبد ذخیره می‌کند. */
  apply: (code: string) =>
    api.post<ApiResponse<ApplyCouponResult>>("/coupons/apply", { code }),

  /** حذف کد تخفیف اعمال‌شده از سبد. */
  remove: () => api.delete("/coupons/apply"),
};
