import Link from "next/link";
import type { Blog } from "@/lib/actions";

export function BlogDetail({ blog }: { blog?: Blog }) {
  if (!blog) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-lg text-gray-500">
        بلاگ مورد نظر پیدا نشد.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="text-[#670626] hover:underline">خانه</Link>
        <span>/</span>
        <Link href="/blog" className="text-[#670626] hover:underline">بلاگ</Link>
        <span>/</span>
        <span className="font-bold text-[#670626]">{blog.title}</span>
      </div>
      <img src={blog.imageUrl} alt={blog.title} className="w-full h-56 object-cover rounded mb-6" />
      <h1 className="text-2xl font-bold mb-2 text-[#670626]">{blog.title}</h1>
      <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
        <span>{blog.date}</span>
        <span>🕒 {blog.readTime} دقیقه</span>
        <span>💬 {blog.comments}</span>
        <span>دسته‌بندی: {blog.category}</span>
      </div>
      <p className="text-gray-700 leading-7 mb-8">{blog.excerpt}</p>
      {/* برای محتوای کامل بلاگ، فیلد جدیدی اضافه کنید */}
    </div>
  );
}
