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

  productId?: string;
  productName: string;

  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type Order = {
  id: string;
  orderNumber?: string | null;

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
