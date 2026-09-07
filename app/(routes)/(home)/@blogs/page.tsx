// components/sections/blogs-home-section.tsx
import Link from "next/link";
import { getBlogs } from "@/features/blog/blog-api";
import { BlogCard } from "@/shared/components/blogs/blog-card";
import { getSiteSettings } from "@/features/settings/settings-api";

export default async function BlogsHomeSection() {
  const { home } = await getSiteSettings();
  const { data } = await getBlogs(1, 4);
  const blogs = data?.data ?? [];

  if (!blogs.length) return null;

  return (
    <section className="px-4 py-6 mx-auto">
      <div className="flex items-center justify-between mb-4 ">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-secondary" />
          <h2 className="text-base font-bold tracking-wide">{home.blogsTitle}</h2>
        </div>
        <Link
          href="/blogs"
          className="text-xs text-secondary border-b border-secondary/40 pb-0.5 hover:border-secondary transition-colors"
        >
          {home.viewAllLabel}
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
