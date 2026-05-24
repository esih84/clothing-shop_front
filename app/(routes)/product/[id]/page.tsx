import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/actions";
import { ProductDetails } from "@/components/product-details";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const [product, allProducts] = await Promise.all([
    getProduct(id),
    getProducts(),
  ]);

  if (!product) {
    notFound();
  }

  const related = allProducts
    .filter((p) => p.id !== id && p.category === product.category)
    .slice(0, 4);

  return <ProductDetails product={product} relatedProducts={related} />;
}
//   <div className="max-w-6xl mx-auto px-4 py-6">
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//       {/* Product Images */}
//       <div className="space-y-4">
//         <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
//           <ImageSlider alt="" images={product.images} />

//           {/* Discount Badge */}
//           {product.discount && (
//             <div className="absolute top-4 left-4 z-10">
//               <Badge className="bg-red-500 text-white">
//                 -{product.discount}% OFF
//               </Badge>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
//             <Button
//               size="icon"
//               variant="secondary"
//               className="rounded-full"
//             >
//               <Heart className="w-4 h-4" />
//             </Button>
//             <Button
//               size="icon"
//               variant="secondary"
//               className="rounded-full"
//             >
//               <Share2 className="w-4 h-4" />
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Product Info */}
//       <div className="space-y-6">
//         {/* Brand & Title */}
//         <div>
//           <div className="flex items-center gap-2 mb-2">
//             <Badge variant="outline">{product.brand.name}</Badge>
//             <span className="text-sm text-gray-500">
//               {product.brand.handle}
//             </span>
//           </div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
//             {product.title}
//           </h1>

//           {/* Rating & Reviews */}
//           <div className="flex items-center gap-2 mb-4">
//             <div className="flex items-center gap-1">
//               <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//               <span className="font-medium">{product.rating}</span>
//             </div>
//             <span className="text-gray-500">•</span>
//             <span className="text-sm text-gray-600">
//               {product.reviews.toLocaleString()} reviews
//             </span>
//           </div>
//         </div>

//         {/* Price */}
//         <div className="flex items-center gap-3">
//           <span className="text-3xl font-bold text-gray-900">
//             ${product.price.toFixed(2)}
//           </span>
//           {product.originalPrice && (
//             <span className="text-xl text-gray-500 line-through">
//               ${product.originalPrice.toFixed(2)}
//             </span>
//           )}
//         </div>

//         {/* Description */}
//         <div>
//           <h3 className="font-semibold mb-2">Description</h3>
//           <p className="text-gray-600 leading-relaxed">
//             {product.description}
//           </p>
//         </div>

//         {/* Store Info */}
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center gap-3">
//               <Image
//                 src={product.store.logo || "/placeholder.svg"}
//                 alt={product.store.name}
//                 width={40}
//                 height={40}
//                 className="rounded-full"
//               />
//               <div className="flex-1">
//                 <h4 className="font-medium">{product.store.name}</h4>
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
//                   <span>{product.store.rating}</span>
//                   <span>•</span>
//                   <span>
//                     {product.store.followers.toLocaleString()} followers
//                   </span>
//                 </div>
//               </div>
//               <Link href={`/store/${product.store.id}`}>
//                 <Button variant="outline" size="sm">
//                   <Store className="w-4 h-4 mr-2" />
//                   Visit Store
//                 </Button>
//               </Link>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Product Actions */}
//         <ProductActions product={product} />

//         {/* Features */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//             <Truck className="w-5 h-5 text-blue-500" />
//             <div>
//               <p className="font-medium text-sm">Free Shipping</p>
//               <p className="text-xs text-gray-600">On orders over $50</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//             <Shield className="w-5 h-5 text-green-500" />
//             <div>
//               <p className="font-medium text-sm">Secure Payment</p>
//               <p className="text-xs text-gray-600">100% protected</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//             <MapPin className="w-5 h-5 text-purple-500" />
//             <div>
//               <p className="font-medium text-sm">Easy Returns</p>
//               <p className="text-xs text-gray-600">30-day policy</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* Additional Info Tabs */}
//     {/* <div className="mt-12">
//       <div className="border-b">
//         <div className="flex space-x-8">
//           <button className="py-4 px-1 border-b-2 border-black font-medium text-sm">
//             Details
//           </button>
//           <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">
//             Reviews ({product.reviews})
//           </button>
//           <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">
//             Shipping
//           </button>
//         </div>
//       </div>

//       <div className="py-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <div>
//             <h3 className="font-semibold mb-4">Product Details</h3>
//             <div className="space-y-3">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Category</span>
//                 <span className="font-medium">{product.category}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Brand</span>
//                 <span className="font-medium">{product.brand.name}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Availability</span>
//                 <span
//                   className={`font-medium ${
//                     product.inStock ? "text-green-600" : "text-red-600"
//                   }`}
//                 >
//                   {product.inStock ? "In Stock" : "Out of Stock"}
//                 </span>
//               </div>
//               {product.sizes.length > 0 && (
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Available Sizes</span>
//                   <span className="font-medium">
//                     {product.sizes.join(", ")}
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div>
//             <h3 className="font-semibold mb-4">Care Instructions</h3>
//             <ul className="space-y-2 text-gray-600">
//               <li>• Machine wash cold with like colors</li>
//               <li>• Do not bleach</li>
//               <li>• Tumble dry low</li>
//               <li>• Iron on low heat if needed</li>
//               <li>• Do not dry clean</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div> */}
//   </div>
// </div>
// "use client";

// import { useState, useEffect } from "react";
// import { getProduct } from "@/lib/actions";
// import { ProductDetails } from "@/components/product-ndetails";
// import { CommentSection, type Comment } from "@/components/comment-section";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card } from "@/components/ui/card";
// import type { Product } from "@/lib/actions";

// // Mock comments data
// const productComments: Comment[] = [
//   {
//     id: "1",
//     user: {
//       name: "Sarah Johnson",
//       avatar: "/placeholder.svg?height=32&width=32&text=SJ",
//     },
//     date: "May 2, 2025",
//     content:
//       "This product is amazing! The quality is excellent and it fits perfectly. I've received many compliments wearing it.",
//     rating: 5,
//     likes: 12,
//     isLiked: false,
//   },
//   {
//     id: "2",
//     user: {
//       name: "Michael Brown",
//     },
//     date: "Apr 28, 2025",
//     content:
//       "Good quality but the sizing runs a bit small. I would recommend ordering one size up.",
//     rating: 4,
//     likes: 5,
//     isLiked: true,
//   },
//   {
//     id: "3",
//     user: {
//       name: "Emily Davis",
//       avatar: "/placeholder.svg?height=32&width=32&text=ED",
//     },
//     date: "Apr 15, 2025",
//     content:
//       "The color is slightly different from what's shown in the pictures, but overall I'm satisfied with the purchase.",
//     rating: 3,
//     likes: 2,
//     isLiked: false,
//     replies: [
//       {
//         id: "3-1",
//         user: {
//           name: "Store Support",
//           avatar: "/placeholder.svg?height=24&width=24&text=SS",
//         },
//         date: "Apr 16, 2025",
//         content:
//           "We're sorry to hear about the color difference. Please contact our customer service for assistance.",
//         likes: 1,
//         isLiked: false,
//       },
//     ],
//   },
// ];

// export default function ProductPage({ params }: { params: { id: string } }) {
//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);

//   useEffect(() => {
//     async function fetchProduct() {
//       try {
//         setLoading(true);
//         setError(false);
//         const productData = await getProduct(params.id);

//         if (!productData) {
//           setError(true);
//           return;
//         }

//         setProduct(productData);
//       } catch (err) {
//         console.error("Error fetching product:", err);
//         setError(true);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProduct();
//   }, [params.id]);

//   if (loading) {
//     return (
//       <div className="pb-24 max-w-6xl mx-auto">
//         <div className="pt-16 px-4">
//           <div className="max-w-2xl mx-auto">
//             {/* Loading skeleton */}
//             <div className="mb-6">
//               <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
//             </div>
//             <div className="space-y-4">
//               <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
//               <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
//               <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !product) {
//     return (
//       <div className="pb-24 max-w-6xl mx-auto">
//         <div className="pt-16 px-4">
//           <div className="max-w-2xl mx-auto text-center">
//             <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
//             <p className="text-gray-600 mb-4">
//               The product you're looking for doesn't exist or has been removed.
//             </p>
//             <button
//               onClick={() => window.history.back()}
//               className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
//             >
//               Go Back
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="pb-24 max-w-6xl mx-auto">
//       <ProductDetails product={product} />

//       {/* Tabbed section */}
//       <div className="mt-8 px-4 max-w-2xl mx-auto">
//         <Card className="border-0 shadow-none">
//           <Tabs defaultValue="description" className="w-full">
//             <TabsList className="w-full grid grid-cols-3 mb-6">
//               <TabsTrigger value="description" className="text-base">
//                 Product Details
//               </TabsTrigger>
//               <TabsTrigger value="specifications" className="text-base">
//                 Specifications
//               </TabsTrigger>
//               <TabsTrigger value="reviews" className="text-base">
//                 Reviews
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="description" className="pt-4">
//               <h2 className="text-2xl font-semibold mb-4 font-playfair">
//                 Product Description
//               </h2>
//               <p className="text-gray-700 leading-relaxed">
//                 {product.description}
//               </p>

//               <h3 className="text-xl font-semibold mt-6 mb-3 font-playfair">
//                 Features:
//               </h3>
//               <ul className="list-disc pl-5 space-y-2 text-gray-700">
//                 <li>Premium quality materials</li>
//                 <li>Elegant design suitable for all occasions</li>
//                 <li>Comfortable fit with attention to detail</li>
//                 <li>Easy to care for and maintain</li>
//               </ul>
//             </TabsContent>

//             <TabsContent value="specifications" className="pt-4">
//               <h2 className="text-2xl font-semibold mb-4 font-playfair">
//                 Product Specifications
//               </h2>
//               <div className="space-y-4">
//                 <div className="grid grid-cols-2 gap-2 py-2 border-b">
//                   <span className="font-medium text-gray-700">Brand</span>
//                   <span>{product.brand.name}</span>
//                 </div>
//                 <div className="grid grid-cols-2 gap-2 py-2 border-b">
//                   <span className="font-medium text-gray-700">Material</span>
//                   <span>Premium Cotton</span>
//                 </div>
//                 <div className="grid grid-cols-2 gap-2 py-2 border-b">
//                   <span className="font-medium text-gray-700">
//                     Available Colors
//                   </span>
//                   <span>
//                     {product.colors?.join(", ") || "Black, Blue, White"}
//                   </span>
//                 </div>
//                 <div className="grid grid-cols-2 gap-2 py-2 border-b">
//                   <span className="font-medium text-gray-700">
//                     Available Sizes
//                   </span>
//                   <span>{product.sizes?.join(", ") || "S, M, L, XL"}</span>
//                 </div>
//                 <div className="grid grid-cols-2 gap-2 py-2 border-b">
//                   <span className="font-medium text-gray-700">
//                     Care Instructions
//                   </span>
//                   <span>Machine washable</span>
//                 </div>
//               </div>
//             </TabsContent>

//             <TabsContent value="reviews" className="pt-4">
//               <CommentSection
//                 comments={productComments}
//                 onAddComment={(content, rating) => {
//                   console.log("New comment:", content, "Rating:", rating);
//                   // In a real app, this would call an API to add the comment
//                 }}
//                 allowRating={true}
//                 title="Customer Reviews"
//               />
//             </TabsContent>
//           </Tabs>
//         </Card>
//       </div>
//     </div>
//   );
// }
