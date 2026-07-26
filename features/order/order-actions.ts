"use server";

import { updateTag } from "next/cache";

/**
 * Invalidate the orders list cache (the `orders` tag in getMyOrders).
 * Called after placing a new order so the list updates immediately.
 * `updateTag` (Next 16) works only inside a Server Action and with read-your-own-writes.
 */
export async function revalidateOrders() {
  updateTag("orders");
}
