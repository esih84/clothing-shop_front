"use client";

import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { toggleWishlist } from "@/lib/store/slices/wishlistSlice";

interface OfferCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  discount: number;
  imageUrl: string;
}

export function OfferCard({
  id,
  title,
  price,
  originalPrice,
  discount,
  imageUrl,
}: OfferCardProps) {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isInWishlist = wishlistItems.some((item) => item.id === id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      toggleWishlist({
        id,
        name: title,
        price,
        imageUrl,
        brand: "Brand",
        location: "In Store",
      })
    );
  };

  return (
    <Link
      href={`/product/${id}`}
      className="min-w-[160px] sm:min-w-[180px] md:min-w-[220px] flex-shrink-0"
    >
      <div className="relative">
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          -{discount}%
        </div>
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          width={180}
          height={180}
          className="rounded-xl w-full h-[140px] xs:h-[160px] sm:h-[180px] md:h-[200px] object-cover"
        />
      </div>
      <div className="p-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold text-sm sm:text-base">
              ${price.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 line-through">
              ${originalPrice.toFixed(2)}
            </p>
          </div>
          <button onClick={handleToggleWishlist} className="p-1">
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                isInWishlist ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </button>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 truncate">{title}</p>
      </div>
    </Link>
  );
}
