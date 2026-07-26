"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";
import type { Product } from "@/types/product";
import type { ProductFilters } from "@/features/product/product-api";
import { useInfiniteProducts } from "@/features/product/queries";
import { ScrollReveal } from "@/shared/components/global/scroll-reveal";
import { getDiscountInfo } from "@/shared/lib/discount";

const ProductCard = dynamic(
  () => import("./product-card").then((m) => ({ default: m.ProductCard })),
  {
    loading: () => (
      <div className="aspect-square bg-muted rounded-2xl animate-pulse" />
    ),
    ssr: false,
  },
);

export function Products({
  initialProducts,
  initialHasMore,
  filters,
  limit = 10,
  maxItems,
  moreHref,
  gridClassName = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
}: {
  initialProducts: Product[];
  initialHasMore: boolean;
  filters?: ProductFilters;
  limit?: number;
  /** Display cap (home = 20). On reaching the cap, scrolling stops and a "more" button is shown. */
  maxItems?: number;
  /** Destination of the "show more products" button when the cap is reached. */
  moreHref?: string;
  gridClassName?: string;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteProducts({
      filters,
      limit,
      initial: { products: initialProducts, hasMore: initialHasMore },
    });

  const allProducts = useMemo(
    () => data?.pages.flatMap((p) => p.products) ?? [],
    [data],
  );

  const capReached = maxItems != null && allProducts.length >= maxItems;
  const displayed =
    maxItems != null ? allProducts.slice(0, maxItems) : allProducts;
  const showMore = capReached && !!moreHref && !!hasNextPage;

  useEffect(() => {
    // On reaching the cap, stop auto-loading (the user continues with the button).
    if (capReached) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "200px",
      },
    );

    const current = bottomRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, capReached]);

  return (
    <>
      <div className={gridClassName}>
        {displayed.map((product, index) => {
          const { hasDiscount, finalPrice, originalPrice, percent } =
            getDiscountInfo(product);
          return (
            <ScrollReveal key={product.id} delay={(index % limit) * 50}>
              <ProductCard
                id={product.id}
                slug={product.slug}
                title={product.name}
                price={finalPrice}
                originalPrice={hasDiscount ? originalPrice : undefined}
                discount={hasDiscount ? percent : undefined}
                imageUrl={product.images?.[0]?.url || "/placeholder.png"}
              />
            </ScrollReveal>
          );
        })}
      </div>

      {showMore ? (
        <div className="flex justify-center mt-8">
          <Link
            href={moreHref!}
            prefetch
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-secondary text-secondary-foreground font-semibold shadow-sm hover:bg-secondary/90 active:scale-95 transition-all"
          >
            نمایش محصولات بیشتر
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div ref={bottomRef} className="h-10 flex items-center justify-center">
          {isFetchingNextPage && (
            <span className="text-sm text-muted-foreground">در حال بارگذاری...</span>
          )}
        </div>
      )}
    </>
  );
}
