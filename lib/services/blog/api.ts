import api from "@/lib/api/api";
import type { Blog } from "@/types/blog";
import type { ApiResponse, ApiListResponse } from "@/types/api";

export type BlogListResponse = ApiListResponse<Blog, "blogs">;

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
    const res = await api.get<ApiResponse<Blog>>(`/blogs/${slug}`, { adapter: "fetch", fetchOptions: { cache: "no-store" } });
    return res.data.data;
  },
};
