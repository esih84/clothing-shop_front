import { getBlogs, getStore, getStoreProducts } from "@/lib/actions";
import {
  Star,
  MapPin,
  Calendar,
  Package,
  Users,
  BookOpen,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export default async function StorePage({
  params,
}: {
  params: { id: string };
}) {
  const [store, blogs, products] = await Promise.all([
    getStore(params.id),
    getBlogs(),
    getStoreProducts(params.id),
  ]);

  if (!store) notFound();

  return (
    <div className="min-h-screen bg-[#fff5f7]">
      {/* ── Cover Banner ── */}
      <div className="relative h-52 md:h-72 overflow-hidden">
        <Image
          src={store.coverImage || "/placeholder.svg"}
          alt={`${store.name} cover`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#670626]/10 via-transparent to-[#670626]/75" />

        {/* Store identity */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-5 flex items-end gap-4">
          <div className="shrink-0">
            <Image
              src={store.logo || "/placeholder.svg"}
              alt={store.name}
              width={72}
              height={72}
              className="w-16 h-16 md:w-20 md:h-20 object-cover border-2 border-white"
            />
          </div>
          <div className="flex-1 min-w-0 pb-0.5">
            <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">
              {store.name}
            </h1>
            <p className="text-white/75 text-sm line-clamp-1 mt-0.5">
              {store.description}
            </p>
          </div>
          <Button
            size="sm"
            className="shrink-0 bg-white text-[#670626] hover:bg-[#ffbdc5] border-0 font-semibold text-xs px-4 rounded-none"
          >
            Follow
          </Button>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="bg-white border-b border-[#E3A7C4]/40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-stretch divide-x divide-[#E3A7C4]/30">
            <div className="flex-1 py-3 text-center">
              <p className="text-base font-bold text-[#670626]">
                {store.rating}
                <span className="text-xs font-normal text-gray-400">/5</span>
              </p>
              <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1 mt-0.5">
                <Star className="w-3 h-3 fill-[#E3A7C4] text-[#E3A7C4]" />
                Rating
              </p>
            </div>
            <div className="flex-1 py-3 text-center">
              <p className="text-base font-bold text-[#670626]">
                {store.followers.toLocaleString()}
              </p>
              <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1 mt-0.5">
                <Users className="w-3 h-3 text-[#E3A7C4]" />
                Followers
              </p>
            </div>
            <div className="flex-1 py-3 text-center">
              <p className="text-base font-bold text-[#670626]">
                {store.products}
              </p>
              <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1 mt-0.5">
                <Package className="w-3 h-3 text-[#E3A7C4]" />
                Products
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs Content ── */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b border-[#E3A7C4]/40 rounded-none h-auto p-0 gap-0 mb-6">
            {(["products", "blogs", "about"] as const).map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#670626] data-[state=active]:text-[#670626] data-[state=active]:bg-transparent capitalize px-5 py-2.5 font-medium text-gray-400 hover:text-[#670626] transition-colors"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Products tab */}
          <TabsContent value="products">
            {products.length === 0 ? (
              <div className="text-center py-20">
                <Package className="w-12 h-12 text-[#E3A7C4] mx-auto mb-4" />
                <h3 className="text-base font-semibold text-gray-700 mb-1">
                  No products yet
                </h3>
                <p className="text-sm text-gray-400">
                  This store hasn&apos;t added any products yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    discount={product.discount}
                    imageUrl={product.images[0]}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Blogs tab */}
          <TabsContent value="blogs">
            {blogs.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="w-12 h-12 text-[#E3A7C4] mx-auto mb-4" />
                <h3 className="text-base font-semibold text-gray-700 mb-1">
                  No blog posts yet
                </h3>
                <p className="text-sm text-gray-400">
                  This store hasn&apos;t published any posts yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/shop/${store.id}/blog/${blog.id}`}
                    className="group flex gap-4 bg-white border border-[#E3A7C4]/30 p-4 hover:border-[#E3A7C4] transition-colors"
                  >
                    <div className="relative w-24 h-24 shrink-0 overflow-hidden">
                      <Image
                        src={blog.imageUrl || "/placeholder.svg"}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="96px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge className="bg-[#ffbdc5] text-[#670626] text-[10px] rounded-none mb-2 hover:bg-[#ffbdc5] font-medium">
                        {blog.category}
                      </Badge>
                      <h3 className="font-semibold text-sm text-gray-900 group-hover:text-[#670626] transition-colors line-clamp-2 mb-2">
                        {blog.title}
                      </h3>
                      <div className="flex items-center gap-3 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(blog.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {blog.readTime} min read
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          {/* About tab */}
          <TabsContent value="about">
            <div className="bg-white border border-[#E3A7C4]/30 p-6 max-w-2xl">
              <h3 className="text-base font-semibold mb-3 text-[#670626]">
                About {store.name}
              </h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {store.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-[#fff5f7] border border-[#E3A7C4]/20">
                  <MapPin className="w-4 h-4 text-[#670626] shrink-0" />
                  <div>
                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                      Address
                    </p>
                    <p className="text-sm text-gray-800">{store.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#fff5f7] border border-[#E3A7C4]/20">
                  <Calendar className="w-4 h-4 text-[#670626] shrink-0" />
                  <div>
                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                      Established
                    </p>
                    <p className="text-sm text-gray-800">
                      {store.established}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-2">
                  Categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {store.categories.map((cat) => (
                    <span
                      key={cat}
                      className="px-3 py-1 text-xs bg-[#ffbdc5]/40 text-[#670626] border border-[#E3A7C4]/40"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
