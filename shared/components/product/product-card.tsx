"use client";

import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { toggleWishlist } from "@/shared/store/slices/wishlistSlice";
import { useTransition } from "react";
import { formatToman } from "@/shared/lib/utils";

interface ProductCardProps {
  id: string;
  /** برای لینک صفحه‌ی محصول (بک‌اند با slug کار می‌کند) */
  slug?: string;
  title: string;
  price: number;
  imageUrl: string;
  originalPrice?: number;
  discount?: number;
}

export function ProductCard({
  id,
  slug,
  title,
  price,
  imageUrl,
  originalPrice,
  discount,
}: ProductCardProps) {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isInWishlist = wishlistItems.some((item) => item.id === id);
  const [isPending, startTransition] = useTransition();

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    startTransition(() => {
      dispatch(
        toggleWishlist({
          id,
          name: title,
          price,
          imageUrl,
          brand: "Brand",
          location: "In Store",
        }),
      );
    });
  };

  return (
    <Link
      prefetch
      href={`/product/${slug ?? id}`}
      className="block group"
      style={{ viewTransitionName: `product-${id}` }}
    >
      <div className="relative bg-[#FDE68A]/20 overflow-hidden aspect-square mb-3 rounded-2xl border border-[#A9CBF5]/30">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          style={{ viewTransitionName: `product-image-${id}` }}
        />
        {discount && (
          <div className="absolute top-0 left-0 bg-[#1473E6] text-white text-[10px] font-bold px-2 py-1 tracking-wide">
            -{discount}%
          </div>
        )}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 rounded-full  right-2 p-2.5 bg-white/90 transition-colors ${
            isInWishlist
              ? "text-[#1473E6]"
              : "text-gray-400 hover:text-[#1473E6]"
          }`}
          disabled={isPending}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-all ${isInWishlist ? "fill-[#1473E6]" : ""}`}
          />
        </button>
      </div>
      <div>
        <h3
          className="font-medium text-sm mb-1 line-clamp-1"
          style={{ viewTransitionName: `product-title-${id}` }}
        >
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <p
            className="font-bold text-[#1473E6] text-sm"
            style={{ viewTransitionName: `product-price-${id}` }}
          >
            {formatToman(price)}
          </p>
          {originalPrice && (
            <p className="text-xs text-gray-400 line-through">
              {formatToman(originalPrice)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="block">
      <div className="aspect-square bg-[#FDE68A]/40 animate-pulse mb-3" />
      <div className="space-y-2">
        <div className="h-3.5 bg-[#FDE68A]/50 animate-pulse w-4/5" />
        <div className="h-3.5 bg-[#FDE68A]/50 animate-pulse w-1/3" />
      </div>
    </div>
  );
}
