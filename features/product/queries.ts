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
 * فهرست محصولات با اسکرول بی‌نهایت (سمت کلاینت).
 * با filters و limit پارامتری شده تا هم صفحه‌ی خانه (۱۰تایی، سقف‌دار)
 * و هم صفحه‌ی `/products` (۱۰تایی، فیلتردار) از همین استفاده کنند.
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
    // کلید شامل فیلترها + limit است تا کش هر ترکیب فیلتر جدا بماند.
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
