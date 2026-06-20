import type { Category } from "./category";
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

  categoryId?: string;
  category?: Category | null;

  images?: ProductImage[];
  attributes?: ProductAttribute[];
  discounts?: Discount[];
  reviews?: Review[];

  createdAt: string;
  updatedAt: string;
};
