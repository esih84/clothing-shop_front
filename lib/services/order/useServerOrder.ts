import { orderService } from "./api";

export async function useCreateOrder(data: { couponCode?: string; shippingAddress?: any }) {
  try {
    const result = await orderService.create(data);
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function useMyOrders(page = 1) {
  try {
    const orders = await orderService.getMyOrders(page);
    return { data: orders, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function usOrderDetails(id: string) {
  try {
    const order = await orderService.getDetails(id);
    return { data: order, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
