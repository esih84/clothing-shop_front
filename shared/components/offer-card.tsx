"use client";

import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { toggleWishlist } from "@/shared/store/slices/wishlistSlice";
import { formatToman } from "@/shared/lib/utils";

interface OfferCardProps {
  id: string;
  /** برای لینک صفحه‌ی محصول (بک‌اند با slug کار می‌کند) */
  slug?: string;
  title: string;
  price: number;
  originalPrice: number;
  discount: number;
  imageUrl: string;
}

export function OfferCard({
  id,
  slug,
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
      prefetch
      href={`/product/${slug ?? id}`}
      className="block group w-[150px] sm:w-[170px] md:w-[190px] flex-shrink-0"
    >
      {/* Image container */}
      <div className="relative overflow-hidden aspect-[3/4] bg-[#FDE68A]/20 border border-[#A9CBF5]/30 rounded-2xl">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          sizes="190px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Discount badge */}
        <div className="absolute top-0 left-0 bg-[#1473E6] text-white text-[11px] font-bold px-2.5 py-1 leading-none rounded-tl-2xl rounded-br-2xl">
          -{discount}%
        </div>

        {/* Wishlist */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 p-1.5 bg-white/90 rounded-full transition-colors ${
            isInWishlist ? "text-[#1473E6]" : "text-gray-400 hover:text-[#1473E6]"
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              isInWishlist ? "fill-[#1473E6]" : ""
            }`}
          />
        </button>
      </div>

      {/* Info */}
      <div className="pt-2 px-0.5">
        <p className="text-xs text-gray-500 line-clamp-1 mb-1.5 leading-tight">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold text-[#1473E6]">{formatToman(price)}</span>
          <span className="text-xs text-gray-400 line-through">{formatToman(originalPrice)}</span>
        </div>
      </div>
    </Link>
  );
}
