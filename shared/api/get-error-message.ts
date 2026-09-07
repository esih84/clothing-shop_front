import { AxiosError } from "axios";

/**
 * Converts common backend messages (English) into user-facing Persian.
 * If there is no match, the original message is returned.
 */
function translateMessage(message: string): string {
  const stock = message.match(/only\s+(\d+)\s+items?\s+in\s+stock/i);
  if (stock) return `تنها ${stock[1]} عدد در انبار موجود است`;
  if (/product not found/i.test(message)) return "محصول یافت نشد";
  if (/cart item not found/i.test(message)) return "آیتم در سبد خرید یافت نشد";
  return message;
}

/**
 * Extracts a user-facing error message from a backend axios error.
 * The NestJS error body has the shape `{ message: string | string[] }`.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.",
): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as
      | { message?: string | string[] }
      | undefined;
    const raw = Array.isArray(data?.message) ? data?.message[0] : data?.message;
    if (typeof raw === "string" && raw.trim()) return translateMessage(raw);
  }
  return fallback;
}

/**
 * Some failures happen *after* the order was already created (e.g. the payment gateway did not
 * answer). The backend puts the order id in the error body so the UI can offer a retry instead
 * of a dead end. Returns undefined when the error carries no order.
 */
export function getApiErrorOrder(
  error: unknown,
): { orderId: string; orderNumber?: string } | undefined {
  if (!(error instanceof AxiosError)) return undefined;
  const data = error.response?.data as
    | { orderId?: unknown; orderNumber?: unknown }
    | undefined;
  if (typeof data?.orderId !== "string" || !data.orderId) return undefined;
  return {
    orderId: data.orderId,
    orderNumber:
      typeof data.orderNumber === "string" ? data.orderNumber : undefined,
  };
}
