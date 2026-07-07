"use client";

import { useMutation } from "@tanstack/react-query";
import { paymentService } from "./payment-api";

/** ساخت تراکنش پرداخت؛ خروجی شامل gatewayUrl برای انتقال به درگاه است. */
export function useCreatePayment() {
  return useMutation({
    mutationFn: async (data: { orderId: string }) => {
      const res = await paymentService.create(data);
      return res.data.data;
    },
  });
}
