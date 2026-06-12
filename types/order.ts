// removed incorrect import from ./api; use built-in types instead
import { ProductVariant } from "./product";
import type { User } from "./user";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type OrderItem = {
  id: string;
  orderId: string;

  variantId?: string;
  productName: string;
  variantDetails?: ProductVariant;

  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type Order = {
  id: string;

  userId: string;
  user?: User;

  items: OrderItem[];

  totalAmount: number;
  discountAmount: number;
  finalAmount: number;

  couponCode?: string;
  pointsRedeemed: number;

  status: OrderStatus;
  shippingAddress?: Record<string, unknown>;

  createdAt: string;
  updatedAt: string;
};
