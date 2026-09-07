import api from "@/shared/api/client";
import { serverFetch } from "@/shared/api/server-fetch";
import { ApiResponse } from "@/types/api";
import type { OrderStatus } from "@/types/order";
import type { CreatePaymentResult } from "./payment-api";

/**
 * A payment link an admin created for an order they placed on the customer's behalf.
 *
 * The backend hands out only what the payer needs to recognise the order — no account, no phone
 * number, nothing about their other orders — because whoever holds the link can open this page
 * without signing in.
 */
export type PaymentLinkView = {
  orderNumber: string | null;
  status: OrderStatus;
  /** Whether the link can still start a payment right now. */
  payable: boolean;
  expired: boolean;
  expiresAt: string | null;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  shippingMethodLabel: string | null;
  shippingAddress: {
    firstName: string;
    lastName: string;
    province?: string;
    city: string;
    address: string;
    plaque: string;
  } | null;
};

/**
 * Server-side read of a payment link. No cookie is sent and nothing is cached: the page has to
 * show the order as it is right now — paid, cancelled, or still waiting.
 */
export async function getPaymentLink(token: string) {
  try {
    const data = await serverFetch<PaymentLinkView>(
      `/payments/link/${token}`,
      { cache: "no-store" },
    );
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export const paymentLinkService = {
  /** Starts the gateway payment for a link and returns the URL to redirect to. */
  start: async (token: string) =>
    await api.post<ApiResponse<CreatePaymentResult>>(
      `/payments/link/${token}`,
    ),
};
