"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useSendOtp, useVerifyOtp } from "@/features/auth/mutations";
import { useOtpTimer } from "@/features/auth/use-otp-timer";
import { useMergeGuestCart } from "@/features/cart/mutations";
import { normalizeDigits, toPersianDigits } from "@/shared/lib/digits";
import { brand } from "@/shared/config/brand";

function formatCountdown(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return toPersianDigits(`${m}:${String(s).padStart(2, "0")}`);
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Only internal paths are allowed to avoid an open redirect
  const redirectParam = searchParams.get("redirect");
  const redirectTo =
    redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//")
      ? redirectParam
      : "/profile";
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();
  const mergeGuestCart = useMergeGuestCart();
  const otpTimer = useOtpTimer();

  // Restore the code step after a refresh while an OTP session is still tracked,
  // so the persisted countdown keeps running instead of resetting.
  useEffect(() => {
    if (otpTimer.session && step === "phone") {
      setPhone(otpTimer.session.phone);
      setStep("code");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpTimer.session]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^09\d{9}$/.test(phone)) {
      setError("شماره موبایل معتبر نیست. نمونه: ۰۹۱۲۳۴۵۶۷۸۹");
      return;
    }
    try {
      await sendOtp.mutateAsync(phone);
      otpTimer.start(phone);
      setStep("code");
    } catch {
      setError("ارسال کد با خطا مواجه شد. دوباره تلاش کنید.");
    }
  };

  const handleResend = async () => {
    setError(null);
    setCode("");
    try {
      await sendOtp.mutateAsync(phone);
      otpTimer.start(phone);
    } catch {
      setError("ارسال مجدد کد با خطا مواجه شد. دوباره تلاش کنید.");
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
      otpTimer.clear();
      // Merge the guest cart with the server cart after login
      await mergeGuestCart.mutateAsync();
      router.push(redirectTo);
    } catch {
      setError("کد وارد شده نادرست یا منقضی شده است.");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-card rounded-3xl shadow-sm border border-border p-8">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/logo.png"
            alt={brand.name}
            width={180}
            height={50}
            priority
            className="h-12 w-auto object-contain mb-3"
          />
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
              maxLength={11}
              placeholder="09123456789"
              value={phone}
              onChange={(e) =>
                setPhone(
                  normalizeDigits(e.target.value)
                    .replace(/\D/g, "")
                    .slice(0, 11),
                )
              }
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

            {otpTimer.remaining > 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                ارسال مجدد کد تا{" "}
                <span className="font-medium text-foreground tabular-nums">
                  {formatCountdown(otpTimer.remaining)}
                </span>{" "}
                دیگر
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={sendOtp.isPending}
                className="w-full text-sm text-secondary hover:text-secondary/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {sendOtp.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                ارسال مجدد کد
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                otpTimer.clear();
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

export default function LoginPage() {
  // useSearchParams requires a Suspense boundary
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
