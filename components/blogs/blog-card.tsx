import Link from "next/link";
import type { Blog } from "@/lib/actions";

export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link
      href={`/blogs/${blog.id}`}
      className="bg-white rounded-lg shadow p-4 hover:shadow-md  w-full max-w-md transition flex flex-col h-full"
    >
      <img
        src={blog.imageUrl}
        alt={blog.title}
        className="w-full h-40 object-cover rounded mb-3"
        loading="lazy"
      />
      <h2 className="font-bold text-lg mb-2 text-[#670626]">{blog.title}</h2>
      <p className="text-gray-600 line-clamp-3 mb-2">{blog.excerpt}</p>
      <div className="flex items-center justify-between text-xs text-gray-400 mt-auto">
        <span>{blog.date}</span>
        <span>🕒 {blog.readTime} دقیقه</span>
        <span>💬 {blog.comments}</span>
      </div>
    </Link>
  );
}
