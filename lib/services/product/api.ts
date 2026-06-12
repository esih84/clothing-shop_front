import api from "@/lib/api/client";
import type { Product, ProductVariant } from "@/types/product";
import type { ApiResponse, ApiListResponse } from "@/types/api";

export type ProductFilters = {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
};

export const productService = {
  findAll: async (filters: ProductFilters) => {
    const query = new URLSearchParams(
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
    const res = await api.get<ApiResponse<ApiListResponse<Product, "data">>>(
      `/products?${query}`,
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
  getVariants: async (id: string) => {
    const res = await api.get<ApiResponse<ProductVariant[]>>(
      `/products/${id}/variants`,
      { adapter: "fetch", fetchOptions: { cache: "no-store" } },
    );
    return res.data.data;
  },
};
