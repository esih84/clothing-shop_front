"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type { Product } from "@/types/product";
import { productService } from "@/lib/services/product/api";

const ProductCard = dynamic(
  () => import("./product-card").then((m) => ({ default: m.ProductCard })),
  {
    loading: () => (
      <div className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
    ),
    ssr: false,
  },
);

type ProductsResponse = {
  products: Product[];
  hasMore: boolean;
};

async function getProductsPage(page: number): Promise<ProductsResponse> {
  const { data, total, limit } = await productService.findAll({
    page,
    limit: 12,
  });

  return {
    products: data,
    hasMore: page * limit < total,
  };
}

export function Products({
  initialProducts,
  initialHasMore,
}: {
  initialProducts: Product[];
  initialHasMore: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["products"],
      queryFn: ({ pageParam }) => getProductsPage(pageParam as number),
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) =>
        lastPage.hasMore ? pages.length + 1 : undefined,
      initialData: {
        pages: [
          {
            products: initialProducts,
            hasMore: initialHasMore,
          },
        ],
        pageParams: [1],
      },
      staleTime: 1000 * 60 * 5,
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
        {allProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.name}
            price={product.basePrice}
            imageUrl={product.images?.[0]?.url || "/placeholder.png"}
          />
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
