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
      className="block group w-[150px] sm:w-[170px] md:w-[190px] flex-shrink-0"
    >
      {/* Image container */}
      <div className="relative overflow-hidden aspect-[3/4] bg-[#ffbdc5]/20 border border-[#E3A7C4]/30">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          sizes="190px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Discount badge */}
        <div className="absolute top-0 left-0 bg-[#670626] text-white text-[11px] font-bold px-2 py-1 leading-none">
          -{discount}%
        </div>
        {/* Save amount strip at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#670626]/85 text-white text-[10px] text-center py-1 font-medium">
          صرفه‌جویی ${(originalPrice - price).toFixed(2)}
        </div>
        {/* Wishlist */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 p-1.5 bg-white/90 transition-colors ${
            isInWishlist ? "text-[#670626]" : "text-gray-400 hover:text-[#670626]"
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              isInWishlist ? "fill-[#670626]" : ""
            }`}
          />
        </button>
      </div>

      {/* Info */}
      <div className="pt-2 px-0.5">
        <p className="text-xs text-gray-500 line-clamp-1 mb-1.5 leading-tight">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold text-[#670626]">${price.toFixed(2)}</span>
          <span className="text-xs text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
}
