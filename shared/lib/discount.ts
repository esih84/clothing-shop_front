import type { Product } from "@/types/product";

export interface DiscountInfo {
  /** آیا محصول تخفیف فعال دارد؟ (بر اساس دیتای بک‌اند) */
  hasDiscount: boolean;
  /** قیمت قابل‌پرداخت (با تخفیف اگر باشد). */
  finalPrice: number;
  /** قیمت پایه (برای خط‌خورده). */
  originalPrice: number;
  /** درصد تخفیف برای نمایش بج «-٪». */
  percent: number;
}

/**
 * اطلاعات تخفیف را فقط از فیلدهای محاسبه‌شده‌ی بک‌اند
 * (`activeDiscount` / `discountedPrice`) می‌خواند.
 * هیچ منطق فعال‌بودن/بازه‌ی تاریخ در فرانت اجرا نمی‌شود.
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
