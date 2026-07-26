"use client";
import type { Blog } from "@/types/blog";
import { BlogComments } from "./blog-comments";

export function BlogDetail({ blog }: { blog?: Blog }) {
  if (!blog) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-lg text-muted-foreground">
        بلاگ مورد نظر پیدا نشد.
      </div>
    );
  }

  const dateLabel = new Date(
    blog.publishedAt || blog.createdAt
  ).toLocaleDateString("fa-IR");

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {blog.featuredImage && (
        <img
          src={blog.featuredImage}
          alt={blog.title}
          className="w-full h-56 object-cover rounded-2xl mb-6"
        />
      )}
      <h1 className="text-2xl font-bold mb-2 text-secondary">{blog.title}</h1>
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
        <span>{dateLabel}</span>
      </div>
      {blog.excerpt && (
        <p className="text-foreground leading-7 mb-6 font-medium">
          {blog.excerpt}
        </p>
      )}
      <article
        className="prose prose-sm max-w-none text-foreground leading-8 mb-8"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
      <BlogComments comments={[]} />
    </div>
  );
}
