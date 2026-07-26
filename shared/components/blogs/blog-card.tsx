import Link from "next/link";
import type { Blog } from "@/types/blog";

export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link
      prefetch
      href={`/blogs/${blog.slug}`}
      className="bg-card rounded-2xl shadow p-4 hover:shadow-md w-full max-w-md transition flex flex-col h-full"
    >
      <img
        src={blog.featuredImage || "/placeholder.jpg"}
        alt={blog.title}
        className="w-full h-40 object-cover rounded-xl mb-3"
        loading="lazy"
      />

      <h2 className="font-bold text-lg mb-2 text-secondary">{blog.title}</h2>

      {blog.excerpt && (
        <p className="text-muted-foreground line-clamp-3 mb-2">{blog.excerpt}</p>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
        <span>
          {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString(
            "fa-IR",
          )}
        </span>
      </div>
    </Link>
  );
}
