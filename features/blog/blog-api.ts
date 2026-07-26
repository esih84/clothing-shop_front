import api from "@/shared/api/client";
import { serverFetch } from "@/shared/api/server-fetch";
import type { Blog } from "@/types/blog";
import type { ApiResponse, ApiListResponse } from "@/types/api";

export type BlogListResponse = ApiListResponse<Blog, "data">;

/* Server-side reads (native fetch + revalidate) — for SEO and speed */
export async function getBlogs(page = 1, limit = 20) {
  try {
    const data = await serverFetch<BlogListResponse>(
      `/blogs?page=${page}&limit=${limit}`,
      { revalidate: 300, tags: ["blogs"] },
    );
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const data = await serverFetch<Blog>(`/blogs/${slug}`, {
      revalidate: 300,
      tags: [`blog:${slug}`],
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/* Client-side service (axios) */
export const blogService = {
  findAll: async (page = 1, limit = 20) => {
    const res = await api.get<ApiResponse<BlogListResponse>>("/blogs", {
      params: { page, limit },
      adapter: "fetch",
      fetchOptions: { cache: "no-store" },
    });
    return res.data.data;
  },
  findBySlug: async (slug: string) => {
    const res = await api.get<ApiResponse<Blog>>(`/blogs/${slug}`, {
      adapter: "fetch",
      fetchOptions: { cache: "no-store" },
    });
    return res.data.data;
  },
};
