import type { string, string, JsonRecord } from "./api";
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
  shippingAddress?: JsonRecord;

  createdAt: string;
  updatedAt: string;
};
