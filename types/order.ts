import type { User } from "./user";

export type OrderStatus =
  | "awaiting_payment"
  | "paid"
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
  /** Unit base price at order placement; if greater than unitPrice it had a discount. */
  originalUnitPrice?: number;
  totalPrice: number;

  /** Product's featured image; filled by the backend when reading order details. */
  productImage?: string;
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
  shippingMethod?: string;

  createdAt: string;
  updatedAt: string;
};
