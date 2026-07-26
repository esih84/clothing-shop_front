import api from "@/shared/api/client";
import { Cart } from "@/types/cart";
import type { ApiResponse } from "@/types/api";

export const cartService = {
  getCart: () =>
    api.get<ApiResponse<Cart>>("/cart", {
      adapter: "fetch",
      fetchOptions: { cache: "no-store" },
    }),

  addItem: (productId: string, quantity: number = 1) =>
    api.post<ApiResponse<Cart>>("/cart/items", { productId, quantity }),

  /** Fold the guest cart into the server cart in a single request; returns the merged cart. */
  merge: (items: { productId: string; quantity: number }[]) =>
    api.post<ApiResponse<Cart>>("/cart/merge", { items }),

  updateItem: (itemId: string, quantity: number) =>
    api.put<ApiResponse<Cart>>(`/cart/items/${itemId}`, { quantity }),

  removeItem: (itemId: string) =>
    api.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`),

  clear: () => api.delete("/cart"),
};
