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

export type ProductListResponse = ApiListResponse<Product, "data"> & {
  /**
   * Set by the backend when nothing matched the query exactly and these are the results of a
   * widened search. The list is still worth showing — it just must not be labelled as exact.
   */
  searchRelaxed?: boolean;
};

/** A category or brand whose own name matched the query — offered as a shortcut in autocomplete. */
export type SuggestTaxonomy = { id: string; name: string; slug: string };

export type ProductSuggestResponse = {
  products: Product[];
  categories: SuggestTaxonomy[];
  brands: SuggestTaxonomy[];
  searchRelaxed: boolean;
};

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

/**
 * The admin-curated "buy together" list for one product, already in the admin's order.
 * Empty for most products — that is the normal case, not an error.
 */
export async function getRelatedProducts(productId: string, limit = 12) {
  try {
    const data = await serverFetch<Product[]>(
      `/products/${productId}/related?limit=${limit}`,
      { revalidate: 60, tags: ["products", `product:related:${productId}`] },
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
  /**
   * Header autocomplete. Fires on every (debounced) keystroke, so unlike the calls above it is
   * left cacheable — the same prefix typed twice must not cost a second round-trip.
   */
  suggest: async (query: string, limit = 6, signal?: AbortSignal) => {
    const res = await api.get<ApiResponse<ProductSuggestResponse>>(
      `/products/suggest?q=${encodeURIComponent(query)}&limit=${limit}`,
      { signal },
    );
    return res.data.data;
  },
};
