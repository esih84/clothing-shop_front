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
  /** For the product page link (the backend works with slug) */
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
      className="block group w-full min-w-0"
    >
      {/* Image container */}
      <div className="relative overflow-hidden aspect-[3/4] bg-primary/15 border border-border rounded-2xl">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Discount badge */}
        <div className="absolute top-0 left-0 bg-secondary text-white text-[11px] font-bold px-2.5 py-1 leading-none rounded-tl-2xl rounded-br-2xl">
          -{discount}%
        </div>

        {/* Wishlist */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 p-1.5 bg-card/90 rounded-full transition-colors ${
            isInWishlist ? "text-secondary" : "text-muted-foreground hover:text-secondary"
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              isInWishlist ? "fill-secondary" : ""
            }`}
          />
        </button>
      </div>

      {/* Info */}
      <div className="pt-2 px-0.5">
        <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem] mb-1 leading-tight">
          {title}
        </p>
        {/* Prices are stacked vertically so that in the card's narrow width, "Toman" doesn't fall under the number */}
        <div className="flex flex-col gap-0.5">
          {discount > 0 && (
            <span className="text-[11px] text-muted-foreground line-through leading-none whitespace-nowrap">
              {formatToman(originalPrice)}
            </span>
          )}
          <span className="text-sm font-bold text-secondary leading-tight whitespace-nowrap">
            {formatToman(price)}
          </span>
        </div>
      </div>
    </Link>
  );
}
