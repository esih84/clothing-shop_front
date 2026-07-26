"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService, type CheckoutInput } from "./payment-api";
import { CURRENT_USER_KEY, queryKeys } from "@/features/query-keys";
import { revalidateOrders } from "@/features/order/order-actions";

/**
 * Checkout: in a single request the order is created and the payment transaction is started;
 * the output includes gatewayUrl for redirecting to the gateway.
 */
export function useCheckout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CheckoutInput) => {
      const res = await paymentService.checkout(data);
      return res.data.data;
    },
    onSuccess: () => {
      // The user's name and pets may have been updated when the order was placed.
      // The cart is intentionally not invalidated; it stays untouched until payment succeeds (ACID flow).
      qc.invalidateQueries({ queryKey: CURRENT_USER_KEY });
      qc.invalidateQueries({ queryKey: queryKeys.pets });
      // Invalidate the orders list cache so the new order is seen immediately.
      revalidateOrders();
    },
  });
}

/** Retry payment for an existing order; the output includes gatewayUrl. */
export function useRetryPayment() {
  return useMutation({
    mutationFn: async (data: { orderId: string }) => {
      const res = await paymentService.retry(data);
      return res.data.data;
    },
  });
}
