import { getBlogs, getStore, getStoreProducts } from "@/lib/actions";
import {
  Star,
  MapPin,
  Calendar,
  Package,
  Users,
  BookOpen,
  ChevronRight,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function StorePage({
  params,
}: {
  params: { id: string };
}) {
  const store = await getStore(params.id);
  const blogs = await getBlogs();
  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Store Not Found</h1>
          <p className="text-gray-600 mb-4">
            The store you're looking for doesn't exist.
          </p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const products = await getStoreProducts(params.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Header */}
      <div className="relative">
        <div className="h-48 md:h-64 bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden">
          <Image
            src={store.coverImage || "/placeholder.svg"}
            alt={`${store.name} cover`}
            width={800}
            height={300}
            className="w-full h-full object-cover opacity-80"
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end gap-4">
              <div className="relative">
                <Image
                  src={store.logo || "/placeholder.svg"}
                  alt={`${store.name} logo`}
                  width={80}
                  height={80}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white bg-white"
                />
              </div>
              <div className="text-white pb-2">
                <h1 className="text-2xl md:text-3xl font-bold">{store.name}</h1>
                <p className="text-white/90 text-sm md:text-base">
                  {store.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store Info */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="blogs">Blogs</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      title={product.title}
                      price={product.price}
                      imageUrl={product.images[0]}
                      rating={product.rating}
                      reviews={product.reviews}
                    />
                  ))}
                </div>
                {products.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No products yet
                    </h3>
                    <p className="text-gray-500">
                      This store hasn't added any products yet.
                    </p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="blogs" className="mt-6">
                <div className="space-y-6">
                  {blogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {blogs.map((blog) => (
                        <Card
                          key={blog.id}
                          className="group cursor-pointer hover:shadow-lg transition-shadow"
                        >
                          <CardContent className="p-0">
                            <div className="relative aspect-video">
                              <Image
                                src={blog.imageUrl || "/placeholder.svg"}
                                alt={blog.title}
                                fill
                                className="object-cover rounded-t-lg"
                              />
                              <Badge className="absolute top-3 left-3 bg-white/90 text-gray-700">
                                {blog.category}
                              </Badge>
                            </div>
                            <div className="p-6">
                              <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                <Link
                                  href={`/shop/${store.id}/blog/${blog.id}`}
                                >
                                  {blog.title}
                                </Link>
                              </h3>
                              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                {blog.excerpt}
                              </p>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>
                                      {new Date(blog.date).toLocaleDateString(
                                        "en-US",
                                        {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        }
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{blog.readTime}</span>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  Read More
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No blog posts yet
                      </h3>
                      <p className="text-gray-600">
                        This store hasn't published any blog posts yet.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      About {store.name}
                    </h3>
                    <p className="text-gray-600 mb-6">{store.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Address</p>
                          <p className="text-sm text-gray-600">
                            {store.address}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Established</p>
                          <p className="text-sm text-gray-600">
                            {store.established}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Categories</h4>
                      <div className="flex flex-wrap gap-2">
                        {store.categories.map((category) => (
                          <Badge key={category}>{category}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-12">
                      <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No reviews yet
                      </h3>
                      <p className="text-gray-500">
                        Be the first to review this store!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Store Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Store Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm">Rating</span>
                    </div>
                    <span className="font-medium">{store.rating}/5</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">Followers</span>
                    </div>
                    <span className="font-medium">
                      {store.followers.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Products</span>
                    </div>
                    <span className="font-medium">{store.products}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <span className="text-sm">Blog Posts</span>
                    </div>
                    <span className="font-medium">{blogs.length}</span>
                  </div>
                </div>

                <Button className="w-full mt-4">Follow Store</Button>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Contact</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    View Location
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <ChevronRight className="w-4 h-4 mr-2" />
                    Visit Website
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
