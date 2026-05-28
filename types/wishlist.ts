import type { UUID, ISODateString } from "./api";
import type { User } from "./user";
import type { Product, ProductVariant } from "./product";

export type Wishlist = {
  id: UUID;

  userId: UUID;
  user?: User;

  productId: UUID;
  product?: Product;

  variantId?: UUID;
  variant?: ProductVariant | null;

  addedAt: ISODateString;
};
