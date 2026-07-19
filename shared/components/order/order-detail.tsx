import React from "react";
import { ChevronRight, Package, MapPin, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Order } from "@/types/order";
import { formatToman, formatJalaliDate } from "@/shared/lib/utils";

export interface OrderDetailProps {
  order: Order;
}

/** یک فیلد رشته‌ای را از آدرس ارسال (jsonb) به‌صورت امن می‌خواند. */
function addressField(
  address: Record<string, unknown> | undefined,
  key: string,
): string {
  const value = address?.[key];
  return typeof value === "string" ? value.trim() : "";
}

const statusInfo: Record<string, { label: string; className: string }> = {
  pending: { label: "در انتظار", className: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "تأیید شده", className: "bg-blue-100 text-blue-700" },
  processing: {
    label: "در حال پردازش",
    className: "bg-blue-100 text-blue-700",
  },
  shipped: { label: "ارسال شده", className: "bg-indigo-100 text-indigo-700" },
  delivered: { label: "تحویل شده", className: "bg-green-100 text-green-700" },
  cancelled: { label: "لغو شده", className: "bg-red-100 text-red-700" },
  refunded: { label: "مرجوع شده", className: "bg-gray-100 text-gray-700" },
};

const OrderDetail: React.FC<OrderDetailProps> = ({ order }) => {
  if (!order) return null;
  const status = statusInfo[order.status] ?? {
    label: order.status,
    className: "bg-gray-100 text-gray-700",
  };
  const orderLabel = order.orderNumber ?? `#${order.id.slice(0, 8)}`;

  const sa = order.shippingAddress;
  const receiverName = [
    addressField(sa, "firstName"),
    addressField(sa, "lastName"),
  ]
    .filter(Boolean)
    .join(" ");
  const city = addressField(sa, "city");
  const addressLine = addressField(sa, "address");
  const plaque = addressField(sa, "plaque");
  const note = addressField(sa, "note");
  const hasLocation = Boolean(
    receiverName || city || addressLine || plaque || note,
  );

  return (
    <div
      className="max-w-5xl mx-auto p-4 lg:py-8 space-y-6"
      style={{ direction: "rtl" }}
    >
      <div className="flex items-center gap-2">
        <Link
          href="/profile/orders"
          className="text-gray-400 hover:text-[#A9CBF5]"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
        <h2 className="font-bold text-lg text-gray-800">
          جزئیات سفارش {orderLabel}
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ستون اصلی: محصولات سفارش (در موبایل بعد از خلاصه و آدرس) */}
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <div className="bg-white rounded-lg shadow p-4 border border-[#A9CBF5]/30">
            <h3 className="font-semibold text-base mb-3">محصولات سفارش</h3>
            <ul className="divide-y divide-gray-100">
              {order.items?.map((item) => (
                <li key={item.id} className="py-3 flex gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100 flex items-center justify-center">
                    {item.productImage ? (
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="w-full font-normal text-gray-800 text-sm sm:text-base leading-snug break-words">
                      {item.productName}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className="font-bold text-sm sm:text-base text-[#1473E6] whitespace-nowrap">
                        {formatToman(item.totalPrice)}
                      </p>
                      <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-0.5 text-xs text-gray-500">
                        <span className="whitespace-nowrap">
                          تعداد: {item.quantity}
                        </span>
                        <span className="whitespace-nowrap">
                          قیمت واحد: {formatToman(item.unitPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ستون کناری: خلاصه سفارش و آدرس (در موبایل اول نمایش داده می‌شود) */}
        <div className="lg:col-span-1 space-y-6 order-1 lg:order-2">
          <div className="bg-white rounded-lg shadow p-4 border border-[#A9CBF5]/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#FDE68A]/20 border border-[#A9CBF5]/30 flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-[#1473E6]" />
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800 text-sm" dir="ltr">
                  سفارش {orderLabel}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  تاریخ ثبت: {formatJalaliDate(order.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.className}`}
              >
                {status.label}
              </span>
            </div>
            <div className="flex justify-between gap-3 text-sm text-gray-700 mb-2">
              <span>مبلغ کل:</span>
              <span className="font-bold whitespace-nowrap">
                {formatToman(order.totalAmount)}
              </span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between gap-3 text-sm text-gray-700 mb-2">
                <span>تخفیف:</span>
                <span className="font-bold whitespace-nowrap text-green-600">
                  {formatToman(order.discountAmount)}
                </span>
              </div>
            )}
            <div className="flex justify-between gap-3 text-sm text-gray-700 mb-2">
              <span>مبلغ نهایی:</span>
              <span className="font-bold whitespace-nowrap">
                {formatToman(order.finalAmount)}
              </span>
            </div>
            {order.couponCode && (
              <div className="text-sm text-gray-700 mb-2">
                کد تخفیف:{" "}
                <span className="font-medium">{order.couponCode}</span>
              </div>
            )}
            {order.pointsRedeemed > 0 && (
              <div className="text-sm text-gray-700 mb-2">
                امتیاز مصرف شده:{" "}
                <span className="font-medium">{order.pointsRedeemed}</span>
              </div>
            )}
          </div>
          {hasLocation && (
            <div className="bg-white rounded-lg shadow p-4 border border-[#A9CBF5]/30">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-[#1473E6]" />
                <h3 className="font-semibold text-base">آدرس تحویل</h3>
              </div>
              {receiverName && (
                <div className="text-sm text-gray-700 mb-2 leading-relaxed">
                  <span className="text-gray-500">گیرنده: </span>
                  <span className="font-medium">{receiverName}</span>
                </div>
              )}
              {city && (
                <div className="text-sm text-gray-700 mb-2 leading-relaxed">
                  <span className="text-gray-500">شهر: </span>
                  <span className="font-medium">{city}</span>
                </div>
              )}
              {addressLine && (
                <div className="text-sm text-gray-700 mb-2 leading-relaxed">
                  <span className="text-gray-500">نشانی: </span>
                  <span className="font-medium">{addressLine}</span>
                </div>
              )}
              {plaque && (
                <div className="text-sm text-gray-700 mb-2 leading-relaxed">
                  <span className="text-gray-500">پلاک: </span>
                  <span className="font-medium">{plaque}</span>
                </div>
              )}
              {note && (
                <div className="text-sm text-gray-700 leading-relaxed">
                  <span className="text-gray-500">توضیحات: </span>
                  <span className="font-medium">{note}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
