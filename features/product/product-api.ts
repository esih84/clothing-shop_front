import api from "@/shared/api/client";
import { serverFetch } from "@/shared/api/server-fetch";
import type { Product } from "@/types/product";
import type { ApiResponse, ApiListResponse } from "@/types/api";

export type ProductFilters = {
  categoryId?: string;
  categorySlug?: string;
  categoryIds?: string[];
  categorySlugs?: string[];
  brandId?: string;
  brandSlug?: string;
  brandIds?: string[];
  brandSlugs?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  inStock?: boolean;
  stockStatus?: "in_stock" | "out_of_stock" | "low_stock";
  hasDiscount?: boolean;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
};

export type ProductListResponse = ApiListResponse<Product, "data">;

function buildQuery(filters: ProductFilters): string {
  return new URLSearchParams(
    Object.entries(filters).reduce(
      (acc, [key, value]) => {
        if (value === undefined || value === null || value === "") return acc;
        // Arrays as CSV; an empty array is ignored.
        if (Array.isArray(value)) {
          if (value.length) acc[key] = value.join(",");
          return acc;
        }
        acc[key] = String(value);
        return acc;
      },
      {} as Record<string, string>,
    ),
  ).toString();
}

/* ----------------------------------------------------------------
 * Server-side reads (native fetch + revalidate) — for SEO and speed.
 * Used in Server Components and cacheable.
 * ---------------------------------------------------------------- */
export async function getProducts(filters: ProductFilters) {
  try {
    const data = await serverFetch<ProductListResponse>(
      `/products?${buildQuery(filters)}`,
      { revalidate: 60, tags: ["products"] },
    );
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Products with an active discount (the "special offers" section).
 * Whether a discount is active is determined entirely on the backend; here we just fetch the list.
 */
export async function getDiscountedProducts(
  filters: ProductFilters = {},
) {
  try {
    const data = await serverFetch<ProductListResponse>(
      `/products/discounted?${buildQuery(filters)}`,
      { revalidate: 60, tags: ["products", "offers"] },
    );
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const data = await serverFetch<Product>(`/products/${slug}`, {
      revalidate: 120,
      tags: [`product:${slug}`],
    });

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/* ----------------------------------------------------------------
 * Client-side service (axios) — for infinite-scroll and client-side calls.
 * ---------------------------------------------------------------- */
export const productService = {
  findAll: async (filters: ProductFilters) => {
    const res = await api.get<ApiResponse<ProductListResponse>>(
      `/products?${buildQuery(filters)}`,
      { adapter: "fetch", fetchOptions: { cache: "no-store" } },
    );
    return res.data.data;
  },
  findBySlug: async (slug: string) => {
    const res = await api.get<ApiResponse<Product>>(`/products/${slug}`, {
      adapter: "fetch",
      fetchOptions: { cache: "no-store" },
    });
    return res.data.data;
  },
};
