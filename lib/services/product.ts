import api from "@/lib/api/api";
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
  // لیست محصولات
  findAll: async (
    filters: ProductFilters,
  ): Promise<ApiListResponse<Product, "data">> => {
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
    );

    return res.data.data;
  },

  // دریافت محصول با slug
  findBySlug: async (slug: string): Promise<Product> => {
    const res = await api.get<ApiResponse<Product>>(`/products/${slug}`);
    return res.data.data;
  },

  // دریافت variants
  getVariants: async (id: string): Promise<ProductVariant[]> => {
    const res = await api.get<ApiResponse<ProductVariant[]>>(
      `/products/${id}/variants`,
    );
    return res.data.data;
  },
};
