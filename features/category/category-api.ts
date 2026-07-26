import api from "@/shared/api/client";
import { serverFetch } from "@/shared/api/server-fetch";
import type { Category } from "@/types/category";
import type { ApiResponse } from "@/types/api";

/* Server-side reads (native fetch + revalidate) — for SEO and speed */
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

/** Featured categories (flat list, any level) for the home page categories section. */
export async function getFeaturedCategories() {
  try {
    const data = await serverFetch<Category[]>("/categories/featured", {
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

/* Client-side service (axios) */
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
