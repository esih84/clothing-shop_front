"use client";

import { getProduct, Product } from "@/lib/actions";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { Heart, Star, ShoppingBag, X, Trash2, Minus, Plus } from "lucide-react";
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
  const cartItems = useAppSelector((state) => state.cart.items);
  const [isPending, startTransition] = useTransition();

  // Find cart item for this product/color/size
  const cartItem = product
    ? cartItems.find(
        (item) =>
          item.id === product.id &&
          item.size === selectedSize &&
          item.color === selectedColor
      )
    : undefined;
  const isInCart = !!cartItem;
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
          <div className="flex flex-col md:grid md:grid-cols-2 max-h-[90vh] overflow-y-auto md:overflow-hidden animate-pulse">
            {/* Image Section Skeleton */}
            <div className="relative bg-[#ffbdc5]/20 flex-shrink-0">
              <div className="relative h-56 sm:h-72 md:h-[90vh]">
                <div className="absolute inset-0 bg-[#ffbdc5]/40" />
              </div>
            </div>
            {/* Product Info Skeleton */}
            <div className="p-4 md:p-6 flex flex-col md:overflow-y-auto">
              <div className="flex-1">
                <div className="flex items-start justify-between my-4">
                  <div>
                    <div className="h-6 w-40 bg-[#ffbdc5]/50 rounded mb-2" />
                    <div className="h-4 w-24 bg-[#ffbdc5]/40 rounded" />
                  </div>
                  <div className="h-8 w-8 bg-[#ffbdc5]/40 rounded-full" />
                </div>
                <div className="mb-6 flex gap-3 items-center">
                  <div className="h-8 w-24 bg-[#ffbdc5]/50 rounded" />
                  <div className="h-6 w-16 bg-[#ffbdc5]/30 rounded" />
                </div>
                <div className="mb-6">
                  <div className="h-4 w-16 bg-[#ffbdc5]/40 rounded mb-3" />
                  <div className="flex gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-[#ffbdc5]/30" />
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <div className="h-4 w-16 bg-[#ffbdc5]/40 rounded mb-3" />
                  <div className="grid grid-cols-4 gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-8 bg-[#ffbdc5]/30 rounded" />
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <div className="h-6 w-24 bg-[#ffbdc5]/30 rounded" />
                </div>
              </div>
              <div className="space-y-3 pt-1">
                <div className="flex flex-col gap-3">
                  <div className="h-12 bg-[#670626]/30 rounded" />
                  <div className="h-12 bg-[#ffbdc5]/30 rounded" />
                </div>
              </div>
            </div>
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
                  <DialogTitle className="text-xl font-bold text-gray-900 mb-2">
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



              {/* Price */}
              <div className="mb-6">
                <span className="text-xl md:text-2xl font-bold text-[#670626]">
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
                  <div className="flex gap-2 flex-wrap">
                    {product.colors.map((color: string) => {
                      // Color swatch style copied from product-details.tsx
                      const colorMap = {
                        black: "bg-black",
                        white: "bg-white border border-gray-300",
                        gray: "bg-gray-400",
                        silver: "bg-gray-300",
                        blue: "bg-blue-600",
                        navy: "bg-blue-900",
                        brown: "bg-amber-800",
                        green: "bg-green-600",
                        red: "bg-red-600",
                        pink: "bg-pink-400",
                        purple: "bg-purple-600",
                      };
                      const colorClass = colorMap[color.toLowerCase()] || "bg-[#E3A7C4]";
                      return (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          aria-label={color}
                          className={`w-8 h-8 rounded-full transition-all ${colorClass} ${
                            selectedColor === color
                              ? "ring-2 ring-offset-2 ring-[#670626] scale-110"
                              : "hover:scale-105"
                          }`}
                        />
                      );
                    })}
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

            {/* Actions (match product-details) */}
            <div className="space-y-3 pt-1">
              {isInCart ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-[#E3A7C4]/50 overflow-hidden">
                    <button
                      onClick={() => {
                        if (cartItem.quantity === 1) {
                          dispatch({ type: "cart/removeFromCart", payload: { id: cartItem.id } });
                        } else {
                          dispatch({ type: "cart/updateQuantity", payload: { id: cartItem.id, quantity: cartItem.quantity - 1 } });
                        }
                      }}
                      className="px-4 py-3 bg-[#ffbdc5]/30 hover:bg-[#ffbdc5]/60 transition-colors"
                    >
                      {cartItem?.quantity === 1 ? (
                        <Trash2 className="w-5 h-5 text-[#670626]" />
                      ) : (
                        <Minus className="w-5 h-5 text-[#670626]" />
                      )}
                    </button>
                    <span className="px-6 py-3 text-lg font-bold bg-white">
                      {cartItem?.quantity || 0}
                    </span>
                    <button
                      onClick={() => {
                        dispatch({ type: "cart/updateQuantity", payload: { id: cartItem.id, quantity: cartItem.quantity + 1 } });
                      }}
                      className="px-4 py-3 bg-[#670626] hover:bg-[#670626]/90 text-white transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-start">
                    <p className="text-xs text-gray-400">جمع کل</p>
                    <p className="text-xl font-bold text-[#670626]">
                      ${(product.price * (cartItem?.quantity || 0)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isPending}
                    className="flex-1 bg-[#670626] hover:bg-[#670626]/90 text-white py-3 font-normal md:font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {isPending ? "در حال افزودن..." : "افزودن به سبد خرید"}
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      router.push(`/product/${product.id}`);
                    }}
                    className="flex-1 border border-[#670626] text-[#670626] py-3 font-normal md:font-medium flex items-center justify-center gap-2 transition-colors hover:bg-[#ffbdc5]/10"
                  >
                    مشاهده جزئیات محصول
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
