"use client";

import { useAppSelector, useAppDispatch } from "@/shared/store/hooks";
import { removeFromWishlist } from "@/shared/store/slices/wishlistSlice";
import { Trash2, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatToman } from "@/shared/lib/utils";

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
                className="bg-card rounded-2xl p-4 md:p-6 flex items-center gap-4 shadow-sm border border-border"
              >
                <div className="w-20 h-20 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-2xl bg-primary/15 flex-shrink-0 overflow-hidden">
                  <Image
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.name}
                    width={144}
                    height={144}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="min-w-0 font-normal text-sm sm:text-base md:text-lg lg:text-xl leading-snug break-words">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="flex-shrink-0 -m-1 p-1 text-muted-foreground hover:text-red-500 transition-colors"
                      aria-label="حذف از علاقه‌مندی‌ها"
                    >
                      <Trash2 className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-auto pt-3">
                    <p className="font-bold text-sm sm:text-base md:text-lg lg:text-xl text-secondary md:text-current">
                      {formatToman(item.price)}
                    </p>
                    <Link prefetch href={`/product/${item.id}`}>
                      <button className="bg-secondary text-secondary-foreground rounded-[0.5rem] lg:rounded-xl px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 font-medium text-xs sm:text-sm md:text-base hover:bg-secondary/90 transition-colors">
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
            <div className="bg-primary/15 rounded-2xl p-4 mb-4">
              <Heart className="w-8 h-8 md:w-10 md:h-10 text-secondary" />
            </div>
            <h2 className="text-xl md:text-2xl font-medium mb-2">
              لیست علاقه‌مندی‌های شما خالی است
            </h2>
            <p className="text-muted-foreground text-center mb-6 text-base md:text-lg">
              به نظر می‌رسد هنوز چیزی به علاقه‌مندی‌ها اضافه نکرده‌اید.
            </p>
            <Link
              prefetch
              href="/"
              className="bg-secondary text-secondary-foreground rounded-2xl px-6 py-3 md:px-8 md:py-4 font-medium inline-block text-base md:text-lg hover:bg-secondary/90 transition-colors"
            >
              شروع به انتخاب
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
