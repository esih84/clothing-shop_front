"use client"

import { getProduct } from "@/lib/actions"
import { ProductDetails } from "@/components/product-details"
import { CommentSection, type Comment } from "@/components/comment-section"
import { notFound } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

// Mock comments data
const productComments: Comment[] = [
  {
    id: "1",
    user: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32&text=SJ",
    },
    date: "May 2, 2025",
    content:
      "This product is amazing! The quality is excellent and it fits perfectly. I've received many compliments wearing it.",
    rating: 5,
    likes: 12,
    isLiked: false,
  },
  {
    id: "2",
    user: {
      name: "Michael Brown",
    },
    date: "Apr 28, 2025",
    content: "Good quality but the sizing runs a bit small. I would recommend ordering one size up.",
    rating: 4,
    likes: 5,
    isLiked: true,
  },
  {
    id: "3",
    user: {
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=32&width=32&text=ED",
    },
    date: "Apr 15, 2025",
    content:
      "The color is slightly different from what's shown in the pictures, but overall I'm satisfied with the purchase.",
    rating: 3,
    likes: 2,
    isLiked: false,
    replies: [
      {
        id: "3-1",
        user: {
          name: "Store Support",
          avatar: "/placeholder.svg?height=24&width=24&text=SS",
        },
        date: "Apr 16, 2025",
        content: "We're sorry to hear about the color difference. Please contact our customer service for assistance.",
        likes: 1,
        isLiked: false,
      },
    ],
  },
]

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="pb-24 max-w-6xl mx-auto">
      <ProductDetails product={product} />

      {/* Tabbed section */}
      <div className="mt-8 px-4 max-w-2xl mx-auto">
        <Card className="border-0 shadow-none">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="description" className="text-base">
                Product Details
              </TabsTrigger>
              <TabsTrigger value="specifications" className="text-base">
                Specifications
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-base">
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="pt-4">
              <h2 className="text-2xl font-semibold mb-4 font-playfair">Product Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>

              <h3 className="text-xl font-semibold mt-6 mb-3 font-playfair">Features:</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Premium quality materials</li>
                <li>Elegant design suitable for all occasions</li>
                <li>Comfortable fit with attention to detail</li>
                <li>Easy to care for and maintain</li>
              </ul>
            </TabsContent>

            <TabsContent value="specifications" className="pt-4">
              <h2 className="text-2xl font-semibold mb-4 font-playfair">Product Specifications</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 py-2 border-b">
                  <span className="font-medium text-gray-700">Brand</span>
                  <span>{product.brand.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 py-2 border-b">
                  <span className="font-medium text-gray-700">Material</span>
                  <span>Premium Cotton</span>
                </div>
                <div className="grid grid-cols-2 gap-2 py-2 border-b">
                  <span className="font-medium text-gray-700">Available Colors</span>
                  <span>{product.colors?.join(", ") || "Black, Blue, White"}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 py-2 border-b">
                  <span className="font-medium text-gray-700">Available Sizes</span>
                  <span>{product.sizes?.join(", ") || "S, M, L, XL"}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 py-2 border-b">
                  <span className="font-medium text-gray-700">Care Instructions</span>
                  <span>Machine washable</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="pt-4">
              <CommentSection
                comments={productComments}
                onAddComment={(content, rating) => {
                  console.log("New comment:", content, "Rating:", rating)
                  // In a real app, this would call an API to add the comment
                }}
                allowRating={true}
                title="Customer Reviews"
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Fixed Add to Cart button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50 md:hidden">
        <div className="flex gap-2">
          <button
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium flex items-center justify-center"
            onClick={() => document.getElementById("add-to-cart-btn")?.click()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
