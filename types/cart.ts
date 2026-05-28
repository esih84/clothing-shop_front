import type { UUID, ISODateString } from "./api";
import type { User } from "./user";
import type { ProductVariant } from "./product";

export type CartItem = {
  id: UUID;

  cartId: UUID;
  variantId: UUID;

  // در entity eager: true هست، پس معمولاً API variant را برمی‌گرداند
  variant?: ProductVariant;

  quantity: number;
  addedAt: ISODateString;
};

export type Cart = {
  id: UUID;

  userId: UUID;
  user?: User;

  items: CartItem[];

  expiresAt?: ISODateString;

  createdAt: ISODateString;
  updatedAt: ISODateString;
};
