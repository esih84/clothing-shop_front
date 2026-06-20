import { getBlogBySlug } from "@/features/blog/blog-api";
import { BlogDetail } from "@/shared/components/blogs/blog-detail";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "جزئیات بلاگ",
};

// پارامتر مسیر در واقع slug بلاگ است (BlogCard به /blogs/[slug] لینک می‌دهد)
export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  const { data: blog } = await getBlogBySlug(slug);
  return <BlogDetail blog={blog ?? undefined} />;
}

