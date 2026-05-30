import api from "@/lib/api/api";
import type { Category } from "@/types/category";
import type { ApiResponse } from "@/types/api";

export const categoryService = {
  findAll: async () => {
    const res = await api.get<ApiResponse<Category[]>>("/categories", { adapter: "fetch", fetchOptions: { cache: "no-store" } });
    return res.data.data;
  },
  findBySlug: async (slug: string) => {
    const res = await api.get<ApiResponse<Category>>(`/categories/${slug}`, { adapter: "fetch", fetchOptions: { cache: "no-store" } });
    return res.data.data;
  },
};
