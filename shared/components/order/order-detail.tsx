import React from "react";
import { ChevronRight, Package, MapPin, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Order } from "@/types/order";
import { formatToman, formatJalaliDate } from "@/shared/lib/utils";
import { getOrderStatus } from "@/features/order/order-status";
import RetryPaymentButton from "@/app/(routes)/payment/callback/retry-payment-button";

export interface OrderDetailProps {
  order: Order;
}

/** Safely reads a string field from the shipping address (jsonb). */
function addressField(
  address: Record<string, unknown> | undefined,
  key: string,
): string {
  const value = address?.[key];
  return typeof value === "string" ? value.trim() : "";
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order }) => {
  if (!order) return null;
  const status = getOrderStatus(order.status);
  const orderLabel = order.orderNumber ?? `#${order.id.slice(0, 8)}`;

  const sa = order.shippingAddress;
  const receiverName = [
    addressField(sa, "firstName"),
    addressField(sa, "lastName"),
  ]
    .filter(Boolean)
    .join(" ");
  const province = addressField(sa, "province");
  const city = addressField(sa, "city");
  const addressLine = addressField(sa, "address");
  const plaque = addressField(sa, "plaque");
  const postalCode = addressField(sa, "postalCode");
  const note = addressField(sa, "note");
  const hasLocation = Boolean(
    receiverName || city || addressLine || plaque || postalCode || note,
  );

  return (
    <div
      className="max-w-5xl mx-auto p-4 lg:py-8 space-y-6"
      style={{ direction: "rtl" }}
    >
      <div className="flex items-center gap-2">
        <Link
          href="/profile/orders"
          className="text-muted-foreground hover:text-secondary"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
        <h2 className="font-bold text-lg text-foreground">
          جزئیات سفارش {orderLabel}
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main column: order products (on mobile, after the summary and address) */}
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <div className="bg-card rounded-lg shadow p-4 border border-border">
            <h3 className="font-semibold text-base mb-3">محصولات سفارش</h3>
            <ul className="divide-y divide-gray-100">
              {order.items?.map((item) => (
                <li key={item.id} className="py-3 flex gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted border border-border flex items-center justify-center">
                    {item.productImage ? (
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="w-full font-normal text-foreground text-sm sm:text-base leading-snug break-words">
                      {item.productName}
                    </p>
                    <div className="mt-2 flex items-end justify-between gap-3">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        {item.originalUnitPrice != null &&
                          item.originalUnitPrice > item.unitPrice && (
                            <span className="text-xs text-muted-foreground line-through whitespace-nowrap">
                              {formatToman(
                                item.originalUnitPrice * item.quantity,
                              )}
                            </span>
                          )}
                        <p className="font-bold text-sm sm:text-base text-secondary whitespace-nowrap">
                          {formatToman(item.totalPrice)}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                        <span className="whitespace-nowrap">
                          تعداد: {item.quantity}
                        </span>
                        <span className="whitespace-nowrap text-tiny">
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

        {/* Side column: order summary and address (shown first on mobile) */}
        <div className="lg:col-span-1 space-y-6 order-1 lg:order-2">
          <div className="bg-card rounded-lg shadow p-4 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/15 border border-border flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-secondary" />
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground text-sm" dir="ltr">
                  سفارش {orderLabel}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
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
            <div className="flex justify-between gap-3 text-sm text-foreground mb-2">
              <span>مبلغ کل:</span>
              <span className="font-bold whitespace-nowrap">
                {formatToman(order.totalAmount)}
              </span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between gap-3 text-sm text-foreground mb-2">
                <span>تخفیف:</span>
                <span className="font-bold whitespace-nowrap text-green-600">
                  {formatToman(order.discountAmount)}
                </span>
              </div>
            )}
            <div className="flex justify-between gap-3 text-sm text-foreground mb-2">
              <span>مبلغ نهایی:</span>
              <span className="font-bold whitespace-nowrap">
                {formatToman(order.finalAmount)}
              </span>
            </div>
            {order.couponCode && (
              <div className="text-sm text-foreground mb-2">
                کد تخفیف:{" "}
                <span className="font-medium">{order.couponCode}</span>
              </div>
            )}
            {order.pointsRedeemed > 0 && (
              <div className="text-sm text-foreground mb-2">
                امتیاز مصرف شده:{" "}
                <span className="font-medium">{order.pointsRedeemed}</span>
              </div>
            )}
            {order.status === "awaiting_payment" && (
              <RetryPaymentButton orderId={order.id} />
            )}
          </div>
          {hasLocation && (
            <div className="bg-card rounded-lg shadow p-4 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-secondary" />
                <h3 className="font-semibold text-base">آدرس تحویل</h3>
              </div>
              {receiverName && (
                <div className="text-sm text-foreground mb-2 leading-relaxed">
                  <span className="text-muted-foreground">گیرنده: </span>
                  <span className="font-medium">{receiverName}</span>
                </div>
              )}
              {city && (
                <div className="text-sm text-foreground mb-2 leading-relaxed">
                  <span className="text-muted-foreground">شهر: </span>
                  <span className="font-medium">
                    {province ? `${province}، ${city}` : city}
                  </span>
                </div>
              )}
              {addressLine && (
                <div className="text-sm text-foreground mb-2 leading-relaxed">
                  <span className="text-muted-foreground">نشانی: </span>
                  <span className="font-medium">{addressLine}</span>
                </div>
              )}
              {plaque && (
                <div className="text-sm text-foreground mb-2 leading-relaxed">
                  <span className="text-muted-foreground">پلاک: </span>
                  <span className="font-medium">{plaque}</span>
                </div>
              )}
              {postalCode && (
                <div className="text-sm text-foreground mb-2 leading-relaxed">
                  <span className="text-muted-foreground">کد پستی: </span>
                  <span className="font-medium" dir="ltr">
                    {postalCode}
                  </span>
                </div>
              )}
              {note && (
                <div className="text-sm text-foreground leading-relaxed">
                  <span className="text-muted-foreground">توضیحات: </span>
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
