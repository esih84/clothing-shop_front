import api  from "@/lib/api/api";
import { ApiResponse } from "@/types/api";
import { Order } from "@/types/order";

export const orderService = {
  create: async(data: { couponCode?: string; shippingAddress?: any }) =>
    await api.post<ApiResponse<Order>>("/orders", {  data: JSON.stringify(data) }),

  getMyOrders:async (page = 1) =>{
    const res = await api.get<ApiResponse<Order[]>>(`/orders?page=${page}`, { adapter: "fetch", fetchOptions: { cache: "no-store" } })
    return res.data.data
  },
  getDetails: async(id: string) =>{
   const res =await api.get<ApiResponse<Order>>(`/orders/${id}`, { adapter: "fetch", fetchOptions: { cache: "no-store" } })
   return res.data.data
  }
};
