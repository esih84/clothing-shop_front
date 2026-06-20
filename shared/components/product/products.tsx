"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type { Product } from "@/types/product";
import { useInfiniteProducts } from "@/features/product/queries";
import { ScrollReveal } from "@/shared/components/global/scroll-reveal";

const ProductCard = dynamic(
  () => import("./product-card").then((m) => ({ default: m.ProductCard })),
  {
    loading: () => (
      <div className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
    ),
    ssr: false,
  },
);

export function Products({
  initialProducts,
  initialHasMore,
}: {
  initialProducts: Product[];
  initialHasMore: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteProducts({
      products: initialProducts,
      hasMore: initialHasMore,
    });

  useEffect(() => {
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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allProducts = data?.pages.flatMap((p) => p.products) ?? [];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allProducts.map((product, index) => (
          <ScrollReveal key={product.id} delay={(index % 12) * 50}>
            <ProductCard
              id={product.id}
              slug={product.slug}
              title={product.name}
              price={product.basePrice}
              imageUrl={product.images?.[0]?.url || "/placeholder.png"}
            />
          </ScrollReveal>
        ))}
      </div>

      <div ref={bottomRef} className="h-10 flex items-center justify-center">
        {isFetchingNextPage && (
          <span className="text-sm text-gray-400">در حال بارگذاری...</span>
        )}
      </div>
    </>
  );
}
