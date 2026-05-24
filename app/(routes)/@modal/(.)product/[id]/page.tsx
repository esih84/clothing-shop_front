"use client";

import { getProduct, Product } from "@/lib/actions";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, Star, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addToCart } from "@/lib/store/slices/cartSlice";
import { toggleWishlist } from "@/lib/store/slices/wishlistSlice";

export default function ProductModal({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isInWishlist = wishlistItems.some((item) => item.id === params.id);

  useEffect(() => {
    const fetchProduct = async () => {
      const productData = await getProduct(params.id);
      setProduct(productData);
      if (Array.isArray(productData?.colors) && productData.colors.length > 0) {
        setSelectedColor(productData.colors[0]);
      }
      if (Array.isArray(productData?.sizes) && productData.sizes.length > 0) {
        setSelectedSize(productData.sizes[0]);
      }
    };
    fetchProduct();
  }, [params.id]);

  const handleClose = () => {
    setIsOpen(false);
    router.back();
  };

  const handleViewDetails = () => {
    window.location.reload();
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          id: product.id,
          name: product.title,
          price: product.price,
          imageUrl: product.images[0],
          color: selectedColor,
          size: selectedSize,
          quantity: 1,
        })
      );
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      dispatch(
        toggleWishlist({
          id: product.id,
          name: product.title,
          price: product.price,
          imageUrl: product.images[0],
          brand: product.brand?.name || "Brand",
          location: "In Store",
        })
      );
    }
  };

  if (!product) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          <div className="flex items-center justify-center h-64 md:h-96">
            <div className="animate-spin h-8 w-8 border-b-2 border-[#670626]"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const images: string[] = product.images;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col md:grid md:grid-cols-2 max-h-[90vh] overflow-y-auto md:overflow-hidden">
          {/* Image Section */}
          <div className="relative bg-[#ffbdc5]/20 flex-shrink-0">

            <div className="relative h-56 sm:h-72 md:h-[90vh]">
              <Image
                src={images[currentImageIndex] || "/placeholder.svg"}
                alt={product.title}
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
          <div className="p-4 md:p-6 flex flex-col md:overflow-y-auto">
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-start justify-between my-4">
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {product.title}
                  </DialogTitle>
                  <p className="text-sm text-gray-600">{product.brand?.name}</p>
                </div>
                <button
                  onClick={handleToggleWishlist}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isInWishlist
                        ? "fill-[#670626] text-[#670626]"
                        : "text-gray-400"
                    }`}
                  />
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
                <span className="text-3xl font-bold text-[#670626]">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="ml-2 text-lg text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    رنگ
                  </h3>
                  <div className="flex gap-2">
                    {product.colors.map((color: string) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border text-sm font-medium transition-colors ${
                          selectedColor === color
                            ? "border-[#670626] bg-[#670626] text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:border-[#670626]"
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
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    سایز
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 border text-sm font-medium transition-colors ${
                          selectedSize === size
                            ? "border-[#670626] bg-[#670626] text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:border-[#670626]"
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
                <div className="inline-block bg-[#ffbdc5]/40 text-[#670626] text-xs font-medium px-2 py-1">
                  موجود در انبار
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#670626] text-white hover:bg-[#670626]/90 py-3 font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                افزودن به سبد خرید
              </button>

              <button
                onClick={handleViewDetails}
                className="w-full py-3 border border-[#670626] text-[#670626] font-medium hover:bg-[#ffbdc5]/20 transition-colors"
              >
                مشاهده جزئیات کامل
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
