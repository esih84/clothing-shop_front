import {  getBlogs } from "@/lib/actions";
import { BlogDetail } from "@/components/blogs/blog-detail";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "جزئیات بلاگ | بانگکوسا",
};


  
export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blogs = await getBlogs();
  const blog = blogs.find((b) => b.id === id);
  return <BlogDetail blog={blog} />;
}

