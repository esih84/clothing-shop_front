import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import RetryPaymentButton from "./retry-payment-button";

export const dynamic = "force-dynamic";

/**
 * صفحه‌ی نتیجه‌ی پرداخت. زرین‌پال ابتدا به بک‌اند (`/api/v1/payments/verify`)
 * برمی‌گردد؛ بک‌اند پس از تأیید کاربر را به اینجا هدایت می‌کند با پارامترهای
 * status / orderId / refId.
 */
export default async function PaymentCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    orderId?: string;
    refId?: string;
  }>;
}) {
  const { status, orderId, refId } = await searchParams;
  const success = status === "success";

  return (
    <div
      className="max-w-md mx-auto p-4 py-10"
      style={{ direction: "rtl" }}
    >
      <div className="bg-white rounded-2xl shadow-sm border border-[#A9CBF5]/30 p-6 text-center space-y-4">
        {success ? (
          <>
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h1 className="text-xl font-bold text-gray-800">
              پرداخت با موفقیت انجام شد
            </h1>
            <p className="text-sm text-gray-600">
              سفارش شما ثبت و تأیید شد. از خرید شما سپاسگزاریم.
            </p>
            {refId && (
              <p className="text-sm text-gray-700" dir="ltr">
                کد پیگیری پرداخت: <span className="font-bold">{refId}</span>
              </p>
            )}
            <div className="pt-2 space-y-2">
              {orderId && (
                <Link
                  href={`/order/${orderId}`}
                  className="block w-full bg-secondary text-secondary-foreground rounded-2xl py-3 font-medium hover:bg-secondary/90 transition-colors"
                >
                  مشاهده‌ی سفارش
                </Link>
              )}
              <Link
                href="/"
                className="block w-full text-[#1473E6] rounded-2xl py-2 font-medium hover:underline"
              >
                بازگشت به فروشگاه
              </Link>
            </div>
          </>
        ) : (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h1 className="text-xl font-bold text-gray-800">
              پرداخت ناموفق بود
            </h1>
            <p className="text-sm text-gray-600">
              تراکنش شما تأیید نشد یا لغو شد. مبلغی از حساب شما کسر نشده است؛
              می‌توانید دوباره تلاش کنید.
            </p>
            <div className="pt-2 space-y-2">
              {orderId && <RetryPaymentButton orderId={orderId} />}
              {orderId && (
                <Link
                  href={`/order/${orderId}`}
                  className="block w-full text-[#1473E6] rounded-2xl py-2 font-medium hover:underline"
                >
                  مشاهده‌ی سفارش
                </Link>
              )}
              <Link
                href="/cart"
                className="block w-full text-gray-500 rounded-2xl py-2 font-medium hover:underline"
              >
                بازگشت به سبد خرید
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
