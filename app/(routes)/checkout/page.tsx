"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  MapPin,
  Plus,
  Check,
  ChevronDown,
  Loader2,
  PawPrint,
  ArrowLeft,
} from "lucide-react";
import { useCurrentUser, useIsLoggedIn } from "@/features/auth/queries";
import { useCart } from "@/features/cart/queries";
import { useAddresses } from "@/features/address/queries";
import { useCreateAddress } from "@/features/address/mutations";
import { usePets } from "@/features/pet/queries";
import {
  useApplyCoupon,
  useRemoveCoupon,
  useValidateCoupon,
} from "@/features/coupon/mutations";
import { useCheckout } from "@/features/payment/mutations";
import { formatToman } from "@/shared/lib/utils";
import type { Address } from "@/features/address/address-api";

/** Pending order form for a user who is sent to login mid-checkout */
const PENDING_ORDER_KEY = "pending-order";

/** Payment methods (currently only Zarinpal; the structure is ready for adding more). */
const PAYMENT_METHODS = [
  {
    id: "zarinpal",
    label: "پرداخت آنلاین (زرین‌پال)",
    desc: "انتقال به درگاه امن زرین‌پال",
  },
] as const;

type PaymentMethodId = (typeof PAYMENT_METHODS)[number]["id"];

/** Shipping methods. Adding a new method = one item here + one line in the backend's ShippingMethod enum. */
const SHIPPING_METHODS = [
  {
    id: "tipax",
    label: "تیپاکس",
    desc: "پس‌کرایه (هزینه هنگام تحویل)",
  },
  {
    id: "post",
    label: "پست",
    desc: "پس‌کرایه (هزینه هنگام تحویل)",
  },
] as const;

type ShippingMethodId = (typeof SHIPPING_METHODS)[number]["id"];

interface PendingOrder {
  firstName: string;
  lastName: string;
  petName: string;
  city: string;
  address: string;
  plaque: string;
  note: string;
  selectedAddressId: string | null;
  saveNewAddress: boolean;
  addressLabel: string;
  couponCode: string | null;
  shippingMethod: ShippingMethodId;
}

export default function CheckoutPage() {
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();
  const checkout = useCheckout();
  const createAddress = useCreateAddress();
  const { lines: cartItems } = useCart();
  const applyCoupon = useApplyCoupon();
  const removeCouponMutation = useRemoveCoupon();
  const validateCoupon = useValidateCoupon();
  const { data: currentUser } = useCurrentUser();
  const { data: addresses = [] } = useAddresses();
  const { data: pets = [] } = usePets();
  const [mounted, setMounted] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [petName, setPetName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [plaque, setPlaque] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  // Shipping method
  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethodId>("tipax");

  // Saved addresses
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [saveNewAddress, setSaveNewAddress] = useState(true);
  const [addressLabel, setAddressLabel] = useState("خانه");

  // Automatically submit the pending order after returning from login
  const [finalizing, setFinalizing] = useState(false);
  const autoSubmitted = useRef(false);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem(PENDING_ORDER_KEY)) {
      setFinalizing(true);
    }
  }, []);

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
    setCity(def.city);
    setAddress(def.address);
    setPlaque(def.plaque);
  }, [addresses]); // eslint-disable-line react-hooks/exhaustive-deps

  const submitOrder = async (payload: PendingOrder) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      // One request: builds the order from the cart, creates the payment transaction, and
      // returns the gateway URL. The cart is not cleared until payment succeeds (ACID flow).
      const { gatewayUrl } = await checkout.mutateAsync({
        shippingAddress: {
          firstName: payload.firstName,
          lastName: payload.lastName,
          petName: payload.petName,
          city: payload.city,
          address: payload.address,
          plaque: payload.plaque,
          note: payload.note,
        },
        shippingMethod: payload.shippingMethod,
      });
      // Save the new address in the address book (its failure does not break the payment flow)
      if (!payload.selectedAddressId && payload.saveNewAddress) {
        try {
          await createAddress.mutateAsync({
            label: payload.addressLabel.trim() || payload.city,
            city: payload.city,
            address: payload.address,
            plaque: payload.plaque,
          });
        } catch {}
      }
      window.location.href = gatewayUrl;
    } catch {
      setSubmitError(
        "ثبت سفارش یا اتصال به درگاه پرداخت با خطا مواجه شد. لطفاً مطمئن شوید وارد شده‌اید و دوباره تلاش کنید.",
      );
      setFinalizing(false);
      setSubmitting(false);
    }
  };

  // After returning from login: restore the saved form and submit the order automatically
  useEffect(() => {
    if (!mounted || !isLoggedIn || autoSubmitted.current) return;
    const raw = sessionStorage.getItem(PENDING_ORDER_KEY);
    if (!raw) return;
    // Wait until the server cart (after merge) arrives
    if (cartItems.length === 0) return;
    autoSubmitted.current = true;
    sessionStorage.removeItem(PENDING_ORDER_KEY);
    try {
      const pending = JSON.parse(raw) as PendingOrder;
      setFirstName(pending.firstName);
      setLastName(pending.lastName);
      setPetName(pending.petName);
      setCity(pending.city);
      setAddress(pending.address);
      setPlaque(pending.plaque);
      setNote(pending.note);
      setSaveNewAddress(pending.saveNewAddress);
      setAddressLabel(pending.addressLabel);
      setShippingMethod(pending.shippingMethod ?? "tipax");
      void (async () => {
        // The coupon must be re-applied to the merged server cart so it is counted when the order is placed
        if (pending.couponCode) {
          setCouponInput(pending.couponCode);
          try {
            const res = await applyCoupon.mutateAsync(pending.couponCode);
            setAppliedCoupon({ code: res.coupon.code, discount: res.discount });
          } catch {
            setAppliedCoupon(null);
          }
        }
        await submitOrder(pending);
      })();
    } catch {
      setFinalizing(false);
    }
  }, [mounted, isLoggedIn, cartItems.length]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted) return null;

  const hasSavedAddresses = addresses.length > 0;

  const handleSelectSavedAddress = (saved: Address) => {
    setSelectedAddressId(saved.id);
    setCity(saved.city);
    setAddress(saved.address);
    setPlaque(saved.plaque);
    setUseNewAddress(false);
    setShowAddressDropdown(false);
  };

  const handleUseNewAddress = () => {
    setSelectedAddressId(null);
    setCity("");
    setAddress("");
    setPlaque("");
    setUseNewAddress(true);
    setShowAddressDropdown(false);
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
        setAppliedCoupon({ code: res.coupon.code, discount: res.discount ?? 0 });
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
    const payload: PendingOrder = {
      firstName,
      lastName,
      petName,
      city,
      address,
      plaque,
      note,
      selectedAddressId,
      saveNewAddress,
      addressLabel,
      couponCode: appliedCoupon?.code ?? null,
      shippingMethod,
    };
    if (!isLoggedIn) {
      // We keep the form so it is submitted automatically after login
      sessionStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(payload));
      router.push("/login?redirect=/checkout");
      return;
    }
    await submitOrder(payload);
  };

  // Finalizing the pending order (after login)
  if (finalizing && !submitError) {
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
          <p className="text-muted-foreground text-center mb-6 text-base md:text-lg">
            برای پرداخت ابتدا محصولی به سبد خرید اضافه کنید.
          </p>
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
                <div className="sm:col-span-2">
                  <label className="block text-sm md:text-base text-muted-foreground mb-1">
                    نام حیوان خانگی شما 🐾{" "}
                    <span className="text-muted-foreground text-xs">(اختیاری)</span>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm md:text-base text-muted-foreground mb-1">
                      شهر <span className="text-secondary">*</span>
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      placeholder="مثال: تهران"
                      className="w-full border border-border px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-secondary bg-card rounded-xl"
                    />
                  </div>
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
                    <span className="text-muted-foreground text-xs">(اختیاری)</span>
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
                  {SHIPPING_METHODS.map((m) => (
                    <label
                      key={m.id}
                      className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 cursor-pointer transition-colors ${
                        shippingMethod === m.id
                          ? "border-secondary bg-secondary/5"
                          : "border-border hover:border-border/70"
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping-method"
                        value={m.id}
                        checked={shippingMethod === m.id}
                        onChange={() => setShippingMethod(m.id)}
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
                disabled={submitting}
                className="w-full bg-secondary text-secondary-foreground rounded-2xl py-3 md:py-4 font-medium text-base md:text-lg flex items-center justify-center gap-2 hover:bg-secondary/90 transition-colors disabled:opacity-60"
              >
                {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                {isLoggedIn ? "تأیید و پرداخت" : "ورود و ادامه"}
                <ArrowLeft className="h-6 w-6" />
              </button>
            </div>

            {/* Security note */}
            <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground px-1">
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
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
