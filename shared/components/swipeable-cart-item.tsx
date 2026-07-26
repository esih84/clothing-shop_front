"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useAppDispatch } from "@/shared/store/hooks";
import { removeFromCart, updateQuantity } from "@/shared/store/slices/cartSlice";
import "swiper/css";

interface SwipeableCartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  color?: string | null;
  size?: string | null;
}

export function SwipeableCartItem({
  id,
  name,
  price,
  quantity,
  imageUrl,
  color,
  size,
}: SwipeableCartItemProps) {
  const dispatch = useAppDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleRemove = () => {
    setShowDeleteConfirm(true);
  };

  const confirmRemove = () => {
    dispatch(removeFromCart({ id }));
    setShowDeleteConfirm(false);
  };

  const cancelRemove = () => {
    setShowDeleteConfirm(false);
  };

  const incrementQuantity = () => {
    dispatch(updateQuantity({ id, quantity: quantity + 1 }));
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      dispatch(updateQuantity({ id, quantity: quantity - 1 }));
    }
  };

  // Map color names to tailwind classes
  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      black: "bg-black",
      white: "bg-card border border-border",
      gray: "bg-gray-400",
      silver: "bg-muted",
      blue: "bg-blue-600",
      navy: "bg-blue-900",
      brown: "bg-amber-800",
      green: "bg-green-600",
      red: "bg-red-600",
      pink: "bg-pink-500",
      purple: "bg-purple-600",
    };
    return colorMap[color.toLowerCase()] || "bg-muted";
  };

  return (
    <div className="relative mb-4">
      <Swiper
        slidesPerView={1}
        allowTouchMove={true}
        className="cart-item-swiper"
        initialSlide={0}
        onSlideChange={(swiper) => {
          if (swiper.activeIndex === 1) {
            handleRemove();
          }
        }}
      >
        <SwiperSlide>
          <div className="bg-card rounded-xl p-3 shadow-sm">
            <div className="flex gap-3">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt={name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm">{name}</h3>
                {(color || size) && (
                  <div className="flex items-center gap-2 mt-1">
                    {color && (
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-3 h-3 rounded-full ${getColorClass(
                            color
                          )}`}
                        ></div>
                        <span className="text-xs text-muted-foreground">Color</span>
                      </div>
                    )}
                    {color && size && (
                      <span className="text-xs text-muted-foreground">|</span>
                    )}
                    {size && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">
                          Size = {size}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold">${price.toFixed(2)}</span>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={decrementQuantity}
                      className="px-2 py-1 bg-muted hover:bg-muted"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-sm">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      className="px-2 py-1 bg-muted hover:bg-muted"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="bg-red-500 h-full flex items-center justify-center rounded-xl">
            <Trash2 className="text-white w-6 h-6" />
          </div>
        </SwiperSlide>
      </Swiper>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
          <div className="bg-card rounded-xl w-full max-w-md overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-bold text-center mb-4">
                Remove From Cart?
              </h3>
              <div className="bg-muted rounded-xl p-3 mb-4">
                <div className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={imageUrl || "/placeholder.svg"}
                      alt={name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{name}</h3>
                    {(color || size) && (
                      <div className="flex items-center gap-2 mt-1">
                        {color && (
                          <div className="flex items-center gap-1">
                            <div
                              className={`w-3 h-3 rounded-full ${getColorClass(
                                color
                              )}`}
                            ></div>
                            <span className="text-xs text-muted-foreground">Color</span>
                          </div>
                        )}
                        {color && size && (
                          <span className="text-xs text-muted-foreground">|</span>
                        )}
                        {size && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">
                              Size = {size}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold">${price.toFixed(2)}</span>
                      <div className="flex items-center border rounded-lg">
                        <button className="px-2 py-1 bg-muted" disabled>
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-sm">{quantity}</span>
                        <button className="px-2 py-1 bg-muted" disabled>
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={cancelRemove}
                  className="flex-1 py-3 px-4 bg-muted rounded-full font-medium text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemove}
                  className="flex-1 py-3 px-4 bg-black text-white rounded-full font-medium"
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
