import api from "@/shared/api/client";
import { ApiResponse } from "@/types/api";

export type CreatePaymentResult = {
  gatewayUrl: string;
  authority: string;
};

export const paymentService = {
  /** ساخت تراکنش برای یک سفارش و گرفتن آدرس درگاه زرین‌پال. */
  create: async (data: { orderId: string }) =>
    await api.post<ApiResponse<CreatePaymentResult>>("/payments", data),
};
