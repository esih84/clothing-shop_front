import type { UUID, ISODateString } from "./api";
import type { Category } from "./category";
import type { Review } from "./review";

export type DiscountType = "percentage" | "fixed";

export type Discount = {
  id: UUID;
  productId: UUID;
  type: DiscountType;
  value: number;
  startDate: ISODateString;
  endDate: ISODateString;
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type ProductAttribute = {
  id: UUID;
  productId: UUID;
  key: string;
  value: string;
};

export type ProductImage = {
  id: UUID;
  productId: UUID;
  variantId?: UUID;
  url: string;
  thumbnailUrl?: string;
  mediumUrl?: string;
  order: number;
  altText?: string;
  isPrimary: boolean;
};

export type ProductVariant = {
  id: UUID;
  productId: UUID;
  color?: string;
  size?: string;
  price: number;
  stock: number;
  sku: string;
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type Product = {
  id: UUID;
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  isActive: boolean;

  categoryId?: UUID;
  category?: Category | null;

  variants?: ProductVariant[];
  images?: ProductImage[];
  attributes?: ProductAttribute[];
  discounts?: Discount[];
  reviews?: Review[];

  createdAt: ISODateString;
  updatedAt: ISODateString;
};
