import Link from "next/link";
import type { Blog } from "@/types/blog";

export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="bg-white rounded-lg shadow p-4 hover:shadow-md w-full max-w-md transition flex flex-col h-full"
    >
      <img
        src={blog.featuredImage || "/placeholder.jpg"}
        alt={blog.title}
        className="w-full h-40 object-cover rounded mb-3"
        loading="lazy"
      />

      <h2 className="font-bold text-lg mb-2 text-[#670626]">{blog.title}</h2>

      {blog.excerpt && (
        <p className="text-gray-600 line-clamp-3 mb-2">{blog.excerpt}</p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-400 mt-auto">
        <span>
          {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString(
            "fa-IR",
          )}
        </span>
      </div>
    </Link>
  );
}
