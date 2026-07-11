import api from "@/shared/api/client";
import { serverFetch } from "@/shared/api/server-fetch";
import type { Brand } from "@/types/brand";
import type { ApiResponse } from "@/types/api";

/* خواندن‌های سمت سرور (native fetch + revalidate) — برای SEO و سرعت */
export async function getBrands() {
  try {
    const data = await serverFetch<Brand[]>("/brands", {
      revalidate: 300,
      tags: ["brands"],
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getBrandBySlug(slug: string) {
  try {
    const data = await serverFetch<Brand>(`/brands/${slug}`, {
      revalidate: 300,
      tags: [`brand:${slug}`],
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/* سرویس سمت کلاینت (axios) */
export const brandService = {
  findAll: async () => {
    const res = await api.get<ApiResponse<Brand[]>>("/brands", {
      adapter: "fetch",
      fetchOptions: { cache: "no-store" },
    });
    return res.data.data;
  },
  findBySlug: async (slug: string) => {
    const res = await api.get<ApiResponse<Brand>>(`/brands/${slug}`, {
      adapter: "fetch",
      fetchOptions: { cache: "no-store" },
    });
    return res.data.data;
  },
};
