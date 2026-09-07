"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { paymentLinkService } from "@/features/payment/payment-link-api";
import { formatToman } from "@/shared/lib/utils";

/**
 * Starts the gateway payment for a shared link.
 *
 * The Zarinpal transaction is created here, on the click — not when the link was made — so a link
 * texted yesterday still opens a live gateway session today.
 */
export default function PayLinkButton({
  token,
  amount,
}: {
  token: string;
  amount: number;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pay = async () => {
    setError(null);
    setPending(true);
    try {
      const res = await paymentLinkService.start(token);
      window.location.href = res.data.data.gatewayUrl;
    } catch (err) {
      const message = (
        err as { response?: { data?: { message?: string } } }
      )?.response?.data?.message;
      setError(message ?? "اتصال به درگاه پرداخت ممکن نشد. دوباره تلاش کنید.");
      // Only stop the spinner on failure: on success the browser is on its way to the gateway,
      // and re-enabling the button would invite a second transaction.
      setPending(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      <button
        onClick={pay}
        disabled={pending}
        className="w-full bg-secondary text-secondary-foreground rounded-2xl py-3 font-medium flex items-center justify-center gap-2 hover:bg-secondary/90 transition-colors disabled:opacity-60"
      >
        {pending && <Loader2 className="w-5 h-5 animate-spin" />}
        پرداخت {formatToman(amount)}
      </button>
      {error && <p className="text-xs text-red-600 text-center">{error}</p>}
    </div>
  );
}
