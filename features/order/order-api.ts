import api from "@/shared/api/client";
import { serverFetch } from "@/shared/api/server-fetch";
import { ApiResponse, ApiListResponse } from "@/types/api";
import { Order } from "@/types/order";

export type OrderListResponse = ApiListResponse<Order, "data">;

/* خواندن‌های سمت سرور سفارش (شخصی → بدون کش، با ارسال کوکی) */
export async function getMyOrders(page = 1) {
  try {
    const res = await serverFetch<OrderListResponse>(`/orders?page=${page}`, {
      auth: true,
    });
    return { data: res.data, total: res.total, error: null };
  } catch (error) {
    return { data: null, total: 0, error };
  }
}

export async function getOrderDetails(id: string) {
  try {
    const data = await serverFetch<Order>(`/orders/${id}`, { auth: true });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export const orderService = {
  create: async (data: { shippingAddress?: any }) =>
    await api.post<ApiResponse<Order>>("/orders", data),

  getMyOrders: async (page = 1) => {
    const res = await api.get<ApiResponse<OrderListResponse>>(
      `/orders?page=${page}`,
      {
        adapter: "fetch",
        fetchOptions: { cache: "no-store" },
      },
    );
    return res.data.data.data;
  },
  getDetails: async (id: string) => {
    const res = await api.get<ApiResponse<Order>>(`/orders/${id}`, {
      adapter: "fetch",
      fetchOptions: { cache: "no-store" },
    });
    return res.data.data;
  },
};
