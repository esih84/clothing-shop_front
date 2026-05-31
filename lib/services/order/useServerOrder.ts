import { orderService } from "./api";

export async function createOrder(data: { couponCode?: string; shippingAddress?: any }) {
  try {
    const result = await orderService.create(data);
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getMyOrders(page = 1) {
  try {
    const orders = await orderService.getMyOrders(page);
    return { data: orders, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getOrderDetails(id: string) {
  try {
    const order = await orderService.getDetails(id);
    return { data: order, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
