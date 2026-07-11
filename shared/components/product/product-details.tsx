"use client";

import { useRef, useState } from "react";
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
import {
  AppSlider,
  type AppSliderHandle,
} from "@/shared/components/app-slider";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { toggleWishlist } from "@/shared/store/slices/wishlistSlice";
import { useCart } from "@/features/cart/queries";
import { formatToman } from "@/shared/lib/utils";
import { getDiscountInfo } from "@/shared/lib/discount";
import { useTransition } from "react";
import Image from "next/image";
import { ProductCard } from "@/shared/components/product/product-card";
import type { Product } from "@/types/product";

interface ProductDetailsProps {
  product: Product;
  relatedProducts?: Product[];
}

export function ProductDetails({
  product,
  relatedProducts = [],
}: ProductDetailsProps) {
  const images = product.images ?? [];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"details" | "care" | "specs">(
    "details",
  );

  const dispatch = useAppDispatch();
  const [isPending, startTransition] = useTransition();

  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const { lines: cartLines, add, updateQty, remove } = useCart();
  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  // تخفیف فعال و قیمت مؤثر از بک‌اند می‌آیند (بدون منطق تاریخ/فعال‌بودن در فرانت)
  const {
    hasDiscount,
    finalPrice: displayPrice,
    originalPrice: activePrice,
  } = getDiscountInfo(product);
  const activeDiscount = product.activeDiscount ?? null;

  const inStock = product.stock > 0;

  const cartItem = cartLines.find((l) => l.productId === product.id);
  const isInCart = !!cartItem;

  // Primary image first, then sorted by order
  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return a.order - b.order;
  });

  // کنترل اسلایدر از بیرون (کلیک روی thumbnail)
  const sliderRef = useRef<AppSliderHandle>(null);
  const goToImage = (index: number) => sliderRef.current?.slideTo(index);

  const handleToggleWishlist = () => {
    dispatch(
      toggleWishlist({
        id: product.id,
        name: product.name,
        price: displayPrice,
        imageUrl: sortedImages[0]?.url ?? "",
        brand: "",
        location: "",
      }),
    );
  };

  const handleAddToCart = () => {
    if (!inStock) return;
    startTransition(() => {
      void add({
        id: product.id,
        name: product.name,
        price: displayPrice,
        quantity,
        imageUrl: sortedImages[0]?.url ?? "",
      });
    });
  };

  const incrementQuantity = () => {
    if (isInCart && cartItem) {
      void updateQty(cartItem, cartItem.quantity + 1);
    } else {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (isInCart && cartItem) {
      if (cartItem.quantity === 1) {
        void remove(cartItem);
      } else {
        void updateQty(cartItem, cartItem.quantity - 1);
      }
    } else if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
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
            <div className="relative aspect-square overflow-hidden bg-[#FDE68A]/20 border border-[#A9CBF5]/30 mb-3 rounded-2xl select-none">
              {sortedImages.length > 0 ? (
                <AppSlider
                  ref={sliderRef}
                  items={sortedImages}
                  getKey={(img) => img.id}
                  loop={sortedImages.length > 1}
                  navigation={sortedImages.length > 1}
                  pagination={sortedImages.length > 1}
                  onSlideChange={setSelectedImageIndex}
                  className="h-full"
                  renderItem={(img, idx) => (
                    <div className="relative w-full h-full">
                      <Image
                        src={img.url}
                        alt={img.altText ?? product.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                        priority={idx === 0}
                      />
                    </div>
                  )}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  بدون تصویر
                </div>
              )}
              {activeDiscount && (
                <div className="absolute top-0 left-0 z-10 bg-[#1473E6] text-white text-xs font-bold px-2.5 py-1.5 leading-none rounded-tl-2xl rounded-br-2xl">
                  {activeDiscount.type === "percentage"
                    ? `${activeDiscount.value}٪ تخفیف`
                    : `${formatToman(activeDiscount.value)} تخفیف`}
                </div>
              )}
            </div>

            {sortedImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {sortedImages.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => goToImage(idx)}
                    className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 overflow-hidden border-2 rounded-xl transition-colors ${
                      selectedImageIndex === idx
                        ? "border-[#1473E6]"
                        : "border-[#A9CBF5]/40 hover:border-[#A9CBF5]"
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
            {/* Category / Brand badges */}
            {(product.category || product.brand) && (
              <div className="flex flex-wrap items-center gap-2">
                {product.category && (
                  <span className="border border-[#A9CBF5]/60 px-2.5 py-0.5 text-xs text-[#1473E6] font-medium rounded-full">
                    {product.category.name}
                  </span>
                )}
                {product.brand && (
                  <span className="border border-[#A9CBF5]/60 bg-[#FDE68A]/30 px-2.5 py-0.5 text-xs text-[#1473E6] font-medium rounded-full">
                    برند: {product.brand.name}
                  </span>
                )}
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
            <div className="flex items-center gap-3 pb-4 border-b border-[#A9CBF5]/30">
              <span className="text-3xl font-bold text-[#1473E6]">
                {formatToman(displayPrice)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-gray-400 line-through">
                  {formatToman(activePrice)}
                </span>
              )}
            </div>

            {/* Stock status */}
            <div className="text-sm">
              {inStock ? (
                <span className="text-green-600 font-medium">
                  موجود در انبار
                  {product.stock <= 10 &&
                    ` — تنها ${product.stock} عدد باقی مانده`}
                </span>
              ) : (
                <span className="text-gray-400 font-medium">ناموجود</span>
              )}
            </div>

            {/* Quantity stepper / Add to cart */}
            <div className="space-y-3 pt-1">
              {isInCart ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-[#A9CBF5]/50 overflow-hidden rounded-xl">
                    <button
                      onClick={decrementQuantity}
                      className="px-4 py-3 bg-[#FDE68A]/30 hover:bg-[#FDE68A]/60 transition-colors"
                    >
                      {cartItem?.quantity === 1 ? (
                        <Trash2 className="w-5 h-5 text-[#1473E6]" />
                      ) : (
                        <Minus className="w-5 h-5 text-[#1473E6]" />
                      )}
                    </button>
                    <span className="px-6 py-3 text-lg font-bold bg-white">
                      {cartItem?.quantity ?? 0}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      className="px-4 py-3 bg-[#1473E6] hover:bg-[#1473E6]/90 text-white transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-start">
                    <p className="text-xs text-gray-400">جمع کل</p>
                    <p className="text-xl font-bold text-[#1473E6]">
                      {formatToman(displayPrice * (cartItem?.quantity ?? 0))}
                    </p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={isPending || !inStock}
                  className="w-full bg-[#1473E6] hover:bg-[#1473E6]/90 text-white py-3 font-medium flex items-center justify-center gap-2 rounded-2xl transition-colors disabled:opacity-50"
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
            <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-[#A9CBF5]/30">
              <div className="flex flex-col items-center text-center gap-1.5 p-2">
                <Truck className="w-5 h-5 text-[#1473E6]" />
                <p className="text-xs font-medium">ارسال رایگان</p>
                <p className="text-[10px] text-gray-400">
                  سفارش‌های بالای ۵۰۰ هزار تومان
                </p>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5 p-2 border-x border-[#A9CBF5]/30">
                <Shield className="w-5 h-5 text-[#1473E6]" />
                <p className="text-xs font-medium">پرداخت امن</p>
                <p className="text-[10px] text-gray-400">۱۰۰٪ محافظت</p>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5 p-2">
                <RefreshCw className="w-5 h-5 text-[#1473E6]" />
                <p className="text-xs font-medium">مرجوعی آسان</p>
                <p className="text-[10px] text-gray-400">۳۰ روزه</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Info tabs ── */}
        <div className="mb-12 border border-[#A9CBF5]/30 rounded-2xl overflow-hidden">
          <div className="flex border-b border-[#A9CBF5]/30 overflow-x-auto">
            {(
              [
                { key: "details", label: "جزئیات محصول" },
                { key: "care", label: "نکات نگهداری و مصرف" },
                // { key: "specs", label: "مشخصات" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-shrink-0 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.key
                    ? "border-[#1473E6] text-[#1473E6] bg-[#FDE68A]/10"
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
                    <div className="bg-[#FDE68A]/15 border border-[#A9CBF5]/30 p-3 rounded-xl">
                      <p className="text-xs text-gray-400 mb-0.5">دسته‌بندی</p>
                      <p className="text-sm font-medium text-gray-800">
                        {product.category.name}
                      </p>
                    </div>
                  )}

                  {product.attributes?.map((attr) => (
                    <div
                      key={attr.id}
                      className="bg-[#FDE68A]/15 border border-[#A9CBF5]/30 p-3 rounded-xl"
                    >
                      <p className="text-xs text-gray-400 mb-0.5">{attr.key}</p>
                      <p className="text-sm font-medium text-gray-800">
                        {attr.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "care" && (
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#1473E6] mt-0.5">•</span>
                  در جای خشک و خنک و دور از نور مستقیم آفتاب نگهداری شود
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1473E6] mt-0.5">•</span>
                  پس از باز کردن بسته، درب آن را محکم ببندید تا تازگی حفظ شود
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1473E6] mt-0.5">•</span>
                  همیشه آب تمیز و تازه در کنار غذا در دسترس حیوان قرار دهید
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1473E6] mt-0.5">•</span>
                  مقدار مصرف را متناسب با وزن و سن حیوان تنظیم کنید
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1473E6] mt-0.5">•</span>
                  پیش از مصرف، تاریخ انقضای درج‌شده روی بسته را بررسی کنید
                </li>
              </ul>
            )}

            {/* {activeTab === "specs" && (
              <div className="space-y-3 text-sm">
                {product.sku && (
                  <div className="flex justify-between py-2 border-b border-[#A9CBF5]/20">
                    <span className="text-gray-500">کد محصول</span>
                    <span className="font-medium text-gray-800">
                      {product.sku}
                    </span>
                  </div>
                )}
                {product.category && (
                  <div className="flex justify-between py-2 border-b border-[#A9CBF5]/20">
                    <span className="text-gray-500">دسته‌بندی</span>
                    <span className="font-medium text-gray-800">
                      {product.category.name}
                    </span>
                  </div>
                )}
                {product.attributes?.map((attr) => (
                  <div
                    key={attr.id}
                    className="flex justify-between py-2 border-b border-[#A9CBF5]/20"
                  >
                    <span className="text-gray-500">{attr.key}</span>
                    <span className="font-medium text-gray-800">
                      {attr.value}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">موجودی انبار</span>
                  <span className="font-medium text-gray-800">
                    {product.stock.toLocaleString("fa-IR")} عدد
                  </span>
                </div>
              </div>
            )} */}
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
                const primaryImage =
                  p.images?.find((i) => i.isPrimary) ?? p.images?.[0];
                const relatedDiscount = p.discounts?.find((d) => d.isActive);
                const relatedBase = p.basePrice;
                const relatedFinal = relatedDiscount
                  ? relatedDiscount.type === "percentage"
                    ? relatedBase * (1 - relatedDiscount.value / 100)
                    : relatedBase - relatedDiscount.value
                  : null;

                return (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    slug={p.slug}
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
