"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, MapPin, Plus, Check, ChevronDown } from "lucide-react";
import { useAppSelector } from "@/lib/store/hooks";

// Dummy login check (replace with real auth logic)
function useIsLoggedIn() {
  return false;
}

// Dummy user profile (replace with real data from store/API)
interface SavedAddress {
  id: string;
  label: string;
  city: string;
  address: string;
  plaque: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  savedAddresses: SavedAddress[];
}

function useUserProfile(): UserProfile | null {
  // Replace with real selector/fetch
  // Return null if not logged in or no profile
  return null;

  // Example of what real data looks like:
  // return {
  //   firstName: "علی",
  //   lastName: "محمدی",
  //   savedAddresses: [
  //     { id: "1", label: "خانه", city: "تهران", address: "خیابان ولیعصر، کوچه بهار", plaque: "۱۲" },
  //     { id: "2", label: "محل کار", city: "تهران", address: "خیابان آزادی، پلاک ۴۵", plaque: "۳" },
  //   ],
  // };
}

export default function CheckoutPage() {
  const isLoggedIn = useIsLoggedIn();
  const userProfile = useUserProfile();
  const reduxCartItems = useAppSelector((state) => state.cart.items);
  const [mounted, setMounted] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [plaque, setPlaque] = useState("");
  const [note, setNote] = useState("");

  // Saved addresses
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [useNewAddress, setUseNewAddress] = useState(false);

  const cartItems = reduxCartItems; // extend for backend later

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: submit order
    console.log({ firstName, lastName, city, address, plaque, note });
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-16 pb-24 px-4 mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-[#ffbdc5]/30 p-4 mb-4">
            <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 text-[#670626]" />
          </div>
          <h2 className="text-xl md:text-2xl font-medium mb-2">
            سبد خرید شما خالی است
          </h2>
          <p className="text-gray-500 text-center mb-6 text-base md:text-lg">
            برای پرداخت ابتدا محصولی به سبد خرید اضافه کنید.
          </p>
          <Link
            href="/"
            className="bg-[#670626] text-white px-6 py-3 font-medium inline-block text-base md:text-lg"
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
          className="inline-flex items-center gap-2 text-[#670626] text-sm md:text-base hover:underline"
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
            <div className="bg-white p-4 md:p-6 shadow-sm border border-[#E3A7C4]/30">
              <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#670626] text-white text-sm flex items-center justify-center font-bold">
                  ۱
                </span>
                اطلاعات گیرنده
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm md:text-base text-gray-600 mb-1">
                    نام <span className="text-[#670626]">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder="نام خود را وارد کنید"
                    className="w-full border border-[#E3A7C4]/50 px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#670626] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm md:text-base text-gray-600 mb-1">
                    نام خانوادگی <span className="text-[#670626]">*</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder="نام خانوادگی خود را وارد کنید"
                    className="w-full border border-[#E3A7C4]/50 px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#670626] bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white p-4 md:p-6 shadow-sm border border-[#E3A7C4]/30">
              <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#670626] text-white text-sm flex items-center justify-center font-bold">
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
                      className="w-full flex items-center justify-between border border-[#E3A7C4]/50 px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#670626] bg-white"
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#670626]" />
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
                      <div className="absolute top-full right-0 left-0 bg-white border border-[#E3A7C4]/50 border-t-0 z-10 shadow-md">
                        {userProfile!.savedAddresses.map((saved) => (
                          <button
                            key={saved.id}
                            type="button"
                            onClick={() => handleSelectSavedAddress(saved)}
                            className="w-full flex items-center justify-between px-3 py-3 text-sm md:text-base hover:bg-[#ffbdc5]/20 text-right"
                          >
                            <span className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-[#670626] flex-shrink-0" />
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
                              <Check className="w-4 h-4 text-[#670626]" />
                            )}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={handleUseNewAddress}
                          className="w-full flex items-center gap-2 px-3 py-3 text-sm md:text-base hover:bg-[#ffbdc5]/20 text-[#670626] border-t border-[#E3A7C4]/30"
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
                      شهر <span className="text-[#670626]">*</span>
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      placeholder="مثال: تهران"
                      className="w-full border border-[#E3A7C4]/50 px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#670626] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm md:text-base text-gray-600 mb-1">
                      پلاک <span className="text-[#670626]">*</span>
                    </label>
                    <input
                      type="text"
                      value={plaque}
                      onChange={(e) => setPlaque(e.target.value)}
                      required
                      placeholder="مثال: ۱۲"
                      className="w-full border border-[#E3A7C4]/50 px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#670626] bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm md:text-base text-gray-600 mb-1">
                    آدرس کامل <span className="text-[#670626]">*</span>
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    rows={3}
                    placeholder="خیابان، کوچه، ..."
                    className="w-full border border-[#E3A7C4]/50 px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#670626] bg-white resize-none"
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
                    className="w-full border border-[#E3A7C4]/50 px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#670626] bg-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Order Items Summary (collapsed list) */}
            <div className="bg-white p-4 md:p-6 shadow-sm border border-[#E3A7C4]/30">
              <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#670626] text-white text-sm flex items-center justify-center font-bold">
                  ۳
                </span>
                اقلام سفارش
              </h2>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 py-3 border-b border-[#E3A7C4]/20 last:border-0"
                  >
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-[#ffbdc5]/20 flex-shrink-0 overflow-hidden">
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
                        {item.color && <span>رنگ: {item.color}</span>}
                        {item.size && <span>سایز: {item.size}</span>}
                        <span>تعداد: {item.quantity}</span>
                      </div>
                    </div>
                    <p className="font-bold text-sm md:text-base text-[#670626] flex-shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-4">
            <div className="bg-white p-6 shadow-sm border border-[#E3A7C4]/30 h-fit">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                خلاصه سفارش
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-base md:text-lg">
                  <span className="text-gray-600">جمع جزء</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base md:text-lg">
                  <span className="text-gray-600">ارسال</span>
                  <span className="font-medium text-green-600">رایگان</span>
                </div>
                <div className="flex justify-between text-base md:text-lg">
                  <span className="text-gray-600">مالیات</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg md:text-xl">
                    <span>جمع کل</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#670626] text-white py-3 md:py-4 font-medium text-base md:text-lg flex items-center justify-center gap-2 hover:bg-[#7d0730] transition-colors"
              >
                تأیید و پرداخت
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
