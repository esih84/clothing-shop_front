import { api } from "@/lib/api/api";
import { Order } from "@/types/order";

export const orderService = {
  create: (data: { couponCode?: string; shippingAddress?: any }) =>
    api<Order>("/orders", { method: "POST", body: JSON.stringify(data) }),

  getMyOrders: (page = 1) =>
    api<Order[]>(`/orders?page=${page}`, { cache: "no-store" }),

  getDetails: (id: string) =>
    api<Order>(`/orders/${id}`, { cache: "no-store" }),
};
