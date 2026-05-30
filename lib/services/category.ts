// lib/services/category.ts
import api from "@/lib/api/api";
import type { Category } from "@/types/category";
import type { ApiResponse } from "@/types/api";

export const categoryService = {
  findAll: async (): Promise<Category[]> => {
    const res = await api.get<ApiResponse<Category[]>>("/categories");
    return res.data.data;
  },

  findBySlug: async (slug: string): Promise<Category> => {
    const res = await api.get<ApiResponse<Category>>(`/categories/${slug}`);
    return res.data.data;
  },
};
