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

  /** Manual display order (larger number = higher). */
  displayOrder?: number;

  categoryId?: string;
  category?: Category | null;

  /**
   * Product categories (multi-valued, M2M relation in the backend). Usually covers the whole
   * category path (parent + leaf). Used for related-product suggestions.
   */
  categories?: Category[] | null;

  brandId?: string;
  brand?: Brand | null;

  images?: ProductImage[];
  attributes?: ProductAttribute[];
  discounts?: Discount[];
  reviews?: Review[];

  /**
   * Curated "buy together" links picked by the admin, ordered by `order`. Only returned by the
   * admin read; the storefront gets the resolved products from `getRelatedProducts` instead.
   */
  relatedLinks?: { id: string; order: number; relatedProduct: Product }[];

  /**
   * Effective price after applying the active discount — computed by the backend.
   * Equals basePrice if there is no active discount.
   */
  discountedPrice?: number;
  /** The currently active discount (determined by the backend) or null. */
  activeDiscount?: Discount | null;

  createdAt: string;
  updatedAt: string;
};
