import { api } from "@/lib/api/api";
import { Cart } from "@/types/cart";

export const cartService = {
  getCart: () => api<Cart>("/cart", { cache: "no-store" }),

  addItem: (variantId: string, quantity: number = 1) =>
    api("/cart/items", {
      method: "POST",
      body: JSON.stringify({ variantId, quantity }),
    }),

  updateItem: (itemId: string, quantity: number) =>
    api(`/cart/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    }),

  removeItem: (itemId: string) =>
    api(`/cart/items/${itemId}`, { method: "DELETE" }),

  clear: () => api("/cart", { method: "DELETE" }),
};
