import api from "@/shared/api/client";
import { serverFetch } from "@/shared/api/server-fetch";
import type { Category } from "@/types/category";
import type { ApiResponse } from "@/types/api";

/* خواندن‌های سمت سرور (native fetch + revalidate) — برای SEO و سرعت */
export async function getCategories() {
  try {
    const data = await serverFetch<Category[]>("/categories", {
      revalidate: 300,
      tags: ["categories"],
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const data = await serverFetch<Category>(`/categories/${slug}`, {
      revalidate: 300,
      tags: [`category:${slug}`],
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/* سرویس سمت کلاینت (axios) */
export const categoryService = {
  findAll: async () => {
    const res = await api.get<ApiResponse<Category[]>>("/categories", {
      adapter: "fetch",
      fetchOptions: { cache: "no-store" },
    });
    return res.data.data;
  },
  findBySlug: async (slug: string) => {
    const res = await api.get<ApiResponse<Category>>(`/categories/${slug}`, {
      adapter: "fetch",
      fetchOptions: { cache: "no-store" },
    });
    return res.data.data;
  },
};
