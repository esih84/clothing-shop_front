import type { Category } from "./category";
import type { Brand } from "./brand";
import type { Review } from "./review";

export type DiscountType = "percentage" | "fixed";

export type Discount = {
  id: string;
  productId: string;
  type: DiscountType;
  value: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductAttribute = {
  id: string;
  productId: string;
  key: string;
  value: string;
};

export type ProductImage = {
  id: string;
  productId: string;
  url: string;
  thumbnailUrl?: string;
  mediumUrl?: string;
  order: number;
  altText?: string;
  isPrimary: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  stock: number;
  sku?: string;
  isActive: boolean;

  /** ترتیب نمایش دستی (عدد بزرگ‌تر = بالاتر). */
  displayOrder?: number;

  categoryId?: string;
  category?: Category | null;

  /**
   * دسته‌های محصول (چند‌مقداری، رابطه‌ی M2M در بک‌اند). معمولاً کل مسیر
   * دسته‌ی محصول (والد + برگ) را دربر می‌گیرد. برای پیشنهاد محصولات مرتبط.
   */
  categories?: Category[] | null;

  brandId?: string;
  brand?: Brand | null;

  images?: ProductImage[];
  attributes?: ProductAttribute[];
  discounts?: Discount[];
  reviews?: Review[];

  /**
   * قیمت مؤثر پس از اعمال تخفیف فعال — توسط بک‌اند محاسبه می‌شود.
   * اگر تخفیف فعالی نباشد برابر basePrice است.
   */
  discountedPrice?: number;
  /** تخفیف فعالِ همین‌الان (توسط بک‌اند تعیین می‌شود) یا null. */
  activeDiscount?: Discount | null;

  createdAt: string;
  updatedAt: string;
};
