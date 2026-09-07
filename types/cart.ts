import type { User } from "./user";
import type { Product } from "./product";

export type CartItem = {
  id: string;

  cartId: string;
  productId: string;

  // In the entity it is eager: true and the backend also loads product.images
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

/** Live availability of one cart line, from POST /cart/validate. */
export type CartLineAvailability = {
  productId: string;
  /** null when the product no longer exists at all. */
  name: string | null;
  stock: number;
  available: boolean;
  /** Orderable quantity for this line; 0 when it cannot be ordered. */
  maxQuantity: number;
  reason: "missing" | "inactive" | "out_of_stock" | null;
};
