"use client";

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { removeFromWishlist } from "@/lib/store/slices/wishlistSlice";
import { MapPin, Trash2, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function WishlistPage() {
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const dispatch = useAppDispatch();

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromWishlist({ id }));
  };

  return (
    <div className="pb-20 pt-16 mx-auto max-w-7xl">
      <div className="px-4 mt-4">
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
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
                <div className="flex-1 ">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-base md:text-base">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-gray-400"
                    >
                      <Trash2 className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-4 md:mt-6">
                    <p className="font-bold text-base md:text-lg lg:text-xl">
                      ${item.price.toFixed(2)}
                    </p>
                    <Link href={`/product/${item.id}`}>
                      <button className="bg-[#670626] text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 font-medium text-xs sm:text-sm md:text-base">
                         جزئیات محصول
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-[#ffbdc5]/30 p-4 mb-4">
              <Heart className="w-8 h-8 md:w-10 md:h-10 text-[#670626]" />
            </div>
            <h2 className="text-xl md:text-2xl font-medium mb-2">
              لیست علاقه‌مندی‌های شما خالی است
            </h2>
            <p className="text-gray-500 text-center mb-6 text-base md:text-lg">
              به نظر می‌رسد هنوز چیزی به علاقه‌مندی‌ها اضافه نکرده‌اید.
            </p>
            <Link
              href="/"
              className="bg-[#670626] text-white px-6 py-3 md:px-8 md:py-4 font-medium inline-block text-base md:text-lg"
            >
              شروع به انتخاب
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
