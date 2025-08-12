"use client";

import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { toggleWishlist } from "@/lib/store/slices/wishlistSlice";
import { useTransition } from "react";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  rating?: number;
  reviews?: number;
  sales?: number;
}

export function ProductCard({
  id,
  title,
  price,
  imageUrl,
  rating = 4.5,
  reviews = 5000,
  sales = 1000,
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
        })
      );
    });
  };

  return (
    <Link
      href={`/product/${id}`}
      className="block group"
      style={{ viewTransitionName: `product-${id}` }}
    >
      <div className="relative bg-gray-100 rounded-2xl overflow-hidden aspect-square mb-3">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          width={300}
          height={300}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          style={{ viewTransitionName: `product-image-${id}` }}
        />
        <button
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-sm"
          disabled={isPending}
        >
          <Heart
            className={`w-4 h-4 ${
              isInWishlist ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>
      </div>
      <div>
        <h3
          className="font-medium text-base mb-1"
          style={{ viewTransitionName: `product-title-${id}` }}
        >
          {title}
        </h3>
        <div className="flex items-center gap-1 mb-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium">{rating}</span>
          <span className="text-xs text-gray-500">
            ({reviews.toLocaleString()} sold)
          </span>
        </div>
        <p
          className="font-bold"
          style={{ viewTransitionName: `product-price-${id}` }}
        >
          ${price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
