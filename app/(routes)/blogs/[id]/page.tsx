import { getBlogBySlug } from "@/features/blog/blog-api";
import { BlogDetail } from "@/shared/components/blogs/blog-detail";
import { JsonLd } from "@/shared/components/global/json-ld";
import { brand } from "@/shared/config/brand";
import type { Metadata } from "next";

// The route param is actually the blog slug (BlogCard links to /blogs/[slug])

/** Dynamic metadata for each article — title/description/OG/canonical are built from the blog itself */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: slug } = await params;
  const { data: blog } = await getBlogBySlug(slug);

  if (!blog) {
    return { title: "بلاگ پیدا نشد" };
  }

  const url = `${brand.url}/blogs/${blog.slug}`;
  const description = blog.excerpt ?? brand.description;

  return {
    title: blog.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "fa_IR",
      title: blog.title,
      description,
      url,
      images: blog.featuredImage ? [{ url: blog.featuredImage }] : undefined,
      publishedTime: blog.publishedAt ?? blog.createdAt,
      modifiedTime: blog.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description,
      images: blog.featuredImage ? [blog.featuredImage] : undefined,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  const { data: blog } = await getBlogBySlug(slug);

  const articleJsonLd = blog
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: blog.title,
        description: blog.excerpt ?? undefined,
        image: blog.featuredImage ?? undefined,
        inLanguage: "fa-IR",
        datePublished: blog.publishedAt ?? blog.createdAt,
        dateModified: blog.updatedAt,
        author: {
          "@type": "Organization",
          name: brand.name,
        },
        publisher: {
          "@type": "Organization",
          name: brand.name,
          url: brand.url,
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${brand.url}/blogs/${blog.slug}`,
        },
      }
    : null;

  return (
    <>
      {articleJsonLd && <JsonLd data={articleJsonLd} />}
      <BlogDetail blog={blog ?? undefined} />
    </>
  );
}
