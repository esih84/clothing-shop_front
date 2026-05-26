"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import Image from "next/image"
import { RichTextEditor } from "@/components/rich-text-editor"

export default function CreateBlogPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: "",
    status: "published",
  })

  const [featuredImage, setFeaturedImage] = useState("/placeholder.svg?height=400&width=800")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would call an API to create the blog post
    console.log("Form data:", formData)
    console.log("Featured image:", featuredImage)

    // Redirect back to blog page
    router.push(`/shop/blog`)
  }

  return (
    <div className="p-4 pb-20  mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={() => router.push(`/shop/blog`)} className="mr-3">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Create New Blog Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Featured Image */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-medium mb-2">Featured Image</h2>
          <p className="text-sm text-gray-500 mb-4">Set your blog post featured image.</p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-6 flex flex-col items-center justify-center">
            <div className="w-full h-48 relative mb-4">
              <Image
                src={featuredImage || "/placeholder.svg"}
                alt="Featured image"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <button type="button" className="px-4 py-2 bg-main rounded-lg text-sm font-medium">
              Upload Image
            </button>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Blog Status</h3>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
        </div>

        {/* Right Column - Blog Content */}
        <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
          <h2 className="text-lg font-medium mb-2">Blog Content</h2>
          <p className="text-sm text-gray-500 mb-4">Write your blog post content.</p>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Blog Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Summer Fashion Trends 2025"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
              />
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                Excerpt
              </label>
              <input
                type="text"
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="A brief summary of your blog post"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <RichTextEditor value={formData.content} onChange={handleContentChange} minHeight="300px" />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Fashion, Summer, Trends, Style"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
              />
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push(`/shop/blog`)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-main rounded-lg font-medium">
                Publish Post
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
