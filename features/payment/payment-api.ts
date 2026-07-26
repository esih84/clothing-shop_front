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
   * One-step checkout: in a single request it builds the order from the cart, creates the payment
   * transaction, and returns the Zarinpal gateway URL.
   */
  checkout: async (data: CheckoutInput) =>
    await api.post<ApiResponse<CreatePaymentResult>>("/payments", data),

  /** Retry payment for an existing order awaiting payment. */
  retry: async (data: { orderId: string }) =>
    await api.post<ApiResponse<CreatePaymentResult>>("/payments/retry", data),
};
