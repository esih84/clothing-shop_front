import { api } from "@/lib/api/api";
import { Blog } from "@/types/blog";
import { ApiListResponse } from "@/types/api";

export const blogService = {
  findAll: (page = 1, limit = 20) =>
    api<ApiListResponse<Blog>>(`/blogs?page=${page}&limit=${limit}`, {
      next: { revalidate: 3600 }, // بلاگ‌ها ساعتی یکبار آپدیت شوند کافیست
    }),

  findBySlug: (slug: string) =>
    api<Blog>(`/blogs/${slug}`, { next: { revalidate: 60 } }),
};
