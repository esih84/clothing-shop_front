"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PawPrint, Loader2 } from "lucide-react";
import { useSendOtp, useVerifyOtp } from "@/features/auth/mutations";
import { useMergeGuestCart } from "@/features/cart/mutations";
import { normalizeDigits } from "@/shared/lib/digits";
import { brand } from "@/shared/config/brand";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();
  const mergeGuestCart = useMergeGuestCart();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^09\d{9}$/.test(phone)) {
      setError("شماره موبایل معتبر نیست. نمونه: ۰۹۱۲۳۴۵۶۷۸۹");
      return;
    }
    try {
      await sendOtp.mutateAsync(phone);
      setStep("code");
    } catch {
      setError("ارسال کد با خطا مواجه شد. دوباره تلاش کنید.");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (code.length !== 5) {
      setError("کد تأیید باید ۵ رقم باشد.");
      return;
    }
    try {
      await verifyOtp.mutateAsync({ phone, code });
      // ادغام سبد مهمان با سبد سرور پس از ورود
      await mergeGuestCart.mutateAsync();
      router.push("/profile");
    } catch {
      setError("کد وارد شده نادرست یا منقضی شده است.");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-border p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-3">
            <PawPrint className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">
            ورود به {brand.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            {step === "phone"
              ? "شماره موبایلت رو وارد کن تا کد تأیید برات بفرستیم"
              : `کد تأیید پیامک‌شده به ${phone} رو وارد کن`}
          </p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2 text-center">
            {error}
          </div>
        )}

        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              type="tel"
              inputMode="numeric"
              dir="ltr"
              placeholder="09123456789"
              value={phone}
              onChange={(e) => setPhone(normalizeDigits(e.target.value))}
              className="w-full text-center tracking-widest rounded-2xl border border-border bg-muted px-4 py-3 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15"
            />
            <button
              type="submit"
              disabled={sendOtp.isPending}
              className="w-full rounded-2xl bg-secondary text-secondary-foreground py-3 font-medium hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {sendOtp.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              ارسال کد تأیید
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <input
              type="text"
              inputMode="numeric"
              dir="ltr"
              maxLength={5}
              placeholder="-----"
              value={code}
              onChange={(e) =>
                setCode(normalizeDigits(e.target.value).slice(0, 5))
              }
              className="w-full text-center text-lg tracking-[0.5em] rounded-2xl border border-border bg-muted px-4 py-3 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15"
            />
            <button
              type="submit"
              disabled={verifyOtp.isPending}
              className="w-full rounded-2xl bg-secondary text-secondary-foreground py-3 font-medium hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {verifyOtp.isPending && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              ورود
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setCode("");
                setError(null);
              }}
              className="w-full text-sm text-muted-foreground hover:text-secondary transition-colors"
            >
              تغییر شماره موبایل
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
