"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { removeFromCart, updateQuantity } from "@/lib/store/slices/cartSlice";
// Dummy login check (replace with real auth logic)
function useIsLoggedIn() {
  // For now, always false. Replace with real logic.
  return false;
}

export default function CartPage() {
  const isLoggedIn = useIsLoggedIn();
  const reduxCartItems = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<any>(null);
  // For backend cart (future)
  const [backendCartItems, setBackendCartItems] = useState<any[]>([]);

  // Choose cart source
  const cartItems = isLoggedIn ? backendCartItems : reduxCartItems;

  useEffect(() => {
    setMounted(true);
    // In future: if logged in, fetch backend cart here
    // if (isLoggedIn) { ...fetch and setBackendCartItems... }
  }, [isLoggedIn]);

  if (!mounted) {
    return null;
  }

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    if (isLoggedIn) {
      // TODO: update backend cart
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (id: string) => {
    if (isLoggedIn) {
      // TODO: remove from backend cart
    } else {
      dispatch(removeFromCart({ id }));
    }
    setRemoveModalOpen(false);
  };

  const openRemoveModal = (item: any) => {
    setItemToRemove(item);
    setRemoveModalOpen(true);
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="pt-16 pb-24 px-4 mx-auto max-w-6xl">
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-[#ffbdc5]/30 p-4 mb-4">
            <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 text-[#670626]" />
          </div>
          <h2 className="text-xl md:text-2xl font-medium mb-2">
            سبد خرید شما خالی است
          </h2>
          <p className="text-gray-500 text-center mb-6 text-base md:text-lg">
            به نظر می‌رسد هنوز چیزی به سبد خرید اضافه نکرده‌اید.
          </p>
          <Link
            href="/"
            className="bg-[#670626] text-white px-6 py-3 font-medium inline-block text-base md:text-lg"
          >
            شروع به خرید
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={`item-${item.id} ${item.color || ""} ${item.size || ""}`}
                className="cart-item bg-white p-4 md:p-6 flex items-center gap-4 shadow-sm border border-[#E3A7C4]/30"
              >
                <div className="cart-item-image w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 bg-[#ffbdc5]/20 flex-shrink-0 overflow-hidden">
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
                  <div className="flex flex-wrap gap-x-4 text-sm md:text-base text-gray-500 mt-1">
                    {item.color && <p>رنگ: {item.color}</p>}
                    {item.size && <p>سایز: {item.size}</p>}
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <p className="font-bold text-base md:text-lg lg:text-xl">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center border border-[#E3A7C4]/50 overflow-hidden">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-3 py-1 md:px-4 md:py-2 bg-[#ffbdc5]/30 hover:bg-[#ffbdc5]/60 text-[#670626]"
                      >
                        <Minus className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      <span className="px-3 md:px-4 text-base md:text-lg">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 py-1 md:px-4 md:py-2 bg-[#ffbdc5]/30 hover:bg-[#ffbdc5]/60 text-[#670626]"
                      >
                        <Plus className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

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
                <span className="font-medium">$0.00</span>
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
            <Link href="/checkout" className="w-full bg-[#670626] text-white py-3 md:py-4 font-medium text-base md:text-lg flex items-center justify-center">
              پرداخت نهایی

            </Link>
          </div>
        </div>
      )}

      {/* Remove Item Modal */}
      {removeModalOpen && itemToRemove && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 max-w-md w-full mx-4">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
              حذف از سبد خرید؟
            </h2>
            <div className="flex items-center gap-4 p-4 bg-[#ffbdc5]/20 border border-[#E3A7C4]/30 mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#ffbdc5]/20 flex-shrink-0 overflow-hidden">
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
                <div className="flex flex-wrap gap-x-4 text-sm md:text-base text-gray-500 mt-1">
                  {itemToRemove.color && <p>رنگ: {itemToRemove.color}</p>}
                  {itemToRemove.size && <p>سایز: {itemToRemove.size}</p>}
                </div>
                <p className="font-bold mt-1 text-base md:text-lg text-[#670626]">
                  ${itemToRemove.price.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setRemoveModalOpen(false)}
                className="flex-1 py-3 md:py-4 bg-[#ffbdc5]/30 border border-[#E3A7C4]/50 font-medium text-base md:text-lg text-[#670626]"
              >
                لغو
              </button>
              <button
                onClick={() => handleRemoveItem(itemToRemove.id)}
                className="flex-1 py-3 md:py-4 bg-[#670626] text-white font-medium text-base md:text-lg"
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
