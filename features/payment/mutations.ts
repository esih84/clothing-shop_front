"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService, type CheckoutInput } from "./payment-api";
import { CURRENT_USER_KEY, queryKeys } from "@/features/query-keys";
import { revalidateOrders } from "@/features/order/order-actions";

/**
 * چک‌اوت: در یک درخواست سفارش ساخته و تراکنش پرداخت آغاز می‌شود؛
 * خروجی شامل gatewayUrl برای انتقال به درگاه است.
 */
export function useCheckout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CheckoutInput) => {
      const res = await paymentService.checkout(data);
      return res.data.data;
    },
    onSuccess: () => {
      // نام کاربر و پت‌ها ممکن است هنگام ثبت سفارش به‌روز شده باشند.
      // سبد عمداً باطل نمی‌شود؛ تا موفقیت پرداخت دست‌نخورده می‌ماند (جریان ACID).
      qc.invalidateQueries({ queryKey: CURRENT_USER_KEY });
      qc.invalidateQueries({ queryKey: queryKeys.pets });
      // باطل‌سازی کش لیست سفارش‌ها تا سفارش جدید بلافاصله دیده شود.
      revalidateOrders();
    },
  });
}

/** تلاش مجدد پرداخت برای یک سفارش موجود؛ خروجی شامل gatewayUrl است. */
export function useRetryPayment() {
  return useMutation({
    mutationFn: async (data: { orderId: string }) => {
      const res = await paymentService.retry(data);
      return res.data.data;
    },
  });
}
