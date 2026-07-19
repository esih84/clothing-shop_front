import api from "@/shared/api/client";
import { ApiResponse } from "@/types/api";

export type CreatePaymentResult = {
  gatewayUrl: string;
  authority: string;
  orderId: string;
};

export type CheckoutInput = {
  shippingAddress?: Record<string, unknown>;
  shippingMethod?: string;
  pointsToRedeem?: number;
};

export const paymentService = {
  /**
   * چک‌اوت یک‌مرحله‌ای: در یک درخواست سفارش را از روی سبد می‌سازد، تراکنش پرداخت
   * را ایجاد می‌کند و آدرس درگاه زرین‌پال را برمی‌گرداند.
   */
  checkout: async (data: CheckoutInput) =>
    await api.post<ApiResponse<CreatePaymentResult>>("/payments", data),

  /** تلاش مجدد پرداخت برای یک سفارشِ موجودِ در انتظار پرداخت. */
  retry: async (data: { orderId: string }) =>
    await api.post<ApiResponse<CreatePaymentResult>>("/payments/retry", data),
};
