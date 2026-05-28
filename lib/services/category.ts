import { api } from "@/lib/api/api";
import { Category } from "@/types/category";

export const categoryService = {
  // دریافت ساختار درختی دسته‌بندی‌ها
  findAll: () =>
    api<Category[]>("/categories", {
      next: { revalidate: 86400 }, // دسته‌بندی‌ها روزی یکبار آپدیت شوند
    }),

  findBySlug: (slug: string) => api<Category>(`/categories/${slug}`),
};
