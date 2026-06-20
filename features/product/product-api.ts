import api from "@/shared/api/client";
import { serverFetch } from "@/shared/api/server-fetch";
import type { Product } from "@/types/product";
import type { ApiResponse, ApiListResponse } from "@/types/api";

export type ProductFilters = {
  categoryId?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  inStock?: boolean;
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
        if (value !== undefined && value !== null && value !== "") {
          acc[key] = String(value);
        }
        return acc;
      },
      {} as Record<string, string>,
    ),
  ).toString();
}

/* ----------------------------------------------------------------
 * خواندن‌های سمت سرور (native fetch + revalidate) — برای SEO و سرعت.
 * در Server Componentها استفاده می‌شوند و قابل کش‌اند.
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
 * سرویس سمت کلاینت (axios) — برای infinite-scroll و فراخوانی‌های کلاینت.
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
