"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Trash2, AlertCircle } from "lucide-react";
import {
  useCart,
  useCartAvailability,
  type CartLine,
} from "@/features/cart/queries";
import { QuantityStepper } from "@/shared/components/cart/quantity-stepper";
import { formatToman } from "@/shared/lib/utils";
import { useSiteSettings } from "@/shared/config/site-settings-provider";

export default function CartPage() {
  const { cart } = useSiteSettings();
  const { lines: cartItems, updateQty, remove, subtotal, isLinePending } =
    useCart();
  // The guest cart freezes each product's stock at add time, so availability is re-checked
  // against the server here instead of being discovered at order placement.
  const { isAvailable, unavailableLines, hasUnavailable } =
    useCartAvailability(cartItems);
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
  const total = subtotal + shipping;

  return (
    <div className="pt-16 pb-24 px-4 mx-auto max-w-6xl">
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-primary/15 rounded-2xl p-4 mb-4">
            <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 text-secondary" />
          </div>
          <h2 className="text-xl md:text-2xl font-medium mb-2">
            {cart.emptyTitle}
          </h2>
          <p className="text-muted-foreground text-center mb-6 text-base md:text-lg">
            {cart.emptyDescription}
          </p>
          <Link
            prefetch
            href="/"
            className="bg-secondary text-secondary-foreground rounded-2xl px-6 py-3 font-medium inline-block text-base md:text-lg hover:bg-secondary/90 transition-colors"
          >
            {cart.emptyCtaLabel}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const available = isAvailable(item);
              return (
              <div
                key={item.productId}
                className={`bg-card rounded-2xl p-3 md:p-6 flex items-stretch gap-3 md:gap-4 shadow-sm border ${
                  available ? "border-border" : "border-red-300 bg-red-50/40"
                }`}
              >
                <div className="w-20 h-20 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-2xl bg-primary/15 flex-shrink-0 overflow-hidden self-start">
                  <Image
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.name}
                    width={144}
                    height={144}
                    className={`w-full h-full object-cover ${available ? "" : "grayscale opacity-60"}`}
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="min-w-0 font-normal text-sm sm:text-base md:text-lg lg:text-xl leading-snug break-words">
                        {item.name}
                      </h3>
                      {!available && (
                        <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-red-100 px-1.5 py-0.5 text-[11px] font-medium text-red-700">
                          <AlertCircle className="w-3.5 h-3.5" />
                          ناموجود — برای ادامه حذفش کنید
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => openRemoveModal(item)}
                      className="flex-shrink-0 -m-1 p-1 text-muted-foreground hover:text-red-500 transition-colors"
                      aria-label="حذف از سبد خرید"
                    >
                      <Trash2 className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-auto pt-3">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      {item.originalPrice > item.price && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] sm:text-sm text-muted-foreground line-through">
                            {formatToman(item.originalPrice)}
                          </span>
                          <span className="text-[9px] sm:text-xs font-bold text-white bg-red-500 rounded-md px-1 sm:px-1.5 py-0.5 leading-none whitespace-nowrap">
                            ٪
                            {Math.round(
                              ((item.originalPrice - item.price) /
                                item.originalPrice) *
                                100,
                            )}
                          </span>
                        </div>
                      )}
                      <p className="font-bold text-sm sm:text-base md:text-lg lg:text-xl text-secondary md:text-current">
                        {formatToman(item.price)}
                      </p>
                    </div>
                    <QuantityStepper
                      variant="cart"
                      quantity={item.quantity}
                      max={item.stock}
                      disabled={isLinePending(item) || !available}
                      onIncrement={() => void updateQty(item, item.quantity + 1)}
                      onDecrement={() => void updateQty(item, item.quantity - 1)}
                    />
                  </div>
                </div>
              </div>
              );
            })}
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border h-fit sticky top-20">
            {/* <h2 className="text-xl md:text-2xl font-bold mb-4">Order summary</h2> */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between font-bold text-lg md:text-xl">
                <span>جمع کل</span>
                <span>{formatToman(total)}</span>
              </div>
            </div>
            {hasUnavailable ? (
              <>
                <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                  {unavailableLines.length === 1
                    ? `«${unavailableLines[0].name}» دیگر موجود نیست. برای ادامه آن را از سبد حذف کنید.`
                    : `${unavailableLines.length} کالای سبد شما دیگر موجود نیست. برای ادامه آن‌ها را حذف کنید.`}
                </p>
                <button
                  type="button"
                  disabled
                  className="w-full bg-secondary text-secondary-foreground rounded-2xl py-3 md:py-4 font-medium text-base md:text-lg flex items-center justify-center opacity-50 cursor-not-allowed"
                >
                  {cart.checkoutLabel}
                </button>
              </>
            ) : (
              <Link
                prefetch
                href="/checkout"
                className="w-full bg-secondary text-secondary-foreground rounded-2xl py-3 md:py-4 font-medium text-base md:text-lg flex items-center justify-center hover:bg-secondary/90 transition-colors"
              >
                {cart.checkoutLabel}
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Remove Item Modal */}
      {removeModalOpen && itemToRemove && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
              حذف از سبد خرید؟
            </h2>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/15 border border-border mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-primary/15 flex-shrink-0 overflow-hidden">
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
                <p className="font-bold mt-1 text-base md:text-lg text-secondary">
                  {formatToman(itemToRemove.price)}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setRemoveModalOpen(false)}
                className="flex-1 py-3 md:py-4 rounded-xl bg-primary/15 border border-border font-medium text-base md:text-lg text-secondary hover:bg-primary/20 transition-colors"
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
