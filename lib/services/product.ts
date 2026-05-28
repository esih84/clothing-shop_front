import { api } from "@/lib/api/api";
import { Product, ProductVariant } from "@/types/product";
import { ApiListResponse } from "@/types/api";

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
  // این تابع برای صفحه لیست محصولات عالی است (با قابلیت Revalidate)
  findAll: (filters: ProductFilters) => {
    const query = new URLSearchParams(filters as any).toString();
    return api<ApiListResponse<Product>>(`/products?${query}`, {
      next: { revalidate: 60 }, // داده‌ها هر ۶۰ ثانیه آپدیت شوند
    });
  },

  findBySlug: (slug: string) =>
    api<Product>(`/products/${slug}`, { cache: "no-store" }), // SSR کامل

  getVariants: (id: string) =>
    api<ProductVariant[]>(`/products/${id}/variants`),
};
