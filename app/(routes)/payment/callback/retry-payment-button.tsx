"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRetryPayment } from "@/features/payment/mutations";

/** دکمه‌ی تلاش مجدد پرداخت برای سفارشی که پرداختش ناموفق بوده است. */
export default function RetryPaymentButton({ orderId }: { orderId: string }) {
  const retryPayment = useRetryPayment();
  const [error, setError] = useState<string | null>(null);

  const retry = async () => {
    setError(null);
    try {
      const { gatewayUrl } = await retryPayment.mutateAsync({ orderId });
      window.location.href = gatewayUrl;
    } catch {
      setError("اتصال به درگاه پرداخت ممکن نشد. دوباره تلاش کنید.");
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={retry}
        disabled={retryPayment.isPending}
        className="w-full bg-secondary text-secondary-foreground rounded-2xl py-3 font-medium flex items-center justify-center gap-2 hover:bg-secondary/90 transition-colors disabled:opacity-60"
      >
        {retryPayment.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
        تلاش مجدد پرداخت
      </button>
      {error && (
        <p className="text-xs text-red-600 mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
