"use client";

import { useState } from "react";
import {
  Star,
  Heart,
  Share2,
  Store,
  MapPin,
  Shield,
  Truck,
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  addToCart,
  updateQuantity,
  removeFromCart,
} from "@/lib/store/slices/cartSlice";
import { toggleWishlist } from "@/lib/store/slices/wishlistSlice";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ImageSlider } from "@/components/image-slider";
import type { Product } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>("");

  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "M");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const cartItems = useAppSelector((state) => state.cart.items);
  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  // Check if this product with the selected size is in the cart
  const cartItem = cartItems.find(
    (item) =>
      item.id === product.id &&
      item.size === selectedSize &&
      item.color === selectedColor
  );
  const isInCart = !!cartItem;

  const handleToggleWishlist = () => {
    dispatch(
      toggleWishlist({
        id: product.id,
        name: product.title,
        price: product.price,
        imageUrl: product.images[0],
        brand: product.brand.name,
        location: product.store.name,
      })
    );
  };

  const handleAddToCart = () => {
    startTransition(() => {
      dispatch(
        addToCart({
          id: product.id,
          name: product.title,
          size: selectedSize,
          price: product.price,
          color: selectedColor,
          quantity: quantity,
          imageUrl: product.images[0],
        })
      );
    });
  };

  const incrementQuantity = () => {
    if (isInCart && cartItem) {
      dispatch(
        updateQuantity({ id: cartItem.id, quantity: cartItem.quantity + 1 })
      );
    } else {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (isInCart && cartItem) {
      if (cartItem.quantity === 1) {
        dispatch(removeFromCart({ id: cartItem.id }));
      } else {
        dispatch(
          updateQuantity({ id: cartItem.id, quantity: cartItem.quantity - 1 })
        );
      }
    } else if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Map color names to tailwind classes
  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      black: "bg-black",
      white: "bg-white border border-gray-300",
      gray: "bg-gray-400",
      silver: "bg-gray-300",
      blue: "bg-blue-600",
      navy: "bg-blue-900",
      brown: "bg-amber-800",
      green: "bg-green-600",
      red: "bg-red-600",
      pink: "bg-pink-500",
      purple: "bg-purple-600",
    };
    return colorMap[color.toLowerCase()] || "bg-gray-200";
  };

  // Mock colors if not provided
  const colors = product.colors || ["black", "blue", "brown", "gray"];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6 pb-25 md:pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <ImageSlider alt="" images={product.images} />

              {/* Discount Badge */}
              {product.discount && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-red-500 text-white">
                    -{product.discount}% OFF
                  </Badge>
                </div>
              )}

              {/* Action Buttons */}
              <button
                onClick={handleToggleWishlist}
                className="absolute z-20 top-2 right-2 p-2 rounded-full bg-white shadow-sm"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isInWishlist ? "fill-red-500 text-red-500" : "text-gray-400"
                  }`}
                />
              </button>
              {/* <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full"
                >
                  <Share2 className="w-4 h-4" />
                </Button> */}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand & Title */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{product.brand.name}</Badge>
                <span className="text-sm text-gray-500">
                  {product.brand.handle}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-sm text-gray-600">
                  {product.reviews.toLocaleString()} reviews
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {/* colors */}
            <div>
              <h2 className="font-medium text-lg md:text-xl mb-2">Color</h2>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${getColorClass(
                      color
                    )} ${
                      selectedColor === color
                        ? "ring-2 ring-offset-2 ring-black"
                        : ""
                    }`}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select ${color} color`}
                  />
                ))}
              </div>
            </div>
            {/* sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h2 className="font-medium text-lg md:text-xl mb-2">Size</h2>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`px-4 py-2 border rounded-md ${
                        selectedSize === size
                          ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                          : "border-gray-300 text-gray-700"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Store Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={product.store.logo || "/placeholder.svg"}
                    alt={product.store.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{product.store.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{product.store.rating}</span>
                      <span>•</span>
                      <span>
                        {product.store.followers.toLocaleString()} followers
                      </span>
                    </div>
                  </div>
                  <Link href={`/store/${product.store.id}`}>
                    <Button variant="outline" size="sm">
                      <Store className="w-4 h-4 mr-2" />
                      Visit Store
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Truck className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-xs text-gray-600">On orders over $50</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-sm">Secure Payment</p>
                  <p className="text-xs text-gray-600">100% protected</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="font-medium text-sm">Easy Returns</p>
                  <p className="text-xs text-gray-600">30-day policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-lg z-40">
          <div className="max-w-2xl mx-auto">
            {isInCart ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center border rounded-lg bg-gray-50">
                  <button
                    onClick={decrementQuantity}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-l-lg transition-colors"
                  >
                    {cartItem?.quantity === 1 ? (
                      <Trash2 className="w-5 h-5 text-red-500" />
                    ) : (
                      <Minus className="w-5 h-5 text-gray-700" />
                    )}
                  </button>
                  <span className="px-6 py-3 text-lg font-bold bg-white">
                    {cartItem?.quantity || 0}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-xl font-bold">
                    ${(product.price * (cartItem?.quantity || 0)).toFixed(2)}
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={isPending}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-lg font-bold text-lg flex items-center  justify-center transition-colors disabled:opacity-50"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                {isPending ? "Adding..." : "Add to Cart"}
              </button>
            )}
          </div>
        </div>
        {/* Additional Info Tabs */}
        {/* <div className="mt-12">
          <div className="border-b">
            <div className="flex space-x-8">
              <button className="py-4 px-1 border-b-2 border-black font-medium text-sm">
                Details
              </button>
              <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">
                Reviews ({product.reviews})
              </button>
              <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">
                Shipping
              </button>
            </div>
          </div>

          <div className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Product Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Brand</span>
                    <span className="font-medium">{product.brand.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Availability</span>
                    <span
                      className={`font-medium ${
                        product.inStock ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  {product.sizes.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available Sizes</span>
                      <span className="font-medium">
                        {product.sizes.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Care Instructions</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Machine wash cold with like colors</li>
                  <li>• Do not bleach</li>
                  <li>• Tumble dry low</li>
                  <li>• Iron on low heat if needed</li>
                  <li>• Do not dry clean</li>
                </ul>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
// <div className="pt-4 px-4 pb-24">
//   <div className="max-w-2xl mx-auto">
//     <div className="mb-6">
//       <ImageSlider
//         images={product.images}
//         alt={product.title}
//         thumbs={true}
//       />
//     </div>

//     <div className="space-y-4">
//       <div className="flex justify-between items-start">
//         <h1 className="text-2xl md:text-3xl font-bold font-playfair">
//           {product.title}
//         </h1>
//         <button onClick={handleToggleWishlist} className="p-1">
//           <Heart
//             className={`w-6 h-6 md:w-7 md:h-7 ${
//               isInWishlist ? "fill-red-500 text-red-500" : ""
//             }`}
//           />
//         </button>
//       </div>

//       <div className="flex items-center gap-2">
//         <div className="flex">
//           {[1, 2, 3, 4, 5].map((i) => (
//             <Star
//               key={i}
//               className={`w-4 h-4 md:w-5 md:h-5 ${
//                 i <= Math.round(product.rating)
//                   ? "fill-yellow-400 text-yellow-400"
//                   : "fill-gray-200 text-gray-200"
//               }`}
//             />
//           ))}
//         </div>
//         <span className="text-sm md:text-base font-medium">
//           {product.rating}
//         </span>
//         <span className="text-sm md:text-base text-gray-500">
//           ({product.reviews?.toLocaleString() || "6,382"} reviews)
//         </span>
//         <span className="text-sm md:text-base text-gray-500">
//           {product.sales?.toLocaleString() || "7,894"} sold
//         </span>
//       </div>

//       <div>
//         <h2 className="font-medium text-lg md:text-xl mb-2">Description</h2>
//         <p className="text-gray-600 text-sm md:text-base">
//           {product.description}
//         </p>
//       </div>

//       <div>
//         <h2 className="font-medium text-lg md:text-xl mb-2">Color</h2>
//         <div className="flex gap-3">
//           {colors.map((color) => (
//             <button
//               key={color}
//               className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${getColorClass(
//                 color
//               )} ${
//                 selectedColor === color
//                   ? "ring-2 ring-offset-2 ring-black"
//                   : ""
//               }`}
//               onClick={() => setSelectedColor(color)}
//               aria-label={`Select ${color} color`}
//             />
//           ))}
//         </div>
//       </div>

// {product.sizes && product.sizes.length > 0 && (
//   <div>
//     <h2 className="font-medium text-lg md:text-xl mb-2">Size</h2>
//     <div className="flex flex-wrap gap-2">
//       {product.sizes.map((size) => (
//         <button
//           key={size}
//           className={`px-4 py-2 border rounded-md ${
//             selectedSize === size
//               ? "border-indigo-600 bg-indigo-50 text-indigo-600"
//               : "border-gray-300 text-gray-700"
//           }`}
//           onClick={() => setSelectedSize(size)}
//         >
//           {size}
//         </button>
//       ))}
//     </div>
//   </div>
// )}

//       <div className="pt-4">
//         <div>
//           <p className="text-sm md:text-base text-gray-500">Total price</p>
//           <p className="text-2xl md:text-3xl font-bold font-playfair">
//             $
//             {(
//               product.price *
//               (isInCart ? cartItem?.quantity || 1 : quantity)
//             ).toFixed(2)}
//           </p>
//         </div>
//       </div>

//       {/* Product features section - visible only on desktop */}
//       <div className="hidden md:grid grid-cols-3 gap-4 mt-8">
//         <div className="flex flex-col items-center text-center">
//           <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-2">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="text-indigo-600"
//             >
//               <circle cx="12" cy="12" r="10" />
//               <polyline points="12 6 12 12 16 14" />
//             </svg>
//           </div>
//           <h3 className="font-medium">Fast Delivery</h3>
//           <p className="text-sm text-gray-500">2-3 business days</p>
//         </div>
//         <div className="flex flex-col items-center text-center">
//           <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-2">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="text-indigo-600"
//             >
//               <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//             </svg>
//           </div>
//           <h3 className="font-medium">Quality Guarantee</h3>
//           <p className="text-sm text-gray-500">Authentic products</p>
//         </div>
//         <div className="flex flex-col items-center text-center">
//           <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-2">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="text-indigo-600"
//             >
//               <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
//               <line x1="1" y1="10" x2="23" y2="10" />
//             </svg>
//           </div>
//           <h3 className="font-medium">Secure Payment</h3>
//           <p className="text-sm text-gray-500">Multiple payment methods</p>
//         </div>
//       </div>
//     </div>
//   </div>

//   {/* Fixed bottom button for mobile and desktop */}
{
  /* <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-lg z-40">
  <div className="max-w-2xl mx-auto">
    {isInCart ? (
      <div className="flex items-center justify-between">
        <div className="flex items-center border rounded-lg bg-gray-50">
          <button
            onClick={decrementQuantity}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-l-lg transition-colors"
          >
            {cartItem?.quantity === 1 ? (
              <Trash2 className="w-5 h-5 text-red-500" />
            ) : (
              <Minus className="w-5 h-5 text-gray-700" />
            )}
          </button>
          <span className="px-6 py-3 text-lg font-bold bg-white">
            {cartItem?.quantity || 0}
          </span>
          <button
            onClick={incrementQuantity}
            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-xl font-bold">
            ${(product.price * (cartItem?.quantity || 0)).toFixed(2)}
          </p>
        </div>
      </div>
    ) : (
      <button
        onClick={handleAddToCart}
        disabled={isPending}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center transition-colors disabled:opacity-50"
      >
        <ShoppingBag className="mr-2 h-5 w-5" />
        {isPending ? "Adding..." : "Add to Cart"}
      </button>
    )}
  </div>
</div>; */
}
// </div>
