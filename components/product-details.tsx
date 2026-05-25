"use client";

import { useState } from "react";
import {
  Star,
  Heart,
  Store,
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
import type { Product } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";

interface ProductDetailsProps {
  product: Product;
  relatedProducts?: Product[];
}

export function ProductDetails({
  product,
  relatedProducts = [],
}: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors?.[0] ?? ""
  );
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "M");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"details" | "care" | "specs">(
    "details"
  );

  const dispatch = useAppDispatch();
  const [isPending, startTransition] = useTransition();

  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const cartItems = useAppSelector((state) => state.cart.items);
  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  const cartItem = cartItems.find(
    (item) =>
      item.id === product.id &&
      item.size === selectedSize &&
      item.color === selectedColor
  );
  const isInCart = !!cartItem;

  const handleToggleWishlist = () => {
    dispatch(
      toggleWishlist({
        id: product.id,
        name: product.title,
        price: product.price,
        imageUrl: product.images[0],
        brand: product.brand.name,
        location: product.store.name,
      })
    );
  };

  const handleAddToCart = () => {
    startTransition(() => {
      dispatch(
        addToCart({
          id: product.id,
          name: product.title,
          size: selectedSize,
          price: product.price,
          color: selectedColor,
          quantity: quantity,
          imageUrl: product.images[0],
        })
      );
    });
  };

  const incrementQuantity = () => {
    if (isInCart && cartItem) {
      dispatch(
        updateQuantity({ id: cartItem.id, quantity: cartItem.quantity + 1 })
      );
    } else {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (isInCart && cartItem) {
      if (cartItem.quantity === 1) {
        dispatch(removeFromCart({ id: cartItem.id }));
      } else {
        dispatch(
          updateQuantity({ id: cartItem.id, quantity: cartItem.quantity - 1 })
        );
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

  const colors = product.colors || ["black", "blue", "brown", "gray"];
  const currentImage = product.images[selectedImageIndex] || product.images[0];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* ── Main two-column section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

          {/* LEFT: Image gallery */}
          <div>
            {/* Main image */}
            <div className="relative aspect-square overflow-hidden bg-[#ffbdc5]/20 border border-[#E3A7C4]/30 mb-3">
              <Image
                src={currentImage}
                alt={product.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {product.discount && (
                <div className="absolute top-0 left-0 z-10 bg-[#670626] text-white text-xs font-bold px-2 py-1.5 leading-none">
                  {product.discount}٪ تخفیف
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === idx
                        ? "border-[#670626]"
                        : "border-[#E3A7C4]/40 hover:border-[#E3A7C4]"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} ${idx + 1}`}
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

            {/* Brand */}
            <div className="flex items-center gap-2">
              <span className="border border-[#E3A7C4]/60 px-2 py-0.5 text-xs text-[#670626] font-medium">
                {product.brand.name}
              </span>
              <span className="text-sm text-gray-400">{product.brand.handle}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
              {product.title}
            </h1>

            {/* Rating row */}
            <div className="flex items-center flex-wrap gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i <= Math.round(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {product.rating}
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500">
                {product.reviews.toLocaleString()} نظر
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500">
                {product.sales.toLocaleString()} فروش
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 pb-4 border-b border-[#E3A7C4]/30">
              <span className="text-3xl font-bold text-[#670626]">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>

                </>
              )}
            </div>

            {/* Color selector */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                رنگ:{" "}
                <span className="text-[#670626] font-semibold">
                  {selectedColor}
                </span>
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

            {/* Size selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">سایز:</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
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

            {/* Quantity stepper or CTA buttons */}
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
                      {cartItem?.quantity || 0}
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
                      ${(product.price * (cartItem?.quantity || 0)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isPending}
                    className="flex-1 bg-[#670626] hover:bg-[#670626]/90 text-white py-3 font-normal md:font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {isPending ? "در حال افزودن..." : "افزودن به سبد خرید"}
                  </button>
                  <a
                    href={`/product/${product.id}`}
                    className="flex-1 border border-[#670626] text-[#670626] py-3 font-normal md:font-medium flex items-center justify-center gap-2 transition-colors hover:bg-[#ffbdc5]/10"
                  >
                    مشاهده جزئیات محصول
                  </a>
                </div>
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
                  {product.description}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                  <div className="bg-[#ffbdc5]/15 border border-[#E3A7C4]/30 p-3">
                    <p className="text-xs text-gray-400 mb-0.5">دسته‌بندی</p>
                    <p className="text-sm font-medium text-gray-800">{product.category}</p>
                  </div>
                  <div className="bg-[#ffbdc5]/15 border border-[#E3A7C4]/30 p-3">
                    <p className="text-xs text-gray-400 mb-0.5">برند</p>
                    <p className="text-sm font-medium text-gray-800">{product.brand.name}</p>
                  </div>
                  <div className="bg-[#ffbdc5]/15 border border-[#E3A7C4]/30 p-3">
                    <p className="text-xs text-gray-400 mb-0.5">موجودی</p>
                    <p className={`text-sm font-medium ${product.inStock ? "text-[#670626]" : "text-gray-400"}`}>
                      {product.inStock ? "موجود" : "ناموجود"}
                    </p>
                  </div>
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
                <div className="flex justify-between py-2 border-b border-[#E3A7C4]/20">
                  <span className="text-gray-500">سایزهای موجود</span>
                  <span className="font-medium text-gray-800">
                    {product.sizes.join("، ")}
                  </span>
                </div>
                {product.colors && (
                  <div className="flex justify-between py-2 border-b border-[#E3A7C4]/20">
                    <span className="text-gray-500">رنگ‌های موجود</span>
                    <span className="font-medium text-gray-800">
                      {product.colors.join("، ")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-[#E3A7C4]/20">
                  <span className="text-gray-500">فروشگاه</span>
                  <span className="font-medium text-gray-800">{product.store.name}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">تعداد فروش</span>
                  <span className="font-medium text-gray-800">
                    {product.sales.toLocaleString()}
                  </span>
                </div>
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
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  title={p.title}
                  price={p.price}
                  imageUrl={p.images[0]}
                  originalPrice={p.originalPrice}
                  discount={p.discount}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
