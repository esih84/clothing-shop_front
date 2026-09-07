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
  /** For the product page link (the backend works with slug) */
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
      <div className="relative overflow-hidden aspect-square mb-3 rounded-2xl border border-border">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          style={{ viewTransitionName: `product-image-${id}` }}
        />
        {discount && (
          <div className="absolute top-0 left-0 bg-secondary text-white font-bold tracking-wide rounded-tl-2xl rounded-br-2xl text-[10px] px-2 py-1 sm:text-xs sm:px-2.5 sm:py-1.5 xl:text-sm xl:px-3 xl:py-2">
            -{discount}%
          </div>
        )}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 rounded-full  right-2 p-2.5 bg-card/90 transition-colors ${
            isInWishlist
              ? "text-secondary"
              : "text-muted-foreground hover:text-secondary"
          }`}
          disabled={isPending}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-all ${isInWishlist ? "fill-secondary" : ""}`}
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
            className="font-bold text-secondary text-sm"
            style={{ viewTransitionName: `product-price-${id}` }}
          >
            {formatToman(price)}
          </p>
          {originalPrice && (
            <p className="text-[0.6rem] md:text-xs text-muted-foreground line-through">
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
      <div className="aspect-square bg-primary/20 animate-pulse mb-3" />
      <div className="space-y-2">
        <div className="h-3.5 bg-primary/20 animate-pulse w-4/5" />
        <div className="h-3.5 bg-primary/20 animate-pulse w-1/3" />
      </div>
    </div>
  );
}
