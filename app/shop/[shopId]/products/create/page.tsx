"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, Upload, X, Plus } from "lucide-react"
import Image from "next/image"

export default function CreateProductPage() {
  const params = useParams()
  const router = useRouter()
  const shopId = params.shopId as string

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    basePrice: "",
    discountType: "none", // none, percentage, bundling
    discountValue: "",
    status: "published",
  })

  const [images, setImages] = useState<string[]>([
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200&text=Image+2",
    "/placeholder.svg?height=200&width=200&text=Image+3",
    "/placeholder.svg?height=200&width=200&text=Image+4",
    "/placeholder.svg?height=200&width=200&text=Image+5",
  ])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would call an API to create the product
    console.log("Form data:", formData)
    console.log("Images:", images)

    // Redirect back to products page
    router.push(`/shop/${shopId}/products`)
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="p-4 pb-20 max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={() => router.push(`/shop/${shopId}/products`)} className="mr-3">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Create New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Product Images */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-medium mb-2">Product Image</h2>
          <p className="text-sm text-gray-500 mb-4">Set your thumbnail product.</p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 flex flex-col items-center justify-center">
            <div className="w-full h-64 relative mb-4">
              {images.length > 0 ? (
                <Image src={images[0] || "/placeholder.svg"} alt="Main product image" fill className="object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            <button type="button" className="px-4 py-2 bg-main rounded-lg text-sm font-medium">
              Upload Image
            </button>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="w-full h-20 relative border rounded-lg overflow-hidden">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="w-full h-20 border border-dashed border-gray-300 rounded-lg flex items-center justify-center"
            >
              <Plus className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-medium mb-2">Product Detail</h2>
          <p className="text-sm text-gray-500 mb-4">Set your product information.</p>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Apple AirPods Max (USB-C)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="AirPods Max, the ultimate listening experience. Now available in five new colors. Apple-designed drivers deliver high-fidelity audio. Every detail, from the canopy to the cushions, has been engineered with incredible precision in mind-blowing precision."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Categories
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
              >
                <option value="">Select a category</option>
                <option value="accessories">Accessories</option>
                <option value="clothing">Clothing</option>
                <option value="electronics">Electronics</option>
                <option value="footwear">Footwear</option>
              </select>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Price & Discount</h3>
              <div className="mb-3">
                <label htmlFor="basePrice" className="block text-xs text-gray-500 mb-1">
                  Base Price
                </label>
                <input
                  type="text"
                  id="basePrice"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleChange}
                  placeholder="$594"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <label className="flex items-center border rounded-lg p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="discountType"
                    value="none"
                    checked={formData.discountType === "none"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm">No Discount</span>
                </label>
                <label className="flex items-center border rounded-lg p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="discountType"
                    value="percentage"
                    checked={formData.discountType === "percentage"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm">Percentage %</span>
                </label>
                <label className="flex items-center border rounded-lg p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="discountType"
                    value="bundling"
                    checked={formData.discountType === "bundling"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm">Bundling</span>
                </label>
              </div>

              {formData.discountType !== "none" && (
                <div>
                  <label htmlFor="discountValue" className="block text-xs text-gray-500 mb-1">
                    {formData.discountType === "percentage" ? "Discount Percentage" : "Bundle Price"}
                  </label>
                  <input
                    type="text"
                    id="discountValue"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                    placeholder={formData.discountType === "percentage" ? "10%" : "$534"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push(`/shop/${shopId}/products`)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-main rounded-lg font-medium">
                Create Product
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
