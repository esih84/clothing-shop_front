

import { getBlogs } from "@/lib/actions";
import Link from "next/link";
import { BlogsList } from "@/components/blogs/blogs-list";

export default async function BlogPage() {
  const blogs = await getBlogs();
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-2">
        <Link href="/" className="text-[#670626] hover:underline">خانه</Link>
        <span className="text-gray-400">/</span>
        <span className="font-bold text-[#670626]">بلاگ</span>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[#670626]">بلاگ</h1>
      <BlogsList blogs={blogs} />
    </div>
  );
}
