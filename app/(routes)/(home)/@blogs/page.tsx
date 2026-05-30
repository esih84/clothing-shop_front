import Link from "next/link";
import { blogService } from "@/lib/services/blog";
import { BlogCard } from "@/components/blogs/blog-card";

export default async function BlogsHomeSection() {
  const { blogs } = await blogService.findAll(1, 4);

  if (!blogs || blogs.length === 0) return null;

  return (
    <section className="px-4 py-6 mx-auto">
      <div className="flex items-center justify-between mb-4 ">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-[#670626]" />
          <h2 className="text-base font-bold tracking-wide">
            دسته‌بندی محصولات
          </h2>
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
