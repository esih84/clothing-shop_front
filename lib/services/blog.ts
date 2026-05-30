import api from "@/lib/api/api";
import type { Blog } from "@/types/blog";
import type { ApiResponse, ApiListResponse } from "@/types/api";

// تعریف تایپ اختصاصی برای لیست بلاگ‌ها
export type BlogListResponse = ApiListResponse<Blog, "blogs">;

export const blogService = {
  /** دریافت لیست بلاگ‌ها */
  findAll: async (page = 1, limit = 20): Promise<BlogListResponse> => {
    const res = await api.get<ApiResponse<BlogListResponse>>("/blogs", {
      params: { page, limit },
    });

    // خروجی res.data.data همان { blogs, total, page, limit } است
    return res.data.data;
  },

  /** دریافت یک بلاگ با اسلاگ */
  findBySlug: async (slug: string): Promise<Blog> => {
    const res = await api.get<ApiResponse<Blog>>(`/blogs/${slug}`);
    return res.data.data;
  },
};
