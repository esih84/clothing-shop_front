"use client"

import { getProduct } from "@/lib/actions"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Heart, Star, ShoppingBag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { addToCart } from "@/lib/store/cartSlice"
import { toggleWishlist } from "@/lib/store/wishlistSlice"

export default function ProductModal({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(true)

  const dispatch = useAppDispatch()
  const wishlistItems = useAppSelector((state) => state.wishlist.items)
  const isInWishlist = wishlistItems.some((item) => item.id === params.id)

  useEffect(() => {
    const fetchProduct = async () => {
      const productData = await getProduct(params.id)
      setProduct(productData)
      if (productData?.colors?.length > 0) {
        setSelectedColor(productData.colors[0])
      }
      if (productData?.sizes?.length > 0) {
        setSelectedSize(productData.sizes[0])
      }
    }
    fetchProduct()
  }, [params.id])

  const handleClose = () => {
    setIsOpen(false)
    router.back()
  }

  const handleViewDetails = () => {
    router.push(`/product/${params.id}`)
  }

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          color: selectedColor,
          size: selectedSize,
          quantity: 1,
        }),
      )
    }
  }

  const handleToggleWishlist = () => {
    if (product) {
      dispatch(
        toggleWishlist({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          brand: product.brand?.name || "Brand",
          location: "In Store",
        }),
      )
    }
  }

  if (!product) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const images = product.images || [product.imageUrl]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* Image Section */}
          <div className="relative bg-gray-50">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative h-96 md:h-full">
              <Image
                src={images[currentImageIndex] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />

              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="p-6 flex flex-col">
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <p className="text-sm text-gray-600">{product.brand?.name}</p>
                </div>
                <button onClick={handleToggleWishlist} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Heart className={`w-5 h-5 ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">4.5</span>
                </div>
                <span className="text-sm text-gray-500">(2,341 reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                {product.originalPrice && (
                  <span className="ml-2 text-lg text-gray-500 line-through">${product.originalPrice}</span>
                )}
              </div>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
                  <div className="flex gap-2">
                    {product.colors.map((color: string) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          selectedColor === color
                            ? "border-black bg-black text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 rounded-lg border text-sm font-medium transition-colors ${
                          selectedSize === size
                            ? "border-black bg-black text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="mb-6">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  In Stock
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button onClick={handleAddToCart} className="w-full bg-black text-white hover:bg-gray-800 py-3" size="lg">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>

              <Button onClick={handleViewDetails} variant="outline" className="w-full py-3 bg-transparent" size="lg">
                View Full Details
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
