"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { productService, type ProductFilters } from "./product-api";
import { queryKeys } from "@/features/query-keys";
import type { Product } from "@/types/product";

export type ProductsPage = {
  products: Product[];
  hasMore: boolean;
};

/**
 * Product list with infinite scroll (client-side).
 * Parameterized with filters and limit so both the home page (10 items, capped)
 * and the `/products` page (10 items, filtered) can use it.
 */
export function useInfiniteProducts({
  filters,
  limit = 10,
  initial,
}: {
  filters?: ProductFilters;
  limit?: number;
  initial: ProductsPage;
}) {
  return useInfiniteQuery({
    // The key includes the filters + limit so each filter combination is cached separately.
    queryKey: [...queryKeys.products, { ...filters, limit }],
    queryFn: async ({ pageParam }) => {
      const { data, total, limit: pageLimit } = await productService.findAll({
        ...filters,
        page: pageParam as number,
        limit,
      });
      return {
        products: data,
        hasMore: (pageParam as number) * pageLimit < total,
      } satisfies ProductsPage;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
    initialData: { pages: [initial], pageParams: [1] },
    staleTime: 1000 * 60 * 5,
  });
}
