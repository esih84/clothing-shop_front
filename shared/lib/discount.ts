import type { Product } from "@/types/product";

export interface DiscountInfo {
  /** Does the product have an active discount? (based on backend data) */
  hasDiscount: boolean;
  /** Payable price (with discount if any). */
  finalPrice: number;
  /** Base price (for the strikethrough). */
  originalPrice: number;
  /** Discount percentage for showing the "-%" badge. */
  percent: number;
}

/**
 * Reads discount info only from the backend's computed fields
 * (`activeDiscount` / `discountedPrice`).
 * No active/date-range logic is executed on the frontend.
 */
export function getDiscountInfo(product: Product): DiscountInfo {
  const originalPrice = Number(product.basePrice);
  const finalPrice = product.discountedPrice ?? originalPrice;
  const hasDiscount = !!product.activeDiscount && finalPrice < originalPrice;
  const percent =
    hasDiscount && originalPrice > 0
      ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
      : 0;

  return { hasDiscount, finalPrice, originalPrice, percent };
}
