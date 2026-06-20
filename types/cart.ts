import type { User } from "./user";
import type { Product } from "./product";

export type CartItem = {
  id: string;

  cartId: string;
  productId: string;

  // در entity eager: true هست و بک‌اند product.images را هم لود می‌کند
  product?: Product;

  quantity: number;
  addedAt: string;
};

export type Cart = {
  id: string;

  userId: string;
  user?: User;

  items: CartItem[];

  expiresAt?: string;

  createdAt: string;
  updatedAt: string;
};
