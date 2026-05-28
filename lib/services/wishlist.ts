import { api } from "@/lib/api/api";
import { Wishlist } from "@/types/wishlist";

export type AddWishlistItemInput = {
  productId: string;
  variantId?: string;
};

export const wishlistService = {
  getWishlist: () =>
    api<Wishlist[]>("/wishlist", {
      cache: "no-store",
    }),

  addItem: (data: AddWishlistItemInput) =>
    api<Wishlist>("/wishlist", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  removeItem: (productId: string) =>
    api<{ success: boolean }>(`/wishlist/${productId}`, {
      method: "DELETE",
    }),
};
