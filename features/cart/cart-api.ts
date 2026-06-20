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
    api.post("/cart/items", { productId, quantity }),

  updateItem: (itemId: string, quantity: number) =>
    api.put(`/cart/items/${itemId}`, { quantity }),

  removeItem: (itemId: string) => api.delete(`/cart/items/${itemId}`),

  clear: () => api.delete("/cart"),
};
