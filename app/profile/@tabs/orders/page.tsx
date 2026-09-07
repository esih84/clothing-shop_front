import { Package, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getMyOrders } from "@/features/order/order-api";
import { getOrderStatus } from "@/features/order/order-status";
import { getSiteSettings } from "@/features/settings/settings-api";

export default async function OrdersTab() {
  const { orders: ordersText } = await getSiteSettings();
  const { data } = await getMyOrders(1);
  const orders = data ?? [];

  if (!orders.length) {
    return (
      <div
        className="flex flex-col items-center gap-4 py-8"
        style={{ direction: "rtl" }}
      >
        <p className="text-center text-sm text-muted-foreground">
          {ordersText.emptyTitle}
        </p>
        <Link
          prefetch
          href="/"
          className="bg-secondary text-secondary-foreground rounded-2xl px-6 py-2.5 text-sm font-medium no-underline hover:bg-secondary/90 transition-colors"
        >
          {ordersText.emptyCtaLabel}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3" style={{ direction: "rtl" }}>
      {orders.map((order) => {
        const status = getOrderStatus(order.status);
        return (
          <Link
            prefetch
            key={order.id}
            href={`/order/${order.id}`}
            className="flex items-center justify-between bg-card rounded-2xl p-4 shadow-sm border border-border hover:border-border/60 transition-colors cursor-pointer no-underline"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 border border-border flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-secondary" />
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground text-sm" dir="ltr">
                  سفارش {order.orderNumber ?? `#${order.id.slice(0, 8)}`}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[0.5rem] md:text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}
              >
                {status.label}
              </span>
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
