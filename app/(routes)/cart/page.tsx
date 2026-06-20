"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useCart, type CartLine } from "@/features/cart/queries";
import { formatToman } from "@/shared/lib/utils";

export default function CartPage() {
  const { lines: cartItems, updateQty, remove, subtotal } = useCart();
  const [mounted, setMounted] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<CartLine | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const openRemoveModal = (item: CartLine) => {
    setItemToRemove(item);
    setRemoveModalOpen(true);
  };

  const handleConfirmRemove = () => {
    if (itemToRemove) void remove(itemToRemove);
    setRemoveModalOpen(false);
  };

  const shipping = 0; // Free shipping
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="pt-16 pb-24 px-4 mx-auto max-w-6xl">
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-[#FDE68A]/30 rounded-2xl p-4 mb-4">
            <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 text-[#1473E6]" />
          </div>
          <h2 className="text-xl md:text-2xl font-medium mb-2">
            سبد خرید شما خالی است
          </h2>
          <p className="text-gray-500 text-center mb-6 text-base md:text-lg">
            به نظر می‌رسد هنوز چیزی به سبد خرید اضافه نکرده‌اید.
          </p>
          <Link
            prefetch
            href="/"
            className="bg-secondary text-secondary-foreground rounded-2xl px-6 py-3 font-medium inline-block text-base md:text-lg hover:bg-secondary/90 transition-colors"
          >
            شروع به خرید
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-2xl p-4 md:p-6 flex items-center gap-4 shadow-sm border border-[#A9CBF5]/30"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-2xl bg-[#FDE68A]/20 flex-shrink-0 overflow-hidden">
                  <Image
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.name}
                    width={144}
                    height={144}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-base md:text-lg lg:text-xl">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => openRemoveModal(item)}
                      className="text-gray-400"
                    >
                      <Trash2 className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <p className="font-bold text-base md:text-lg lg:text-xl">
                      {formatToman(item.price)}
                    </p>
                    <div className="flex items-center rounded-xl border border-[#A9CBF5]/50 overflow-hidden">
                      <button
                        onClick={() =>
                          void updateQty(item, item.quantity - 1)
                        }
                        className="px-3 py-1 md:px-4 md:py-2 bg-[#FDE68A]/30 hover:bg-[#FDE68A]/60 text-[#1473E6]"
                      >
                        <Minus className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      <span className="px-3 md:px-4 text-base md:text-lg">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          void updateQty(item, item.quantity + 1)
                        }
                        className="px-3 py-1 md:px-4 md:py-2 bg-[#FDE68A]/30 hover:bg-[#FDE68A]/60 text-[#1473E6]"
                      >
                        <Plus className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#A9CBF5]/30 h-fit sticky top-20">
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
            <Link prefetch href="/checkout" className="w-full bg-secondary text-secondary-foreground rounded-2xl py-3 md:py-4 font-medium text-base md:text-lg flex items-center justify-center hover:bg-secondary/90 transition-colors">
              پرداخت نهایی
            </Link>
          </div>
        </div>
      )}

      {/* Remove Item Modal */}
      {removeModalOpen && itemToRemove && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
              حذف از سبد خرید؟
            </h2>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FDE68A]/20 border border-[#A9CBF5]/30 mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-[#FDE68A]/20 flex-shrink-0 overflow-hidden">
                <Image
                  src={itemToRemove.imageUrl || "/placeholder.svg"}
                  alt={itemToRemove.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium text-base md:text-lg">
                  {itemToRemove.name}
                </h3>
                <p className="font-bold mt-1 text-base md:text-lg text-[#1473E6]">
                  {formatToman(itemToRemove.price)}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setRemoveModalOpen(false)}
                className="flex-1 py-3 md:py-4 rounded-xl bg-[#FDE68A]/30 border border-[#A9CBF5]/50 font-medium text-base md:text-lg text-[#1473E6] hover:bg-[#FDE68A]/50 transition-colors"
              >
                لغو
              </button>
              <button
                onClick={handleConfirmRemove}
                className="flex-1 py-3 md:py-4 rounded-xl bg-red-600 text-white font-medium text-base md:text-lg hover:bg-red-700 transition-colors"
              >
                بله، حذف شود
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
