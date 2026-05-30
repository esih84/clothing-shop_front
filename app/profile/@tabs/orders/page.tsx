import { Package, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useMyOrders } from "@/lib/services/order/useServerOrder";

export default async function OrdersTab() {
  const { data } = await useMyOrders(1);
  const orders = data ?? [];

  if (!orders.length) {
    return (
      <p className="text-center text-sm text-gray-500 py-8" style={{ direction: "rtl" }}>
        هنوز سفارشی ثبت نکرده‌اید
      </p>
    );
  }

  return (
    <div className="space-y-3" style={{ direction: "rtl" }}>
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/order/${order.id}`}
          className="flex items-center justify-between bg-white p-4 shadow-sm border border-[#E3A7C4]/30 hover:border-[#E3A7C4]/60 transition-colors cursor-pointer no-underline"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ffbdc5]/20 border border-[#E3A7C4]/30 flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-[#670626]" />
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-800 text-sm">سفارش #{order.id}</p>
              <p className="text-xs text-gray-500 mt-0.5">{order.createdAt}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-0.5 `}>
              {order.status}
            </span>
            <ChevronLeft className="w-4 h-4 text-gray-300" />
          </div>
        </Link>
      ))}
    </div>
  );
}
