import type { UUID, ISODateString, JsonRecord } from "./api";
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
  id: UUID;
  orderId: UUID;

  variantId?: UUID;
  productName: string;
  variantDetails?: JsonRecord;

  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type Order = {
  id: UUID;

  userId: UUID;
  user?: User;

  items: OrderItem[];

  totalAmount: number;
  discountAmount: number;
  finalAmount: number;

  couponCode?: string;
  pointsRedeemed: number;

  status: OrderStatus;
  shippingAddress?: JsonRecord;

  createdAt: ISODateString;
  updatedAt: ISODateString;
};
