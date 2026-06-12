import api from "@/lib/api/client";
import { Wishlist } from "@/types/wishlist";

export type AddWishlistItemInput = {
  productId: string;
  variantId?: string;
};

export const wishlistService = {
  getWishlist: () =>
    api.get<Wishlist[]>("/wishlist", {
      adapter: "fetch",
      fetchOptions: { cache: "no-store" },
    }),

  addItem: (data: AddWishlistItemInput) =>
    api.post<Wishlist>("/wishlist", { data: JSON.stringify(data) }),

  removeItem: (productId: string) =>
    api.delete<{ success: boolean }>(`/wishlist/${productId}`),
};
