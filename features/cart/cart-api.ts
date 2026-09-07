import api from "@/shared/api/client";
import { Cart } from "@/types/cart";
import type { ApiResponse } from "@/types/api";
import type { CartLineAvailability } from "@/types/cart";

export const cartService = {
  getCart: () =>
    api.get<ApiResponse<Cart>>("/cart", {
      adapter: "fetch",
      fetchOptions: { cache: "no-store" },
    }),

  addItem: (productId: string, quantity: number = 1) =>
    api.post<ApiResponse<Cart>>("/cart/items", { productId, quantity }),

  /**
   * Check cart lines against live stock. Works for guests too — the guest cart freezes each
   * product's stock in localStorage at add time, so it needs re-checking before checkout.
   */
  validate: (items: { productId: string; quantity: number }[]) =>
    api.post<ApiResponse<CartLineAvailability[]>>("/cart/validate", { items }),

  /** Fold the guest cart into the server cart in a single request; returns the merged cart. */
  merge: (items: { productId: string; quantity: number }[]) =>
    api.post<ApiResponse<Cart>>("/cart/merge", { items }),

  updateItem: (itemId: string, quantity: number) =>
    api.put<ApiResponse<Cart>>(`/cart/items/${itemId}`, { quantity }),

  removeItem: (itemId: string) =>
    api.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`),

  clear: () => api.delete("/cart"),
};
