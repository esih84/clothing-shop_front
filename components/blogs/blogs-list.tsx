import { BlogCard } from "./blog-card";
import type { Blog } from "@/lib/actions";

export function BlogsList({ blogs }: { blogs: Blog[] }) {
  if (!blogs.length) {
    return <div className="text-gray-500 text-center py-12">هیچ بلاگی وجود ندارد.</div>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}
