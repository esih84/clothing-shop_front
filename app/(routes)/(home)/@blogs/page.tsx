// components/sections/blogs-home-section.tsx
import Link from "next/link";
import { useGetBlogs } from "@/lib/services/blog/useServerBlog";
import { BlogCard } from "@/components/blogs/blog-card";

export default async function BlogsHomeSection() {
  const { data } = await useGetBlogs(1, 4);
  const blogs = data?.blogs ?? [];

  if (!blogs.length) return null;

  return (
    <section className="px-4 py-6 mx-auto">
      <div className="flex items-center justify-between mb-4 ">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-[#670626]" />
          <h2 className="text-base font-bold tracking-wide">آخرین مقالات</h2>
        </div>
        <Link
          href="/blogs"
          className="text-xs text-[#670626] border-b border-[#670626]/40 pb-0.5 hover:border-[#670626] transition-colors"
        >
          مشاهده همه
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </section>
  );
}
