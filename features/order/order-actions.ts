"use server";

import { updateTag } from "next/cache";

/**
 * باطل‌سازی کش لیست سفارش‌ها (تگ `orders` در getMyOrders).
 * پس از ثبت سفارش جدید فراخوانی می‌شود تا لیست بلافاصله به‌روز شود.
 * `updateTag` (نکست ۱۶) فقط داخل Server Action و با read-your-own-writes کار می‌کند.
 */
export async function revalidateOrders() {
  updateTag("orders");
}
