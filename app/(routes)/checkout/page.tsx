"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag, MapPin, Plus, Check, ChevronDown, Loader2 } from "lucide-react";
import { useAppDispatch } from "@/shared/store/hooks";
import { clearCart } from "@/shared/store/slices/cartSlice";
import { useCurrentUser, useIsLoggedIn } from "@/features/auth/queries";
import { useCart } from "@/features/cart/queries";
import { useCreateOrder } from "@/features/order/mutations";
import { formatToman } from "@/shared/lib/utils";

interface SavedAddress {
  id: string;
  label: string;
  city: string;
  address: string;
  plaque: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoggedIn = useIsLoggedIn();
  const createOrder = useCreateOrder();
  const { lines: cartItems } = useCart();
  const { data: currentUser } = useCurrentUser();
  const userProfile = currentUser
    ? {
        firstName: currentUser.firstName ?? "",
        lastName: currentUser.lastName ?? "",
        savedAddresses: [] as SavedAddress[],
      }
    : null;
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

  // Saved addresses
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [useNewAddress, setUseNewAddress] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Pre-fill name from profile if available
    if (userProfile) {
      setFirstName(userProfile.firstName || "");
      setLastName(userProfile.lastName || "");

      // Auto-select first saved address if exists
      if (userProfile.savedAddresses.length > 0) {
        const first = userProfile.savedAddresses[0];
        setSelectedAddressId(first.id);
        setCity(first.city);
        setAddress(first.address);
        setPlaque(first.plaque);
      }
    }
  }, []);

  if (!mounted) return null;

  const hasSavedAddresses =
    userProfile && userProfile.savedAddresses.length > 0;

  const handleSelectSavedAddress = (saved: SavedAddress) => {
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

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setSubmitError(null);
    setSubmitting(true);
    try {
      const order = await createOrder.mutateAsync({
        shippingAddress: {
          firstName,
          lastName,
          petName,
          city,
          address,
          plaque,
          note,
        },
      });
      dispatch(clearCart());
      router.push(`/order/${order.id}`);
    } catch {
      setSubmitError(
        "ثبت سفارش با خطا مواجه شد. لطفاً مطمئن شوید وارد شده‌اید و دوباره تلاش کنید."
      );
    } finally {
      setSubmitting(false);
    }
  };

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
                          ? userProfile!.savedAddresses.find(
                              (a) => a.id === selectedAddressId
                            )?.label
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
                        {userProfile!.savedAddresses.map((saved) => (
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
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-base md:text-lg">
                  <span className="text-gray-600">جمع جزء</span>
                  <span className="font-medium">{formatToman(subtotal)}</span>
                </div>
                <div className="flex justify-between text-base md:text-lg">
                  <span className="text-gray-600">ارسال</span>
                  <span className="font-medium text-green-600">رایگان</span>
                </div>
                <div className="flex justify-between text-base md:text-lg">
                  <span className="text-gray-600">مالیات</span>
                  <span className="font-medium">{formatToman(tax)}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg md:text-xl">
                    <span>جمع کل</span>
                    <span>{formatToman(total)}</span>
                  </div>
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
