"use client";

import { useEffect, useRef, useState } from "react";
import {
  Shield,
  Headphones,
  ShoppingBag,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { QuantityStepper } from "@/shared/components/cart/quantity-stepper";
import {
  AppSlider,
  type AppSliderHandle,
} from "@/shared/components/app-slider";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { toggleWishlist } from "@/shared/store/slices/wishlistSlice";
import { useCart } from "@/features/cart/queries";
import { formatToman } from "@/shared/lib/utils";
import { getDiscountInfo } from "@/shared/lib/discount";
import { brandPath, categoryPath } from "@/shared/lib/urls";
import { readPendingReview } from "@/shared/lib/pending-review";
import { toPersianDigits } from "@/shared/lib/digits";
import { useReviewSummary } from "@/features/review/queries";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/shared/components/product/product-card";
import { ProductReviews } from "@/shared/components/product/reviews/product-reviews";
import { AddedToCartDialog } from "@/shared/components/cart/added-to-cart-dialog";
import type { Product } from "@/types/product";

interface ProductDetailsProps {
  product: Product;
  relatedProducts?: Product[];
  /**
   * Admin-curated "buy together" products, shown inside the add-to-cart confirmation.
   * Empty for most products, in which case the dialog stays a plain confirmation.
   */
  cartSuggestions?: Product[];
  /** "View more products" link — the /products page filtered by this page's categories. */
  moreHref?: string;
}

export function ProductDetails({
  product,
  relatedProducts = [],
  cartSuggestions = [],
  moreHref,
}: ProductDetailsProps) {
  const images = product.images ?? [];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "details" | "reviews" | "care" | "specs"
  >("details");
  const [descExpanded, setDescExpanded] = useState(false);
  const [showAddedDialog, setShowAddedDialog] = useState(false);
  const [attributesExpanded, setAttributesExpanded] = useState(false);

  // Review count for the tab label. Shares its query key with the reviews tab, so opening the
  // tab does not refetch.
  const { data: reviewSummary } = useReviewSummary(product.id);

  const tabsRef = useRef<HTMLDivElement>(null);
  const pendingReviewScroll = useRef(false);

  // Arriving at "#reviews" — or coming back from login with a parked draft — opens the reviews
  // tab instead of the default one. The draft itself is restored by ProductReviews.
  useEffect(() => {
    const wantsReviews =
      window.location.hash === "#reviews" || !!readPendingReview(product.id);
    if (!wantsReviews) return;
    setActiveTab("reviews");
    pendingReviewScroll.current = true;
  }, [product.id]);

  // Scroll only once the reviews tab has actually rendered, so the tab bar lands at the top of
  // the viewport rather than somewhere mid-transition.
  useEffect(() => {
    if (activeTab !== "reviews" || !pendingReviewScroll.current) return;
    pendingReviewScroll.current = false;
    tabsRef.current?.scrollIntoView({ block: "start" });
  }, [activeTab]);

  // Product description; if long, it collapses on mobile and expands with a button.
  const description = product.description?.trim() || "توضیحاتی ثبت نشده است.";
  const isLongDescription = (product.description?.trim().length ?? 0) > 160;

  // Attribute cards; if there are many, they collapse on mobile and expand with a button.
  const isManyAttributes = (product.attributes?.length ?? 0) > 5;
  const dispatch = useAppDispatch();

  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const {
    lines: cartLines,
    add,
    updateQty,
    remove,
    isAdding,
    isLinePending,
  } = useCart();
  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  // The active discount and effective price come from the backend (no date/active logic on the frontend)
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

  // Control the slider from outside (clicking a thumbnail)
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

  const handleAddToCart = async () => {
    if (!inStock) return;
    try {
      await add({
        id: product.id,
        name: product.name,
        price: displayPrice,
        originalPrice: activePrice,
        quantity,
        imageUrl: sortedImages[0]?.url ?? "",
        stock: product.stock,
      });
      setShowAddedDialog(true);
    } catch {
      // Error toast is already shown by the cart hook.
    }
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

  return (
    <div className="min-h-screen bg-card">
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-28 lg:pb-6">
        {/* ── Main two-column section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* LEFT: Image gallery */}
          <div>
            <div className="relative aspect-square overflow-hidden border border-border mb-3 rounded-2xl select-none">
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
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  بدون تصویر
                </div>
              )}
              {activeDiscount && (
                <div className="absolute top-0 left-0 z-10 bg-secondary text-white text-xs font-bold px-2.5 py-1.5 leading-none rounded-tl-2xl rounded-br-2xl">
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
                        ? "border-secondary"
                        : "border-border hover:border-border"
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
                  <Link
                    href={categoryPath(product.category.slug)}
                    className="border border-border/60 px-2.5 py-0.5 text-xs text-secondary font-medium rounded-full transition-colors hover:bg-primary/20 hover:border-secondary/40"
                  >
                    {product.category.name}
                  </Link>
                )}
                {product.brand && (
                  <Link
                    href={brandPath(product.brand.slug)}
                    className="border border-border/60 bg-primary/15 px-2.5 py-0.5 text-xs text-secondary font-medium rounded-full transition-colors hover:bg-primary/30 hover:border-secondary/40"
                  >
                    برند: {product.brand.name}
                  </Link>
                )}
              </div>
            )}

            {/* Title */}
            <h1 className="text-xl md:text-3xl font-bold text-foreground leading-snug">
              {product.name}
            </h1>

            {/* Price (hidden on mobile — shown in the sticky bottom bar instead) */}
            <div className="hidden lg:flex items-center gap-3 pb-4 border-b border-border">
              <span className=" text-md md:text-3xl font-bold text-secondary">
                {formatToman(displayPrice)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatToman(activePrice)}
                </span>
              )}
            </div>

            {/* Stock status */}
            <div className="text-sm">
              {inStock ? (
                <span className="text-green-600 font-medium">
                  موجود در انبار
                  {product.stock <= 3 &&
                    ` — تنها ${product.stock} عدد باقی مانده`}
                </span>
              ) : (
                <span className="text-muted-foreground font-medium">
                  ناموجود
                </span>
              )}
            </div>

            {/* Quantity stepper / Add to cart (hidden on mobile — shown in the sticky bottom bar instead) */}
            <div className="hidden lg:block space-y-3 pt-1">
              {isInCart ? (
                <div className="flex items-center justify-between">
                  <QuantityStepper
                    variant="detail"
                    quantity={cartItem?.quantity ?? 0}
                    max={product.stock}
                    disabled={!!cartItem && isLinePending(cartItem)}
                    showTrashAtMin
                    onIncrement={incrementQuantity}
                    onDecrement={decrementQuantity}
                  />
                  <div className="text-start">
                    <p className="text-xs text-muted-foreground">جمع کل</p>
                    <p className="text-xl font-bold text-secondary">
                      {formatToman(displayPrice * (cartItem?.quantity ?? 0))}
                    </p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || !inStock}
                  className="w-full bg-secondary hover:bg-secondary/90 text-white py-3 font-medium flex items-center justify-center gap-2 rounded-2xl transition-colors disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {!inStock
                    ? "ناموجود"
                    : isAdding
                      ? "در حال افزودن..."
                      : "افزودن به سبد خرید"}
                </button>
              )}
            </div>

            {/* Features strip */}
            <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-border">
              <div className="flex flex-col items-center text-center gap-1.5 p-2">
                <Headphones className="w-5 h-5 text-secondary" />
                <p className="text-xs font-medium">پشتیبانی ۲۴ ساعته</p>
                <p className="text-[10px] text-muted-foreground">
                  پاسخ‌گویی در تمام ساعات شبانه‌روز
                </p>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5 p-2 border-x border-border">
                <Shield className="w-5 h-5 text-secondary" />
                <p className="text-xs font-medium">پرداخت امن</p>
                <p className="text-[10px] text-muted-foreground">۱۰۰٪ محافظت</p>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5 p-2">
                <RefreshCw className="w-5 h-5 text-secondary" />
                <p className="text-xs font-medium">مرجوعی آسان</p>
                <p className="text-[10px] text-muted-foreground">7 روزه</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Info tabs ── */}
        <div
          ref={tabsRef}
          className="mb-12 border border-border rounded-2xl overflow-hidden scroll-mt-4"
        >
          <div className="flex border-b border-border overflow-x-auto">
            {(
              [
                { key: "details", label: "جزئیات محصول" },
                { key: "reviews", label: "نظرات کاربران" },
                // { key: "care", label: "Storage & usage tips" },
                // { key: "specs", label: "Specifications" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-shrink-0 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.key
                    ? "border-secondary text-secondary bg-primary/10"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {tab.key === "reviews" && !!reviewSummary?.count && (
                  <span className="ms-1.5 text-xs text-muted-foreground">
                    ({toPersianDigits(reviewSummary.count)})
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-4 md:p-6">
            {activeTab === "details" && (
              <div className="space-y-4">
                <div className="relative">
                  <p
                    className={`text-muted-foreground leading-relaxed text-sm md:text-base whitespace-pre-line ${
                      isLongDescription && !descExpanded
                        ? "line-clamp-5 md:line-clamp-none"
                        : ""
                    }`}
                  >
                    {description}
                  </p>
                  {/* Gradual fade at the bottom of the text when collapsed (mobile only) */}
                  {isLongDescription && !descExpanded && (
                    <div className="md:hidden pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background to-transparent" />
                  )}
                </div>

                {isLongDescription && (
                  <button
                    type="button"
                    onClick={() => setDescExpanded((v) => !v)}
                    className="md:hidden w-full flex items-center justify-center gap-1.5 rounded-xl border border-border bg-primary/10 py-2.5 text-sm font-medium text-secondary active:scale-[0.99] transition-transform"
                    aria-expanded={descExpanded}
                  >
                    {descExpanded ? "بستن جزئیات" : "مشاهده‌ی جزئیات بیشتر"}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        descExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}

                <div className="relative">
                  <div
                    className={`grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 ${
                      isManyAttributes && !attributesExpanded
                        ? "max-h-64 overflow-hidden md:max-h-none md:overflow-visible"
                        : ""
                    }`}
                  >
                    {product.category && (
                      <div className="bg-primary/15 border border-border p-3 rounded-xl">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          دسته‌بندی
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {product.category.name}
                        </p>
                      </div>
                    )}

                    {product.attributes?.map((attr) => (
                      <div
                        key={attr.id}
                        className="bg-primary/15 border border-border p-3 rounded-xl"
                      >
                        <p className="text-xs text-muted-foreground mb-0.5">
                          {attr.key}
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {attr.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  {/* Gradual fade at the bottom of the grid when collapsed (mobile only) */}
                  {isManyAttributes && !attributesExpanded && (
                    <div className="md:hidden pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background to-transparent" />
                  )}
                </div>

                {isManyAttributes && (
                  <button
                    type="button"
                    onClick={() => setAttributesExpanded((v) => !v)}
                    className="md:hidden w-full flex items-center justify-center gap-1.5 rounded-xl border border-border bg-primary/10 py-2.5 text-sm font-medium text-secondary active:scale-[0.99] transition-transform"
                    aria-expanded={attributesExpanded}
                  >
                    {attributesExpanded ? "بستن مشخصات" : "مشاهده‌ی مشخصات بیشتر"}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        attributesExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <ProductReviews
                productId={product.id}
                productSlug={product.slug}
              />
            )}

            {/* The "Storage & usage tips" tab is currently commented out.
            {activeTab === "care" && (
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">•</span>
                  Store in a cool, dry place away from direct sunlight
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">•</span>
                  After opening the package, close it tightly to keep it fresh
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">•</span>
                  Always keep clean, fresh water available next to the food
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">•</span>
                  Adjust the amount according to the pet's weight and age
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">•</span>
                  Before use, check the expiry date printed on the package
                </li>
              </ul>
            )}
            */}

            {/* {activeTab === "specs" && (
              <div className="space-y-3 text-sm">
                {product.sku && (
                  <div className="flex justify-between py-2 border-b border-border/20">
                    <span className="text-muted-foreground">Product code</span>
                    <span className="font-medium text-foreground">
                      {product.sku}
                    </span>
                  </div>
                )}
                {product.category && (
                  <div className="flex justify-between py-2 border-b border-border/20">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium text-foreground">
                      {product.category.name}
                    </span>
                  </div>
                )}
                {product.attributes?.map((attr) => (
                  <div
                    key={attr.id}
                    className="flex justify-between py-2 border-b border-border/20"
                  >
                    <span className="text-muted-foreground">{attr.key}</span>
                    <span className="font-medium text-foreground">
                      {attr.value}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Stock</span>
                  <span className="font-medium text-foreground">
                    {product.stock.toLocaleString("fa-IR")} pcs
                  </span>
                </div>
              </div>
            )} */}
          </div>
        </div>

        {/* ── Related products ── */}
        {relatedProducts.length > 0 && (
          <div className="pb-8">
            <h2 className="text-xl font-bold mb-6 text-foreground">
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

            <div className="flex justify-center mt-8">
              <Link
                href={moreHref ?? "/products"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-secondary text-secondary-foreground font-semibold shadow-sm hover:bg-secondary/90 active:scale-95 transition-all"
              >
                مشاهده محصولات بیشتر
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile sticky add-to-cart bar (price right, add-to-cart left) ── */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-border bg-card px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        {/* Add to cart / stepper (left in RTL) */}
        <div className="flex flex-1 justify-start">
          {isInCart ? (
            <QuantityStepper
              variant="detail"
              quantity={cartItem?.quantity ?? 0}
              max={product.stock}
              disabled={!!cartItem && isLinePending(cartItem)}
              showTrashAtMin
              onIncrement={incrementQuantity}
              onDecrement={decrementQuantity}
            />
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isAdding || !inStock}
              className="flex max-w-[240px] flex-1 items-center justify-center gap-2 rounded-2xl bg-secondary py-3 font-medium text-white transition-colors hover:bg-secondary/90 disabled:opacity-50"
            >
              <ShoppingBag className="h-4 w-4" />
              {!inStock
                ? "ناموجود"
                : isAdding
                  ? "در حال افزودن..."
                  : "افزودن به سبد خرید"}
            </button>
          )}
        </div>
        {/* Price (right in RTL) */}
        <div className="flex shrink-0 flex-col gap-0.5">
          {isInCart ? (
            <>
              <span className="text-[11px] leading-none text-muted-foreground">
                جمع کل
              </span>
              <span className="whitespace-nowrap text-lg font-bold text-secondary">
                {formatToman(displayPrice * (cartItem?.quantity ?? 0))}
              </span>
            </>
          ) : (
            <>
              {hasDiscount && (
                <span className="text-[11px] leading-none text-muted-foreground line-through">
                  {formatToman(activePrice)}
                </span>
              )}
              <span className="whitespace-nowrap text-lg font-bold text-secondary">
                {formatToman(displayPrice)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* ── "Added to cart" confirmation (above sticky bar on mobile, bottom-left on desktop) ── */}
      <AddedToCartDialog
        open={showAddedDialog}
        onOpenChange={setShowAddedDialog}
        products={cartSuggestions}
      />
    </div>
  );
}
