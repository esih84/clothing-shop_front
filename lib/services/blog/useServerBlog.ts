import { blogService } from "./api";

export async function getBlogs(page = 1, limit = 20) {
  try {
    const blogs = await blogService.findAll(page, limit);
    return { data: blogs, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const blog = await blogService.findBySlug(slug);
    return { data: blog, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
