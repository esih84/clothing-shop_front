"use client"

import { useState, useEffect } from "react"
import { getProduct } from "@/lib/actions"
import { ProductDetails } from "@/components/product-details"
import { CommentSection, type Comment } from "@/components/comment-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import type { Product } from "@/lib/actions"

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

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        setError(false)
        const productData = await getProduct(params.id)

        if (!productData) {
          setError(true)
          return
        }

        setProduct(productData)
      } catch (err) {
        console.error("Error fetching product:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  if (loading) {
    return (
      <div className="pb-24 max-w-6xl mx-auto">
        <div className="pt-16 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Loading skeleton */}
            <div className="mb-6">
              <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="pb-24 max-w-6xl mx-auto">
        <div className="pt-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-4">The product you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => window.history.back()}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
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
    </div>
  )
}
