"use client";

import { useState } from "react";
import {
  Star,
  Shield,
  Truck,
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  addToCart,
  updateQuantity,
  removeFromCart,
} from "@/lib/store/slices/cartSlice";
import { toggleWishlist } from "@/lib/store/slices/wishlistSlice";
import { useTransition } from "react";
import Image from "next/image";
import { ProductCard } from "@/components/product/product-card";
import type { Product, ProductVariant } from "@/types/product";

interface ProductDetailsProps {
  product: Product;
  relatedProducts?: Product[];
}

export function ProductDetails({
  product,
  relatedProducts = [],
}: ProductDetailsProps) {
  const variants = product.variants ?? [];
  const images = product.images ?? [];

  // Derive unique colors and sizes from variants
  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))] as string[];
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))] as string[];

  const [selectedColor, setSelectedColor] = useState<string>(colors[0] ?? "");
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] ?? "");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"details" | "care" | "specs">("details");

  const dispatch = useAppDispatch();
  const [isPending, startTransition] = useTransition();

  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const cartItems = useAppSelector((state) => state.cart.items);
  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  // Find the matching variant for selected color+size
  const selectedVariant: ProductVariant | undefined = variants.find(
    (v) =>
      (colors.length === 0 || v.color === selectedColor) &&
      (sizes.length === 0 || v.size === selectedSize)
  );

  // Price: prefer variant price, fall back to basePrice
  const activePrice = selectedVariant?.price ?? product.basePrice;

  // Active discount (first active one)
  const activeDiscount = product.discounts?.find((d) => d.isActive);
  const discountedPrice = activeDiscount
    ? activeDiscount.type === "percentage"
      ? activePrice * (1 - activeDiscount.value / 100)
      : activePrice - activeDiscount.value
    : null;
  const displayPrice = discountedPrice ?? activePrice;

  const inStock = selectedVariant ? selectedVariant.stock > 0 : true;

  const cartItem = cartItems.find(
    (item) =>
      item.id === product.id &&
      item.size === selectedSize &&
      item.color === selectedColor
  );
  const isInCart = !!cartItem;

  // Primary image first, then sorted by order
  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return a.order - b.order;
  });
  const currentImage = sortedImages[selectedImageIndex];

  const handleToggleWishlist = () => {
    dispatch(
      toggleWishlist({
        id: product.id,
        name: product.name,
        price: displayPrice,
        imageUrl: sortedImages[0]?.url ?? "",
        brand: "",
        location: "",
      })
    );
  };

  const handleAddToCart = () => {
    startTransition(() => {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          size: selectedSize,
          price: displayPrice,
          color: selectedColor,
          quantity,
          imageUrl: sortedImages[0]?.url ?? "",
        })
      );
    });
  };

  const incrementQuantity = () => {
    if (isInCart && cartItem) {
      dispatch(updateQuantity({ id: cartItem.id, quantity: cartItem.quantity + 1 }));
    } else {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (isInCart && cartItem) {
      if (cartItem.quantity === 1) {
        dispatch(removeFromCart({ id: cartItem.id }));
      } else {
        dispatch(updateQuantity({ id: cartItem.id, quantity: cartItem.quantity - 1 }));
      }
    } else if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      black: "bg-black",
      white: "bg-white border border-gray-300",
      gray: "bg-gray-400",
      silver: "bg-gray-300",
      blue: "bg-blue-600",
      navy: "bg-blue-900",
      brown: "bg-amber-800",
      green: "bg-green-600",
      red: "bg-red-600",
      pink: "bg-pink-400",
      purple: "bg-purple-600",
    };
    return colorMap[color.toLowerCase()] || "bg-[#E3A7C4]";
  };

  // Derive average rating from reviews if available
  const reviewList = product.reviews ?? [];
  const avgRating =
    reviewList.length > 0
      ? reviewList.reduce((sum, r) => sum + r.rating, 0) / reviewList.length
      : null;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* ── Main two-column section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

          {/* LEFT: Image gallery */}
          <div>
            <div className="relative aspect-square overflow-hidden bg-[#ffbdc5]/20 border border-[#E3A7C4]/30 mb-3">
              {currentImage ? (
                <Image
                  src={currentImage.url}
                  alt={currentImage.altText ?? product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  بدون تصویر
                </div>
              )}
              {activeDiscount && (
                <div className="absolute top-0 left-0 z-10 bg-[#670626] text-white text-xs font-bold px-2 py-1.5 leading-none">
                  {activeDiscount.type === "percentage"
                    ? `${activeDiscount.value}٪ تخفیف`
                    : `${activeDiscount.value}$ تخفیف`}
                </div>
              )}
            </div>

            {sortedImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {sortedImages.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === idx
                        ? "border-[#670626]"
                        : "border-[#E3A7C4]/40 hover:border-[#E3A7C4]"
                    }`}
                  >
                    <Image
                      src={img.thumbnailUrl ?? img.url}
                      alt={img.altText ?? `${product.name} ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product info */}
          <div className="space-y-5">

            {/* Category badge */}
            {product.category && (
              <div className="flex items-center gap-2">
                <span className="border border-[#E3A7C4]/60 px-2 py-0.5 text-xs text-[#670626] font-medium">
                  {product.category.name}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
              {product.name}
            </h1>

            {/* Rating row — only shown if reviews exist */}
            {avgRating !== null && (
              <div className="flex items-center flex-wrap gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i <= Math.round(avgRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-500">
                  {reviewList.length.toLocaleString()} نظر
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 pb-4 border-b border-[#E3A7C4]/30">
              <span className="text-3xl font-bold text-[#670626]">
                ${displayPrice.toFixed(2)}
              </span>
              {discountedPrice !== null && (
                <span className="text-lg text-gray-400 line-through">
                  ${activePrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Color selector */}
            {colors.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  رنگ:{" "}
                  <span className="text-[#670626] font-semibold">{selectedColor}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      aria-label={color}
                      className={`w-8 h-8 rounded-full transition-all ${getColorClass(color)} ${
                        selectedColor === color
                          ? "ring-2 ring-offset-2 ring-[#670626] scale-110"
                          : "hover:scale-105"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {sizes.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">سایز:</p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[44px] px-4 py-2 border text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? "border-[#670626] bg-[#ffbdc5]/25 text-[#670626]"
                          : "border-gray-200 text-gray-600 hover:border-[#E3A7C4]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity stepper / Add to cart */}
            <div className="space-y-3 pt-1">
              {isInCart ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-[#E3A7C4]/50 overflow-hidden">
                    <button
                      onClick={decrementQuantity}
                      className="px-4 py-3 bg-[#ffbdc5]/30 hover:bg-[#ffbdc5]/60 transition-colors"
                    >
                      {cartItem?.quantity === 1 ? (
                        <Trash2 className="w-5 h-5 text-[#670626]" />
                      ) : (
                        <Minus className="w-5 h-5 text-[#670626]" />
                      )}
                    </button>
                    <span className="px-6 py-3 text-lg font-bold bg-white">
                      {cartItem?.quantity ?? 0}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      className="px-4 py-3 bg-[#670626] hover:bg-[#670626]/90 text-white transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-start">
                    <p className="text-xs text-gray-400">جمع کل</p>
                    <p className="text-xl font-bold text-[#670626]">
                      ${(displayPrice * (cartItem?.quantity ?? 0)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={isPending || !inStock}
                  className="w-full bg-[#670626] hover:bg-[#670626]/90 text-white py-3 font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {!inStock
                    ? "ناموجود"
                    : isPending
                    ? "در حال افزودن..."
                    : "افزودن به سبد خرید"}
                </button>
              )}
            </div>

            {/* Features strip */}
            <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-[#E3A7C4]/30">
              <div className="flex flex-col items-center text-center gap-1.5 p-2">
                <Truck className="w-5 h-5 text-[#670626]" />
                <p className="text-xs font-medium">ارسال رایگان</p>
                <p className="text-[10px] text-gray-400">بالای ۵۰ دلار</p>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5 p-2 border-x border-[#E3A7C4]/30">
                <Shield className="w-5 h-5 text-[#670626]" />
                <p className="text-xs font-medium">پرداخت امن</p>
                <p className="text-[10px] text-gray-400">۱۰۰٪ محافظت</p>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5 p-2">
                <RefreshCw className="w-5 h-5 text-[#670626]" />
                <p className="text-xs font-medium">مرجوعی آسان</p>
                <p className="text-[10px] text-gray-400">۳۰ روزه</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Info tabs ── */}
        <div className="mb-12 border border-[#E3A7C4]/30">
          <div className="flex border-b border-[#E3A7C4]/30 overflow-x-auto">
            {(
              [
                { key: "details", label: "جزئیات محصول" },
                { key: "care", label: "راهنمای نگهداری" },
                { key: "specs", label: "مشخصات" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-shrink-0 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.key
                    ? "border-[#670626] text-[#670626] bg-[#ffbdc5]/10"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "details" && (
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {product.description ?? "توضیحاتی ثبت نشده است."}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                  {product.category && (
                    <div className="bg-[#ffbdc5]/15 border border-[#E3A7C4]/30 p-3">
                      <p className="text-xs text-gray-400 mb-0.5">دسته‌بندی</p>
                      <p className="text-sm font-medium text-gray-800">
                        {product.category.name}
                      </p>
                    </div>
                  )}
                  <div className="bg-[#ffbdc5]/15 border border-[#E3A7C4]/30 p-3">
                    <p className="text-xs text-gray-400 mb-0.5">موجودی</p>
                    <p className={`text-sm font-medium ${inStock ? "text-[#670626]" : "text-gray-400"}`}>
                      {inStock ? "موجود" : "ناموجود"}
                    </p>
                  </div>
                  {product.attributes?.map((attr) => (
                    <div
                      key={attr.id}
                      className="bg-[#ffbdc5]/15 border border-[#E3A7C4]/30 p-3"
                    >
                      <p className="text-xs text-gray-400 mb-0.5">{attr.key}</p>
                      <p className="text-sm font-medium text-gray-800">{attr.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "care" && (
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#670626] mt-0.5">•</span>
                  با آب سرد و لباس‌های هم‌رنگ بشویید
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#670626] mt-0.5">•</span>
                  از سفیدکننده استفاده نکنید
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#670626] mt-0.5">•</span>
                  در دمای پایین خشک کنید
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#670626] mt-0.5">•</span>
                  در صورت نیاز با حرارت کم اتو بزنید
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#670626] mt-0.5">•</span>
                  خشکشویی نشود
                </li>
              </ul>
            )}

            {activeTab === "specs" && (
              <div className="space-y-3 text-sm">
                {sizes.length > 0 && (
                  <div className="flex justify-between py-2 border-b border-[#E3A7C4]/20">
                    <span className="text-gray-500">سایزهای موجود</span>
                    <span className="font-medium text-gray-800">{sizes.join("، ")}</span>
                  </div>
                )}
                {colors.length > 0 && (
                  <div className="flex justify-between py-2 border-b border-[#E3A7C4]/20">
                    <span className="text-gray-500">رنگ‌های موجود</span>
                    <span className="font-medium text-gray-800">{colors.join("، ")}</span>
                  </div>
                )}
                {selectedVariant && (
                  <div className="flex justify-between py-2 border-b border-[#E3A7C4]/20">
                    <span className="text-gray-500">SKU</span>
                    <span className="font-medium text-gray-800">{selectedVariant.sku}</span>
                  </div>
                )}
                {selectedVariant && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">موجودی انبار</span>
                    <span className="font-medium text-gray-800">
                      {selectedVariant.stock.toLocaleString()} عدد
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Related products ── */}
        {relatedProducts.length > 0 && (
          <div className="pb-8">
            <h2 className="text-xl font-bold mb-6 text-gray-900">
              شاید دوست داشته باشید
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => {
                const primaryImage = p.images?.find((i) => i.isPrimary) ?? p.images?.[0];
                const relatedVariant = p.variants?.[0];
                const relatedDiscount = p.discounts?.find((d) => d.isActive);
                const relatedBase = relatedVariant?.price ?? p.basePrice;
                const relatedFinal = relatedDiscount
                  ? relatedDiscount.type === "percentage"
                    ? relatedBase * (1 - relatedDiscount.value / 100)
                    : relatedBase - relatedDiscount.value
                  : null;

                return (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    title={p.name}
                    price={relatedFinal ?? relatedBase}
                    imageUrl={primaryImage?.url ?? ""}
                    originalPrice={relatedFinal ? relatedBase : undefined}
                    discount={
                      relatedDiscount?.type === "percentage"
                        ? relatedDiscount.value
                        : undefined
                    }
                  />
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
