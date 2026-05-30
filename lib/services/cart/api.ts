import api from "@/lib/api/api";
import { Cart } from "@/types/cart";

export const cartService = {
  getCart: () => api.get<Cart>("/cart", { adapter: "fetch", fetchOptions: { cache: "no-store" } }),

  addItem: (variantId: string, quantity: number = 1) =>
    api.post("/cart/items", { data: JSON.stringify({ variantId, quantity }) }),

  updateItem: (itemId: string, quantity: number) =>
    api.put(`/cart/items/${itemId}`, { data: JSON.stringify({ quantity }) }),

  removeItem: (itemId: string) =>
    api.delete(`/cart/items/${itemId}`),

  clear: () => api.delete("/cart"),
};
