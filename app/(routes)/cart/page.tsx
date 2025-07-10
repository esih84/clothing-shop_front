"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { removeFromCart, updateQuantity } from "@/lib/store/cartSlice";

export default function CartPage() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart({ id }));
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
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 text-gray-500" />
          </div>
          <h2 className="text-xl md:text-2xl font-medium mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 text-center mb-6 text-base md:text-lg">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link
            href="/"
            className="bg-black text-white px-6 py-3 rounded-full font-medium inline-block text-base md:text-lg"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="cart-item bg-white rounded-xl p-4 md:p-6 flex items-center gap-4 shadow-sm border border-gray-100"
              >
                <div className="cart-item-image w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
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
                    {/* {item.color && <p>Color: {item.color}</p>} */}
                    {item.size && <p>Size: {item.size}</p>}
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <p className="font-bold text-base md:text-lg lg:text-xl">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center border rounded-full overflow-hidden">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-3 py-1 md:px-4 md:py-2 bg-gray-100 hover:bg-gray-200"
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
                        className="px-3 py-1 md:px-4 md:py-2 bg-gray-100 hover:bg-gray-200"
                      >
                        <Plus className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-base md:text-lg">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base md:text-lg">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between text-base md:text-lg">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold text-lg md:text-xl">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button className="w-full bg-black text-white py-3 md:py-4 rounded-full font-medium text-base md:text-lg flex items-center justify-center">
              Checkout
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
                className="ml-2"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Remove Item Modal */}
      {removeModalOpen && itemToRemove && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
              Remove From Cart?
            </h2>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
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
                  {itemToRemove.color && <p>Color: {itemToRemove.color}</p>}
                  {itemToRemove.size && <p>Size: {itemToRemove.size}</p>}
                </div>
                <p className="font-bold mt-1 text-base md:text-lg">
                  ${itemToRemove.price.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setRemoveModalOpen(false)}
                className="flex-1 py-3 md:py-4 bg-gray-200 rounded-full font-medium text-base md:text-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveItem(itemToRemove.id)}
                className="flex-1 py-3 md:py-4 bg-black text-white rounded-full font-medium text-base md:text-lg"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
