"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  ShoppingBag,
  MapPin,
  Plus,
  Check,
  ChevronDown,
  Loader2,
  PawPrint,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { useCurrentUser, useIsLoggedIn } from "@/features/auth/queries";
import { useCart, useCartAvailability } from "@/features/cart/queries";
import { cartService } from "@/features/cart/cart-api";
import { CART_KEY } from "@/features/query-keys";
import {
  getApiErrorMessage,
  getApiErrorOrder,
} from "@/shared/api/get-error-message";
import RetryPaymentButton from "../payment/callback/retry-payment-button";
import { useAddresses } from "@/features/address/queries";
import { usePets } from "@/features/pet/queries";
import {
  useApplyCoupon,
  useRemoveCoupon,
  useValidateCoupon,
} from "@/features/coupon/mutations";
import { useCheckout } from "@/features/payment/mutations";
import { useSendOtp } from "@/features/auth/mutations";
import { useOtpTimer } from "@/features/auth/use-otp-timer";
import { formatToman } from "@/shared/lib/utils";
import { normalizeDigits } from "@/shared/lib/digits";
import ProvinceCitySelect from "@/shared/components/global/province-city-select";
import { useProvinces, findProvinceByCity } from "@/features/location/queries";
import { useShippingMethods } from "@/features/shipping-method/queries";
import { shippingMethodsFor } from "@/shared/lib/shipping";
import type { Address } from "@/features/address/address-api";

/** Pending order form for a user who is sent to login mid-checkout */
const PENDING_ORDER_KEY = "pending-order";

/** A pending order older than this is abandoned rather than submitted behind the user's back. */
const PENDING_ORDER_TTL_MS = 30 * 60 * 1000;

/**
 * Hard cap on how long the auto-finalize waits for the session and the server cart before it
 * gives up and hands control back to the user. Without it a cart that never arrives leaves the
 * page spinning forever with no order ever sent.
 */
const FINALIZE_TIMEOUT_MS = 15_000;

/** Payment methods (currently only Zarinpal; the structure is ready for adding more). */
const PAYMENT_METHODS = [
  {
    id: "zarinpal",
    label: "پرداخت آنلاین (زرین‌پال)",
    desc: "انتقال به درگاه امن زرین‌پال",
  },
] as const;

type PaymentMethodId = (typeof PAYMENT_METHODS)[number]["id"];

interface PendingOrder {
  firstName: string;
  lastName: string;
  petName: string;
  /** Only used for the guest OTP flow; the order itself takes the phone from the session. */
  phone: string;
  province: string;
  city: string;
  address: string;
  plaque: string;
  postalCode: string;
  note: string;
  selectedAddressId: string | null;
  saveNewAddress: boolean;
  addressLabel: string;
  couponCode: string | null;
  /** Slug of a method from the panel; re-derived from the city on restore. */
  shippingMethod: string | null;
  /**
   * The cart as it was when the guest left for login. If the merge after login did not reach
   * the server, these lines are pushed again so the order can still be placed.
   */
  lines: { productId: string; quantity: number }[];
  createdAt: number;
}

/** Reads the stored pending order, returning null when it is missing, malformed, or too old. */
function readPendingOrder(): PendingOrder | null {
  const raw = sessionStorage.getItem(PENDING_ORDER_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PendingOrder;
    if (typeof parsed?.createdAt !== "number") return null;
    if (Date.now() - parsed.createdAt > PENDING_ORDER_TTL_MS) return null;
    if (!Array.isArray(parsed.lines)) parsed.lines = [];
    return parsed;
  } catch {
    return null;
  }
}

/** Where the auto-finalize (after returning from login) currently stands. */
type FinalizeState = "idle" | "waiting" | "submitting" | "failed";

export default function CheckoutPage() {
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();
  const checkout = useCheckout();
  const { lines: cartItems, isCartSettled } = useCart();
  const { provinces } = useProvinces();
  // Last line of defence: stock can run out between the cart page and here.
  const { unavailableLines, hasUnavailable } = useCartAvailability(cartItems);
  const qc = useQueryClient();
  const applyCoupon = useApplyCoupon();
  const removeCouponMutation = useRemoveCoupon();
  const validateCoupon = useValidateCoupon();
  const sendOtp = useSendOtp();
  const otpTimer = useOtpTimer();
  const { data: currentUser } = useCurrentUser();
  const { data: addresses = [] } = useAddresses();
  const { data: pets = [] } = usePets();
  const [mounted, setMounted] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [petName, setPetName] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [plaque, setPlaque] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [postalCodeError, setPostalCodeError] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Phone of a guest checking out: the OTP is sent from here so the login page
  // only has to ask for the code.
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Discount code
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Payment method
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodId>("zarinpal");

  // Shipping method — the list comes from the panel, filtered by the chosen city.
  const {
    data: allShippingMethods = [],
    isPending: shippingLoading,
    isError: shippingFailed,
  } = useShippingMethods();
  const [shippingMethod, setShippingMethod] = useState<string | null>(null);

  // Saved addresses
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [saveNewAddress, setSaveNewAddress] = useState(true);
  const [addressLabel, setAddressLabel] = useState("خانه");

  // Automatically submit the pending order after returning from login
  const [finalizeState, setFinalizeState] = useState<FinalizeState>("idle");
  const [finalizeTimedOut, setFinalizeTimedOut] = useState(false);
  const autoSubmitted = useRef(false);
  const formRestored = useRef(false);

  // The order exists but the gateway could not be reached — the user can still pay it.
  const [pendingPayment, setPendingPayment] = useState<{
    orderId: string;
    orderNumber?: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    if (readPendingOrder()) {
      setFinalizeState("waiting");
    } else {
      // Missing, malformed, or expired — drop it so a reload never re-enters the finalize path.
      sessionStorage.removeItem(PENDING_ORDER_KEY);
    }
  }, []);

  // Bound the wait for the session/cart so the page can never spin indefinitely.
  useEffect(() => {
    if (finalizeState !== "waiting") return;
    const timer = setTimeout(() => setFinalizeTimedOut(true), FINALIZE_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [finalizeState]);

  // Fill the name from the profile once the user is loaded
  useEffect(() => {
    if (!currentUser) return;
    setFirstName((v) => v || currentUser.firstName || "");
    setLastName((v) => v || currentUser.lastName || "");
  }, [currentUser]);

  // Auto-select the default address once addresses are loaded
  useEffect(() => {
    if (addresses.length === 0 || selectedAddressId || useNewAddress) return;
    if (city || address) return; // The user has already entered something
    const def = addresses.find((a) => a.isDefault) ?? addresses[0];
    setSelectedAddressId(def.id);
    setProvince(def.province ?? findProvinceByCity(provinces, def.city) ?? "");
    setCity(def.city);
    setAddress(def.address);
    setPlaque(def.plaque);
    setPostalCode(def.postalCode ?? "");
  }, [addresses]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the shipping method valid for the selected city: a method scoped to
  // other cities (or one the admin just disabled) must never stay selected.
  const availableShippingMethods = useMemo(
    () => shippingMethodsFor(city, allShippingMethods),
    [city, allShippingMethods],
  );

  useEffect(() => {
    if (availableShippingMethods.some((m) => m.slug === shippingMethod)) return;
    setShippingMethod(availableShippingMethods[0]?.slug ?? null);
  }, [availableShippingMethods, shippingMethod]);

  const submitOrder = async (payload: PendingOrder) => {
    setSubmitError(null);
    setPendingPayment(null);
    setSubmitting(true);
    try {
      // One request: builds the order from the cart, creates the payment transaction, and
      // returns the gateway URL. The backend empties the cart as soon as the order exists
      // (stock is reserved there); the order then waits in AWAITING_PAYMENT until it is paid.
      const { gatewayUrl } = await checkout.mutateAsync({
        shippingAddress: {
          firstName: payload.firstName,
          lastName: payload.lastName,
          petName: payload.petName,
          province: payload.province,
          city: payload.city,
          address: payload.address,
          plaque: payload.plaque,
          postalCode: payload.postalCode,
          note: payload.note,
        },
        shippingMethod: payload.shippingMethod ?? undefined,
        // The backend adds it to the address book after the order is created, so the redirect
        // below is not held up by a second request.
        saveShippingAddress: !payload.selectedAddressId && payload.saveNewAddress,
        addressLabel: payload.addressLabel.trim() || payload.city,
        shippingAddressId: payload.selectedAddressId ?? undefined,
      });
      window.location.href = gatewayUrl;
    } catch (err) {
      // The order may already exist and only the gateway leg failed; in that case the backend
      // returns its id so the user gets a retry button instead of a dead end.
      const order = getApiErrorOrder(err);
      if (order) setPendingPayment(order);
      setSubmitError(
        getApiErrorMessage(
          err,
          "ثبت سفارش یا اتصال به درگاه پرداخت با خطا مواجه شد. لطفاً دوباره تلاش کنید.",
        ),
      );
      setFinalizeState("failed");
      setSubmitting(false);
    }
  };

  // After returning from login: restore the saved form and submit the order automatically.
  // Every exit path must clear the stored order and leave the "waiting" state, otherwise the
  // page renders its spinner forever without ever sending a request.
  useEffect(() => {
    if (!mounted || finalizeState !== "waiting" || autoSubmitted.current) return;

    const pending = readPendingOrder();
    if (!pending) {
      sessionStorage.removeItem(PENDING_ORDER_KEY);
      setFinalizeState("idle");
      return;
    }

    // Re-derive the shipping method from the city so a stale pair can never be ordered
    const allowed = shippingMethodsFor(pending.city, allShippingMethods);
    pending.shippingMethod = allowed.some((m) => m.slug === pending.shippingMethod)
      ? pending.shippingMethod
      : (allowed[0]?.slug ?? null);

    // Put what the customer typed back on screen right away — it must survive a failure too.
    if (!formRestored.current) {
      formRestored.current = true;
      setFirstName(pending.firstName);
      setLastName(pending.lastName);
      setPetName(pending.petName);
      setProvince(pending.province ?? "");
      setCity(pending.city);
      setAddress(pending.address);
      setPlaque(pending.plaque);
      setPostalCode(pending.postalCode ?? "");
      setNote(pending.note);
      setSaveNewAddress(pending.saveNewAddress);
      setAddressLabel(pending.addressLabel);
      setShippingMethod(pending.shippingMethod);
      if (pending.couponCode) setCouponInput(pending.couponCode);
    }

    // Keep waiting for the session, the cart, and the shipping methods (without them the
    // order would be submitted with none), but only until the timeout fires.
    if (
      !finalizeTimedOut &&
      (!isLoggedIn || !isCartSettled || shippingLoading)
    )
      return;

    // From here we commit to a single attempt and never re-enter this effect.
    autoSubmitted.current = true;
    sessionStorage.removeItem(PENDING_ORDER_KEY);

    void (async () => {
      if (!isLoggedIn) {
        setFinalizeState("failed");
        setSubmitError(
          "ورود شما تأیید نشد. لطفاً دوباره وارد شوید و سفارش را ثبت کنید.",
        );
        return;
      }

      let hasItems = cartItems.length > 0;
      if (!hasItems && pending.lines.length > 0) {
        // The guest cart never made it to the server (the merge was skipped or failed). Push it
        // once more here — otherwise the order could never be placed and the cart would be lost.
        try {
          const res = await cartService.merge(pending.lines);
          const merged = res.data.data;
          qc.setQueryData(CART_KEY, merged);
          hasItems = (merged.items?.length ?? 0) > 0;
        } catch {}
      }
      if (!hasItems) {
        setFinalizeState("failed");
        setSubmitError(
          "سبد خرید شما خالی است؛ ممکن است کالاهای انتخابی ناموجود شده باشند. لطفاً دوباره آن‌ها را به سبد اضافه کنید.",
        );
        return;
      }

      // The coupon must be re-applied to the merged server cart so it is counted when the order is placed
      if (pending.couponCode) {
        try {
          const res = await applyCoupon.mutateAsync(pending.couponCode);
          setAppliedCoupon({ code: res.coupon.code, discount: res.discount });
        } catch {
          setAppliedCoupon(null);
        }
      }

      setFinalizeState("submitting");
      await submitOrder(pending);
    })();
  }, [
    mounted,
    finalizeState,
    finalizeTimedOut,
    isLoggedIn,
    isCartSettled,
    cartItems.length,
    shippingLoading,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted) return null;

  const hasSavedAddresses = addresses.length > 0;

  const handleSelectSavedAddress = (saved: Address) => {
    setSelectedAddressId(saved.id);
    // Addresses saved before the province picker only carry a city
    setProvince(saved.province ?? findProvinceByCity(provinces, saved.city) ?? "");
    setCity(saved.city);
    setAddress(saved.address);
    setPlaque(saved.plaque);
    setPostalCode(saved.postalCode ?? "");
    setUseNewAddress(false);
    setShowAddressDropdown(false);
    setLocationError(null);
  };

  const handleUseNewAddress = () => {
    setSelectedAddressId(null);
    setProvince("");
    setCity("");
    setAddress("");
    setPlaque("");
    setPostalCode("");
    setUseNewAddress(true);
    setShowAddressDropdown(false);
    setLocationError(null);
  };

  const handleApplyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) return;
    setCouponError(null);
    try {
      if (isLoggedIn) {
        // Logged-in: apply against the real server cart (authoritative; stored on the cart).
        const res = await applyCoupon.mutateAsync(code);
        setAppliedCoupon({ code: res.coupon.code, discount: res.discount });
      } else {
        // Guest: validate the code publicly against the guest cart lines. The final, authoritative
        // apply happens on the real cart right after login (see the auto-finalize effect below).
        const res = await validateCoupon.mutateAsync({
          code,
          lines: cartItems.map((it) => ({
            productId: it.productId,
            unitPrice: it.price,
            quantity: it.quantity,
            hasProductDiscount: it.originalPrice > it.price,
          })),
        });
        if (!res.valid || !res.coupon) {
          setCouponError(
            res.requiresLogin
              ? "برای استفاده از این کد ابتدا وارد شوید."
              : "کد تخفیف معتبر نیست.",
          );
          setAppliedCoupon(null);
          return;
        }
        setAppliedCoupon({
          code: res.coupon.code,
          discount: res.discount ?? 0,
        });
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string | string[] } } })
          ?.response?.data?.message ?? "کد تخفیف معتبر نیست.";
      setCouponError(Array.isArray(message) ? message[0] : message);
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
    removeCouponMutation.mutate();
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = 0;
  const discount = appliedCoupon?.discount ?? 0;
  const total = Math.max(0, subtotal + shipping - discount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocationError(null);
    setPhoneError(null);
    setPostalCodeError(null);

    // The province/city pickers are not native inputs, so they are checked here
    if (!province || !city) {
      setLocationError("لطفاً استان و شهر را انتخاب کنید.");
      return;
    }

    // Iranian postal codes are exactly 10 digits; the backend rejects anything else, and a
    // shipment cannot be handed over without one.
    if (!/^\d{10}$/.test(normalizeDigits(postalCode))) {
      setPostalCodeError("کد پستی باید ۱۰ رقم باشد.");
      return;
    }

    // No method is offered for this city (the admin defined none, or disabled them all).
    // The backend would reject the order anyway, so stop here with a readable message.
    if (!shippingMethod) {
      setSubmitError(
        shippingLoading
          ? "روش‌های ارسال هنوز بارگذاری نشده‌اند. لحظه‌ای صبر کنید."
          : shippingFailed
            ? "دریافت روش‌های ارسال با خطا مواجه شد. صفحه را دوباره بارگذاری کنید."
            : "برای شهر انتخاب‌شده روش ارسالی تعریف نشده است. لطفاً شهر دیگری انتخاب کنید یا با پشتیبانی تماس بگیرید.",
      );
      return;
    }

    // Checked before the OTP is sent: the backend drops unavailable lines when the guest cart is
    // merged, and finding that out after logging in is the worst possible moment.
    if (hasUnavailable) {
      setSubmitError(
        unavailableLines.length === 1
          ? `«${unavailableLines[0].name}» دیگر موجود نیست. لطفاً آن را از سبد خرید حذف کنید.`
          : `${unavailableLines.length} کالای سبد شما دیگر موجود نیست. لطفاً آن‌ها را از سبد خرید حذف کنید.`,
      );
      return;
    }

    const payload: PendingOrder = {
      firstName,
      lastName,
      petName,
      phone,
      province,
      city,
      address,
      plaque,
      postalCode: normalizeDigits(postalCode),
      note,
      selectedAddressId,
      saveNewAddress,
      addressLabel,
      couponCode: appliedCoupon?.code ?? null,
      shippingMethod,
      lines: cartItems.map((it) => ({
        productId: it.productId,
        quantity: it.quantity,
      })),
      createdAt: Date.now(),
    };

    if (!isLoggedIn) {
      const normalizedPhone = normalizeDigits(phone);
      if (!/^09\d{9}$/.test(normalizedPhone)) {
        setPhoneError("شماره موبایل معتبر نیست. نمونه: ۰۹۱۲۳۴۵۶۷۸۹");
        return;
      }
      // Send the code from here so the login page opens straight on the code
      // step. An OTP already in flight for this number is reused instead of
      // sent again (the backend enforces a 60s cooldown per number).
      const hasLiveOtp =
        otpTimer.session?.phone === normalizedPhone && otpTimer.remaining > 0;
      if (!hasLiveOtp) {
        try {
          setSubmitting(true);
          await sendOtp.mutateAsync(normalizedPhone);
          otpTimer.start(normalizedPhone);
        } catch {
          setPhoneError("ارسال کد تأیید با خطا مواجه شد. دوباره تلاش کنید.");
          return;
        } finally {
          setSubmitting(false);
        }
      }
      // We keep the form so it is submitted automatically after login
      payload.phone = normalizedPhone;
      sessionStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(payload));
      router.push("/login?redirect=/checkout");
      return;
    }
    await submitOrder(payload);
  };

  // Finalizing the pending order (after login). Bounded by FINALIZE_TIMEOUT_MS, so this
  // screen always resolves into either the gateway, an error, or the form.
  if (finalizeState === "waiting" || finalizeState === "submitting") {
    return (
      <div className="pt-16 pb-24 px-4 mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-secondary animate-spin" />
          <p className="text-muted-foreground text-base md:text-lg">
            در حال ثبت نهایی سفارش شما...
          </p>
        </div>
      </div>
    );
  }

  // The order was registered but the gateway could not be reached: it is waiting for payment,
  // so the user is offered a retry instead of being told the whole thing failed.
  if (pendingPayment) {
    return (
      <div className="pt-16 pb-24 px-4 mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-center py-12 max-w-md mx-auto">
          <div className="bg-amber-100 p-4 mb-4 rounded-2xl">
            <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-amber-600" />
          </div>
          <h2 className="text-xl md:text-2xl font-medium mb-2 text-center">
            سفارش شما ثبت شد، اما پرداخت انجام نشد
          </h2>
          <p className="text-muted-foreground text-center mb-6 text-base md:text-lg">
            {pendingPayment.orderNumber
              ? `سفارش ${pendingPayment.orderNumber} در وضعیت «در انتظار پرداخت» ثبت شد`
              : "سفارش شما در وضعیت «در انتظار پرداخت» ثبت شد"}
            ، ولی اتصال به درگاه برقرار نشد. می‌توانید همین‌جا دوباره پرداخت کنید.
          </p>
          <RetryPaymentButton orderId={pendingPayment.orderId} />
          <Link
            href="/profile"
            className="mt-3 text-sm text-muted-foreground hover:text-secondary transition-colors"
          >
            مشاهده سفارش‌های من
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="pt-16 pb-24 px-4 mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-primary/15 p-4 mb-4 rounded-2xl">
            <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 text-secondary" />
          </div>
          <h2 className="text-xl md:text-2xl font-medium mb-2">
            سبد خرید شما خالی است
          </h2>
          {submitError ? (
            <p className="text-red-600 text-center mb-6 text-base md:text-lg max-w-md">
              {submitError}
            </p>
          ) : (
            <p className="text-muted-foreground text-center mb-6 text-base md:text-lg">
              برای پرداخت ابتدا محصولی به سبد خرید اضافه کنید.
            </p>
          )}
          <Link
            href="/"
            className="bg-secondary text-secondary-foreground px-6 py-3 font-medium inline-block text-base md:text-lg rounded-2xl hover:bg-secondary/90 transition-colors"
          >
            شروع به خرید
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-24 px-4 mx-auto max-w-6xl">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recipient Info */}
            <div className="bg-card p-4 md:p-6 shadow-sm border border-border rounded-2xl">
              <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-secondary text-white text-sm flex items-center justify-center font-bold rounded-lg">
                  ۱
                </span>
                اطلاعات گیرنده
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm md:text-base text-muted-foreground mb-1">
                    نام <span className="text-secondary">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder="نام خود را وارد کنید"
                    className="w-full border border-border px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-secondary bg-card rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm md:text-base text-muted-foreground mb-1">
                    نام خانوادگی <span className="text-secondary">*</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder="نام خانوادگی خود را وارد کنید"
                    className="w-full border border-border px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-secondary bg-card rounded-xl"
                  />
                </div>
                {!isLoggedIn && (
                  <div>
                    <label className="block text-sm md:text-base text-muted-foreground mb-1">
                      شماره موبایل <span className="text-secondary">*</span>
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      dir="ltr"
                      maxLength={11}
                      value={phone}
                      onChange={(e) => {
                        setPhone(
                          normalizeDigits(e.target.value)
                            .replace(/\D/g, "")
                            .slice(0, 11),
                        );
                        setPhoneError(null);
                      }}
                      placeholder="09123456789"
                      className="w-full border border-border px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-secondary bg-card rounded-xl"
                    />

                    {phoneError && (
                      <p className="text-xs text-red-600 mt-1">{phoneError}</p>
                    )}
                  </div>
                )}
                <div className="sm:col-span-2">
                  <label className="block text-sm md:text-base text-muted-foreground mb-1">
                    نام حیوان خانگی شما 🐾{" "}
                    <span className="text-muted-foreground text-xs">
                      (اختیاری)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="مثال: پوپک"
                    className="w-full border border-border px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-secondary bg-card rounded-xl"
                  />
                  {pets.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {pets.map((pet) => (
                        <button
                          key={pet.id}
                          type="button"
                          onClick={() => setPetName(pet.name)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs md:text-sm border transition-colors ${
                            petName === pet.name
                              ? "bg-secondary text-secondary-foreground border-secondary"
                              : "bg-primary/15 text-foreground border-border hover:border-secondary"
                          }`}
                        >
                          <PawPrint className="w-3.5 h-3.5" />
                          {pet.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-card p-4 md:p-6 shadow-sm border border-border rounded-2xl">
              <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-secondary text-white text-sm flex items-center justify-center font-bold rounded-lg">
                  ۲
                </span>
                آدرس تحویل
              </h2>

              {/* Saved Addresses */}
              {hasSavedAddresses && (
                <div className="mb-5">
                  <p className="text-sm md:text-base text-muted-foreground mb-2">
                    آدرس‌های ذخیره شده
                  </p>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setShowAddressDropdown(!showAddressDropdown)
                      }
                      className="w-full flex items-center justify-between border border-border px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-secondary bg-card rounded-xl"
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-secondary" />
                        {selectedAddressId
                          ? addresses.find((a) => a.id === selectedAddressId)
                              ?.label
                          : useNewAddress
                            ? "آدرس جدید"
                            : "انتخاب آدرس"}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground transition-transform ${
                          showAddressDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {showAddressDropdown && (
                      <div className="absolute top-full right-0 left-0 bg-card border border-border border-t-0 z-10 shadow-md rounded-b-xl overflow-hidden">
                        {addresses.map((saved) => (
                          <button
                            key={saved.id}
                            type="button"
                            onClick={() => handleSelectSavedAddress(saved)}
                            className="w-full flex items-center justify-between px-3 py-3 text-sm md:text-base hover:bg-primary/15 text-right"
                          >
                            <span className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
                              <span>
                                <span className="font-medium">
                                  {saved.label}
                                </span>
                                <span className="text-muted-foreground mr-2">
                                  {saved.city}، {saved.address}
                                </span>
                              </span>
                            </span>
                            {selectedAddressId === saved.id && (
                              <Check className="w-4 h-4 text-secondary" />
                            )}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={handleUseNewAddress}
                          className="w-full flex items-center gap-2 px-3 py-3 text-sm md:text-base hover:bg-primary/15 text-secondary border-t border-border"
                        >
                          <Plus className="w-4 h-4" />
                          افزودن آدرس جدید
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Address Fields */}
              <div className="space-y-4">
                <ProvinceCitySelect
                  province={province}
                  city={city}
                  onChange={(next) => {
                    setProvince(next.province);
                    setCity(next.city);
                    setLocationError(null);
                  }}
                  error={locationError}
                  triggerClassName="border border-border px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-secondary bg-card rounded-xl"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm md:text-base text-muted-foreground mb-1">
                      پلاک <span className="text-secondary">*</span>
                    </label>
                    <input
                      type="text"
                      value={plaque}
                      onChange={(e) => setPlaque(e.target.value)}
                      required
                      placeholder="مثال: ۱۲"
                      className="w-full border border-border px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-secondary bg-card rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm md:text-base text-muted-foreground mb-1">
                      کد پستی <span className="text-secondary">*</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      dir="ltr"
                      maxLength={10}
                      value={postalCode}
                      onChange={(e) => {
                        setPostalCode(
                          normalizeDigits(e.target.value)
                            .replace(/\D/g, "")
                            .slice(0, 10),
                        );
                        setPostalCodeError(null);
                      }}
                      required
                      placeholder="۱۰ رقم بدون خط تیره"
                      className="w-full border border-border px-3 py-2 md:py-3 text-sm md:text-base text-right focus:outline-none focus:border-secondary bg-card rounded-xl"
                    />
                    {postalCodeError && (
                      <p className="mt-1 text-xs text-red-600">{postalCodeError}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm md:text-base text-muted-foreground mb-1">
                    آدرس کامل <span className="text-secondary">*</span>
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    rows={3}
                    placeholder="خیابان، کوچه، ..."
                    className="w-full border border-border px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-secondary bg-card resize-none rounded-xl"
                  />
                </div>

                {/* Save the new address in the address book */}
                {!selectedAddressId && (
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm md:text-base text-muted-foreground cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={saveNewAddress}
                        onChange={(e) => setSaveNewAddress(e.target.checked)}
                        className="w-4 h-4 accent-secondary"
                      />
                      این آدرس در حساب من ذخیره شود
                    </label>
                    {saveNewAddress && (
                      <div>
                        <label className="block text-sm md:text-base text-muted-foreground mb-1">
                          عنوان آدرس
                        </label>
                        <input
                          type="text"
                          value={addressLabel}
                          onChange={(e) => setAddressLabel(e.target.value)}
                          placeholder="مثال: خانه، محل کار"
                          className="w-full sm:w-1/2 border border-border px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-secondary bg-card rounded-xl"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm md:text-base text-muted-foreground mb-1">
                    یادداشت{" "}
                    <span className="text-muted-foreground text-xs">
                      (اختیاری)
                    </span>
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    placeholder="توضیحات اضافه برای پیک یا فروشنده..."
                    className="w-full border border-border px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-secondary bg-card resize-none rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Order Items Summary (collapsed list) */}
            <div className="bg-card p-4 md:p-6 shadow-sm border border-border rounded-2xl">
              <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-secondary text-white text-sm flex items-center justify-center font-bold rounded-lg">
                  ۳
                </span>
                اقلام سفارش
              </h2>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-start gap-3 py-3 border-b border-border/20 last:border-0"
                  >
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/15 flex-shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-normal text-sm md:text-base leading-snug break-words">
                        {item.name}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <div className="flex flex-col gap-0.5 min-w-0">
                          {item.originalPrice > item.price && (
                            <span className="text-[11px] text-muted-foreground line-through">
                              {formatToman(item.originalPrice * item.quantity)}
                            </span>
                          )}
                          <p className="font-bold text-sm md:text-base text-secondary">
                            {formatToman(item.price * item.quantity)}
                          </p>
                        </div>
                        <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">
                          تعداد: {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-4">
            <div className="bg-card p-6 shadow-sm border border-border h-fit rounded-2xl sticky top-20">
              {/* Discount code */}
              <div className="mb-5">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                    <span className="text-sm text-green-700 flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      کد «{appliedCoupon.code}» اعمال شد
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs text-red-500 hover:underline"
                    >
                      حذف
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="کد تخفیف"
                      className="flex-1 min-w-0 border border-border px-3 py-2 text-sm focus:outline-none focus:border-secondary bg-card rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={
                        applyCoupon.isPending ||
                        validateCoupon.isPending ||
                        !couponInput.trim()
                      }
                      className="bg-secondary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary/90 transition-colors disabled:opacity-60 flex items-center gap-1.5"
                    >
                      {(applyCoupon.isPending || validateCoupon.isPending) && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      اعمال
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-xs text-red-600 mt-1.5">{couponError}</p>
                )}
                {!isLoggedIn && appliedCoupon && (
                  <p className="text-xs text-muted-foreground mt-1.5">
                    این کد پس از ورود روی سبد شما نهایی می‌شود.
                  </p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-base md:text-lg">
                  <span className="text-muted-foreground">جمع جزء</span>
                  <span className="font-medium">{formatToman(subtotal)}</span>
                </div>
                {/* <div className="flex justify-between text-base md:text-lg">
                  <span className="text-muted-foreground">ارسال</span>
                  <span className="font-medium text-muted-foreground">پس‌کرایه</span>
                </div> */}
                {discount > 0 && (
                  <div className="flex justify-between text-base md:text-lg">
                    <span className="text-muted-foreground">تخفیف</span>
                    <span className="font-medium text-green-600">
                      {formatToman(-discount)}
                    </span>
                  </div>
                )}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg md:text-xl">
                    <span>جمع کل</span>
                    <span>{formatToman(total)}</span>
                  </div>
                </div>
              </div>
              {/* Shipping method */}
              <div className="mb-5">
                <h3 className="text-sm font-medium text-foreground mb-2">
                  روش ارسال
                </h3>
                <div className="space-y-2">
                  {shippingLoading ? (
                    <p className="text-xs text-muted-foreground py-2">
                      در حال بارگذاری روش‌های ارسال…
                    </p>
                  ) : availableShippingMethods.length === 0 ? (
                    <p className="text-xs text-red-600 py-2">
                      {shippingFailed
                        ? "دریافت روش‌های ارسال با خطا مواجه شد. صفحه را دوباره بارگذاری کنید."
                        : city
                          ? "برای این شهر روش ارسالی تعریف نشده است."
                          : "برای دیدن روش‌های ارسال، ابتدا شهر را انتخاب کنید."}
                    </p>
                  ) : (
                    availableShippingMethods.map((m) => (
                      <label
                        key={m.slug}
                        className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 cursor-pointer transition-colors ${
                          shippingMethod === m.slug
                            ? "border-secondary bg-secondary/5"
                            : "border-border hover:border-border/70"
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping-method"
                          value={m.slug}
                          checked={shippingMethod === m.slug}
                          onChange={() => setShippingMethod(m.slug)}
                          className="mt-0.5 accent-secondary"
                        />
                        <span className="text-sm">
                          <span className="font-medium text-foreground">
                            {m.label}
                          </span>
                          {m.description && (
                            <span className="block text-xs text-muted-foreground mt-0.5">
                              {m.description}
                            </span>
                          )}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>
              {/* Payment method */}
              <div className="mb-5">
                <h3 className="text-sm font-medium text-foreground mb-2">
                  روش پرداخت
                </h3>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map((m) => (
                    <label
                      key={m.id}
                      className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 cursor-pointer transition-colors ${
                        paymentMethod === m.id
                          ? "border-secondary bg-secondary/5"
                          : "border-border hover:border-border/70"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value={m.id}
                        checked={paymentMethod === m.id}
                        onChange={() => setPaymentMethod(m.id)}
                        className="mt-0.5 accent-secondary"
                      />
                      <span className="text-sm">
                        <span className="font-medium text-foreground">
                          {m.label}
                        </span>
                        <span className="block text-xs text-muted-foreground mt-0.5">
                          {m.desc}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              {submitError && (
                <div className="mb-3 text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2 text-center">
                  {submitError}
                </div>
              )}
              <button
                type="submit"
                disabled={
                  submitting ||
                  sendOtp.isPending ||
                  hasUnavailable ||
                  shippingLoading ||
                  !shippingMethod
                }
                className="w-full bg-secondary text-secondary-foreground rounded-2xl py-3 md:py-4 font-medium text-base md:text-lg flex items-center justify-center gap-2 hover:bg-secondary/90 transition-colors disabled:opacity-60"
              >
                {(submitting || sendOtp.isPending) && (
                  <Loader2 className="w-5 h-5 animate-spin" />
                )}
                {isLoggedIn ? "تأیید و پرداخت" : "ارسال کد و ادامه"}
                <ArrowLeft className="h-6 w-6" />
              </button>
            </div>

            {/* Security note */}
            {/* <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground px-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0 text-green-600"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              پرداخت شما امن و رمزگذاری شده است
            </div> */}
          </div>
        </div>
      </form>
    </div>
  );
}
