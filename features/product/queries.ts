"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { productService } from "./product-api";
import { queryKeys } from "@/features/query-keys";
import type { Product } from "@/types/product";

export type ProductsPage = {
  products: Product[];
  hasMore: boolean;
};

/** فهرست محصولات با اسکرول بی‌نهایت (سمت کلاینت). */
export function useInfiniteProducts(initial: ProductsPage) {
  return useInfiniteQuery({
    queryKey: queryKeys.products,
    queryFn: async ({ pageParam }) => {
      const { data, total, limit } = await productService.findAll({
        page: pageParam as number,
        limit: 12,
      });
      return {
        products: data,
        hasMore: (pageParam as number) * limit < total,
      } satisfies ProductsPage;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
    initialData: { pages: [initial], pageParams: [1] },
    staleTime: 1000 * 60 * 5,
  });
}
