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
} from "lucide-react";
import { useAppDispatch } from "@/shared/store/hooks";
import { clearCart } from "@/shared/store/slices/cartSlice";
import { useCurrentUser, useIsLoggedIn } from "@/features/auth/queries";
import { useCart } from "@/features/cart/queries";
import { useCreateOrder } from "@/features/order/mutations";
import { useAddresses } from "@/features/address/queries";
import { useCreateAddress } from "@/features/address/mutations";
import { usePets } from "@/features/pet/queries";
import { useApplyCoupon, useRemoveCoupon } from "@/features/coupon/mutations";
import { useCreatePayment } from "@/features/payment/mutations";
import { formatToman } from "@/shared/lib/utils";
import type { Address } from "@/features/address/address-api";

/** فرم معلق سفارش برای کاربری که وسط checkout به لاگین فرستاده می‌شود */
const PENDING_ORDER_KEY = "pending-order";

/** روش‌های پرداخت (فعلاً فقط زرین‌پال؛ ساختار برای افزودن روش‌های بعدی آماده است). */
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
  city: string;
  address: string;
  plaque: string;
  note: string;
  selectedAddressId: string | null;
  saveNewAddress: boolean;
  addressLabel: string;
  couponCode: string | null;
}

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoggedIn = useIsLoggedIn();
  const createOrder = useCreateOrder();
  const createAddress = useCreateAddress();
  const { lines: cartItems } = useCart();
  const applyCoupon = useApplyCoupon();
  const removeCouponMutation = useRemoveCoupon();
  const createPayment = useCreatePayment();
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

  // کد تخفیف
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // روش پرداخت
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodId>("zarinpal");

  // Saved addresses
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [saveNewAddress, setSaveNewAddress] = useState(true);
  const [addressLabel, setAddressLabel] = useState("خانه");

  // ثبت خودکار سفارش معلق پس از برگشت از لاگین
  const [finalizing, setFinalizing] = useState(false);
  const autoSubmitted = useRef(false);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem(PENDING_ORDER_KEY)) {
      setFinalizing(true);
    }
  }, []);

  // پر کردن نام از پروفایل وقتی کاربر لود شد
  useEffect(() => {
    if (!currentUser) return;
    setFirstName((v) => v || currentUser.firstName || "");
    setLastName((v) => v || currentUser.lastName || "");
  }, [currentUser]);

  // انتخاب خودکار آدرس پیش‌فرض وقتی آدرس‌ها لود شدند
  useEffect(() => {
    if (addresses.length === 0 || selectedAddressId || useNewAddress) return;
    if (city || address) return; // کاربر خودش چیزی وارد کرده
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
      const order = await createOrder.mutateAsync({
        shippingAddress: {
          firstName: payload.firstName,
          lastName: payload.lastName,
          petName: payload.petName,
          city: payload.city,
          address: payload.address,
          plaque: payload.plaque,
          note: payload.note,
        },
      });
      // ذخیره‌ی آدرس جدید در دفترچه‌ی آدرس (خطای آن ثبت سفارش را خراب نمی‌کند)
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
      // شروع پرداخت آنلاین: ساخت تراکنش و انتقال به درگاه زرین‌پال
      const { gatewayUrl } = await createPayment.mutateAsync({
        orderId: order.id,
      });
      dispatch(clearCart());
      window.location.href = gatewayUrl;
    } catch {
      setSubmitError(
        "ثبت سفارش یا اتصال به درگاه پرداخت با خطا مواجه شد. لطفاً مطمئن شوید وارد شده‌اید و دوباره تلاش کنید."
      );
      setFinalizing(false);
      setSubmitting(false);
    }
  };

  // پس از برگشت از لاگین: فرم ذخیره‌شده را بازیابی و سفارش را خودکار ثبت کن
  useEffect(() => {
    if (!mounted || !isLoggedIn || autoSubmitted.current) return;
    const raw = sessionStorage.getItem(PENDING_ORDER_KEY);
    if (!raw) return;
    // صبر تا سبد سرور (پس از merge) برسد
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
      void (async () => {
        // کوپن باید دوباره روی سبد سرورِ merge‌شده اعمال شود تا هنگام ثبت سفارش لحاظ گردد
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
    // کد تخفیف به سبد سرور گره خورده؛ مهمان باید ابتدا وارد شود.
    if (!isLoggedIn) {
      setCouponError("برای استفاده از کد تخفیف ابتدا وارد شوید.");
      return;
    }
    setCouponError(null);
    try {
      const res = await applyCoupon.mutateAsync(code);
      setAppliedCoupon({ code: res.coupon.code, discount: res.discount });
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
    0
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
    };
    if (!isLoggedIn) {
      // فرم را نگه می‌داریم تا بعد از لاگین خودکار ثبت شود
      sessionStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(payload));
      router.push("/login?redirect=/checkout");
      return;
    }
    await submitOrder(payload);
  };

  // در حال نهایی‌کردن سفارش معلق (بعد از لاگین)
  if (finalizing && !submitError) {
    return (
      <div className="pt-16 pb-24 px-4 mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-[#1473E6] animate-spin" />
          <p className="text-gray-600 text-base md:text-lg">
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
          <div className="bg-[#FDE68A]/30 p-4 mb-4 rounded-2xl">
            <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 text-[#1473E6]" />
          </div>
          <h2 className="text-xl md:text-2xl font-medium mb-2">
            سبد خرید شما خالی است
          </h2>
          <p className="text-gray-500 text-center mb-6 text-base md:text-lg">
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
      <div className="mb-6">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-[#1473E6] text-sm md:text-base hover:underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          بازگشت به سبد خرید
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Checkout Form */}
          <div className="lg:col-span-2 space-y-6">

            {/* Recipient Info */}
            <div className="bg-white p-4 md:p-6 shadow-sm border border-[#A9CBF5]/30 rounded-2xl">
              <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#1473E6] text-white text-sm flex items-center justify-center font-bold rounded-lg">
                  ۱
                </span>
                اطلاعات گیرنده
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm md:text-base text-gray-600 mb-1">
                    نام <span className="text-[#1473E6]">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder="نام خود را وارد کنید"
                    className="w-full border border-[#A9CBF5]/50 px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#1473E6] bg-white rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm md:text-base text-gray-600 mb-1">
                    نام خانوادگی <span className="text-[#1473E6]">*</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder="نام خانوادگی خود را وارد کنید"
                    className="w-full border border-[#A9CBF5]/50 px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#1473E6] bg-white rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm md:text-base text-gray-600 mb-1">
                    نام حیوان خانگی شما 🐾{" "}
                    <span className="text-gray-400 text-xs">(اختیاری)</span>
                  </label>
                  <input
                    type="text"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="مثال: پوپک"
                    className="w-full border border-[#A9CBF5]/50 px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#1473E6] bg-white rounded-xl"
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
                              : "bg-[#FDE68A]/20 text-gray-700 border-[#A9CBF5]/40 hover:border-[#1473E6]"
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
            <div className="bg-white p-4 md:p-6 shadow-sm border border-[#A9CBF5]/30 rounded-2xl">
              <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#1473E6] text-white text-sm flex items-center justify-center font-bold rounded-lg">
                  ۲
                </span>
                آدرس تحویل
              </h2>

              {/* Saved Addresses */}
              {hasSavedAddresses && (
                <div className="mb-5">
                  <p className="text-sm md:text-base text-gray-600 mb-2">
                    آدرس‌های ذخیره شده
                  </p>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setShowAddressDropdown(!showAddressDropdown)
                      }
                      className="w-full flex items-center justify-between border border-[#A9CBF5]/50 px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#1473E6] bg-white rounded-xl"
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#1473E6]" />
                        {selectedAddressId
                          ? addresses.find((a) => a.id === selectedAddressId)
                              ?.label
                          : useNewAddress
                          ? "آدرس جدید"
                          : "انتخاب آدرس"}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          showAddressDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {showAddressDropdown && (
                      <div className="absolute top-full right-0 left-0 bg-white border border-[#A9CBF5]/50 border-t-0 z-10 shadow-md rounded-b-xl overflow-hidden">
                        {addresses.map((saved) => (
                          <button
                            key={saved.id}
                            type="button"
                            onClick={() => handleSelectSavedAddress(saved)}
                            className="w-full flex items-center justify-between px-3 py-3 text-sm md:text-base hover:bg-[#FDE68A]/20 text-right"
                          >
                            <span className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-[#1473E6] flex-shrink-0" />
                              <span>
                                <span className="font-medium">
                                  {saved.label}
                                </span>
                                <span className="text-gray-500 mr-2">
                                  {saved.city}، {saved.address}
                                </span>
                              </span>
                            </span>
                            {selectedAddressId === saved.id && (
                              <Check className="w-4 h-4 text-[#1473E6]" />
                            )}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={handleUseNewAddress}
                          className="w-full flex items-center gap-2 px-3 py-3 text-sm md:text-base hover:bg-[#FDE68A]/20 text-[#1473E6] border-t border-[#A9CBF5]/30"
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
                    <label className="block text-sm md:text-base text-gray-600 mb-1">
                      شهر <span className="text-[#1473E6]">*</span>
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      placeholder="مثال: تهران"
                      className="w-full border border-[#A9CBF5]/50 px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#1473E6] bg-white rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm md:text-base text-gray-600 mb-1">
                      پلاک <span className="text-[#1473E6]">*</span>
                    </label>
                    <input
                      type="text"
                      value={plaque}
                      onChange={(e) => setPlaque(e.target.value)}
                      required
                      placeholder="مثال: ۱۲"
                      className="w-full border border-[#A9CBF5]/50 px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#1473E6] bg-white rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm md:text-base text-gray-600 mb-1">
                    آدرس کامل <span className="text-[#1473E6]">*</span>
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    rows={3}
                    placeholder="خیابان، کوچه، ..."
                    className="w-full border border-[#A9CBF5]/50 px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#1473E6] bg-white resize-none rounded-xl"
                  />
                </div>

                {/* ذخیره‌ی آدرس جدید در دفترچه‌ی آدرس */}
                {!selectedAddressId && (
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm md:text-base text-gray-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={saveNewAddress}
                        onChange={(e) => setSaveNewAddress(e.target.checked)}
                        className="w-4 h-4 accent-[#1473E6]"
                      />
                      این آدرس در حساب من ذخیره شود
                    </label>
                    {saveNewAddress && (
                      <div>
                        <label className="block text-sm md:text-base text-gray-600 mb-1">
                          عنوان آدرس
                        </label>
                        <input
                          type="text"
                          value={addressLabel}
                          onChange={(e) => setAddressLabel(e.target.value)}
                          placeholder="مثال: خانه، محل کار"
                          className="w-full sm:w-1/2 border border-[#A9CBF5]/50 px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#1473E6] bg-white rounded-xl"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm md:text-base text-gray-600 mb-1">
                    یادداشت{" "}
                    <span className="text-gray-400 text-xs">(اختیاری)</span>
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    placeholder="توضیحات اضافه برای پیک یا فروشنده..."
                    className="w-full border border-[#A9CBF5]/50 px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#1473E6] bg-white resize-none rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Order Items Summary (collapsed list) */}
            <div className="bg-white p-4 md:p-6 shadow-sm border border-[#A9CBF5]/30 rounded-2xl">
              <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#1473E6] text-white text-sm flex items-center justify-center font-bold rounded-lg">
                  ۳
                </span>
                اقلام سفارش
              </h2>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3 py-3 border-b border-[#A9CBF5]/20 last:border-0"
                  >
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-[#FDE68A]/20 flex-shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm md:text-base truncate">
                        {item.name}
                      </p>
                      <div className="flex flex-wrap gap-x-3 text-xs md:text-sm text-gray-500 mt-0.5">
                        <span>تعداد: {item.quantity}</span>
                      </div>
                    </div>
                    <p className="font-bold text-sm md:text-base text-[#1473E6] flex-shrink-0">
                      {formatToman(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-4">
            <div className="bg-white p-6 shadow-sm border border-[#A9CBF5]/30 h-fit rounded-2xl sticky top-20">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                خلاصه سفارش
              </h2>

              {/* کد تخفیف */}
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
                      className="flex-1 min-w-0 border border-[#A9CBF5]/50 px-3 py-2 text-sm focus:outline-none focus:border-[#1473E6] bg-white rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={applyCoupon.isPending || !couponInput.trim()}
                      className="bg-[#1473E6] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#1473E6]/90 transition-colors disabled:opacity-60 flex items-center gap-1.5"
                    >
                      {applyCoupon.isPending && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      اعمال
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-xs text-red-600 mt-1.5">{couponError}</p>
                )}
                {!isLoggedIn && !appliedCoupon && (
                  <p className="text-xs text-gray-500 mt-1.5">
                    برای استفاده از کد تخفیف{" "}
                    <Link
                      href="/login?redirect=/checkout"
                      className="text-[#1473E6] hover:underline"
                    >
                      وارد شوید
                    </Link>
                    .
                  </p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-base md:text-lg">
                  <span className="text-gray-600">جمع جزء</span>
                  <span className="font-medium">{formatToman(subtotal)}</span>
                </div>
                <div className="flex justify-between text-base md:text-lg">
                  <span className="text-gray-600">ارسال</span>
                  <span className="font-medium text-green-600">رایگان</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-base md:text-lg">
                    <span className="text-gray-600">تخفیف</span>
                    <span className="font-medium text-green-600">
                      −{formatToman(discount)}
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
              {/* روش پرداخت */}
              <div className="mb-5">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  روش پرداخت
                </h3>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map((m) => (
                    <label
                      key={m.id}
                      className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 cursor-pointer transition-colors ${
                        paymentMethod === m.id
                          ? "border-[#1473E6] bg-[#1473E6]/5"
                          : "border-[#A9CBF5]/40 hover:border-[#A9CBF5]/70"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value={m.id}
                        checked={paymentMethod === m.id}
                        onChange={() => setPaymentMethod(m.id)}
                        className="mt-0.5 accent-[#1473E6]"
                      />
                      <span className="text-sm">
                        <span className="font-medium text-gray-800">
                          {m.label}
                        </span>
                        <span className="block text-xs text-gray-500 mt-0.5">
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Security note */}
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 px-1">
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
