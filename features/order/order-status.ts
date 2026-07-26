import type { OrderStatus } from "@/types/order";

/** Persian label and color class for each order status (single source for list and details). */
export const orderStatusInfo: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  awaiting_payment: {
    label: "در انتظار پرداخت",
    className: "bg-yellow-100 text-yellow-700",
  },
  paid: { label: "پرداخت‌شده", className: "bg-blue-100 text-blue-700" },
  processing: { label: "در حال پردازش", className: "bg-blue-100 text-blue-700" },
  shipped: { label: "ارسال شده", className: "bg-indigo-100 text-indigo-700" },
  delivered: { label: "تحویل شده", className: "bg-green-100 text-green-700" },
  cancelled: { label: "لغو شده", className: "bg-red-100 text-red-700" },
  refunded: { label: "مرجوع شده", className: "bg-gray-100 text-gray-700" },
};

/** Converts a status to its Persian label and color class; has a safe fallback for unknown values. */
export function getOrderStatus(status: string): {
  label: string;
  className: string;
} {
  return (
    orderStatusInfo[status as OrderStatus] ?? {
      label: status,
      className: "bg-gray-100 text-gray-700",
    }
  );
}
