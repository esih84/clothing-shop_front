

import { getBlogs } from "@/features/blog/blog-api";
import Link from "next/link";
import { BlogsList } from "@/shared/components/blogs/blogs-list";

export default async function BlogPage() {
  const { data } = await getBlogs();
  const blogs = data?.data ?? [];
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-2">
        <Link href="/" className="text-secondary hover:underline">خانه</Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-bold text-secondary">بلاگ</span>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-secondary">بلاگ</h1>
      <BlogsList blogs={blogs} />
    </div>
  );
}
