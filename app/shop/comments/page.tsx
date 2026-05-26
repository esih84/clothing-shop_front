"use client"

import { useState } from "react"
import {  useRouter } from "next/navigation"
import { ChevronLeft, Search, Filter, Check, X, Star } from "lucide-react"
import Image from "next/image"

export default function CommentsManagementPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  // Mock comments data
  const comments = [
    {
      id: "1",
      user: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40&text=SJ",
      },
      date: "May 2, 2025",
      content:
        "This jacket is amazing! The quality is excellent and it fits perfectly. I've received many compliments wearing it.",
      rating: 5,
      type: "product",
      productId: "1",
      productName: "Men's Casual Jacket",
      status: "approved",
    },
    {
      id: "2",
      user: {
        name: "Michael Brown",
      },
      date: "Apr 28, 2025",
      content: "Good quality but the sizing runs a bit small. I would recommend ordering one size up.",
      rating: 4,
      type: "product",
      productId: "1",
      productName: "Men's Casual Jacket",
      status: "pending",
    },
    {
      id: "3",
      user: {
        name: "Alex Thompson",
        avatar: "/placeholder.svg?height=40&width=40&text=AT",
      },
      date: "May 3, 2025",
      content: "Great article! I've been looking for summer fashion tips and this is exactly what I needed.",
      type: "blog",
      blogId: "1",
      blogTitle: "Summer Fashion Trends 2025",
      status: "approved",
    },
    {
      id: "4",
      user: {
        name: "Jessica Parker",
      },
      date: "May 2, 2025",
      content:
        "I love the section about sustainable fashion. It's so important to consider the environmental impact of our clothing choices.",
      type: "blog",
      blogId: "1",
      blogTitle: "Summer Fashion Trends 2025",
      status: "pending",
    },
    {
      id: "5",
      user: {
        name: "Emily Davis",
        avatar: "/placeholder.svg?height=40&width=40&text=ED",
      },
      date: "Apr 15, 2025",
      content:
        "The color is slightly different from what's shown in the pictures, but overall I'm satisfied with the purchase.",
      rating: 3,
      type: "product",
      productId: "2",
      productName: "Women's Summer Dress",
      status: "rejected",
      rejectionReason: "Contains inappropriate language",
    },
  ]

  const filteredComments = comments.filter(
    (comment) =>
      (comment.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (comment.type === "product" && comment.productName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (comment.type === "blog" && comment.blogTitle?.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      (statusFilter === "all" || comment.status === statusFilter) &&
      (typeFilter === "all" || comment.type === typeFilter),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">Approved</span>
      case "pending":
        return <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs">Pending</span>
      case "rejected":
        return <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">Rejected</span>
      default:
        return null
    }
  }

  return (
    <div className="p-4 space-y-6  mx-auto pb-20">
      <div className="flex items-center mb-4">
        <button onClick={() => router.push(`/shop`)} className="mr-3">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Comments Management</h1>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search comments"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 text-sm"
          />
        </div>
        <button className="bg-white p-2 rounded-full border border-gray-200">
          <Filter className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
            statusFilter === "all" ? "bg-main font-medium" : "bg-gray-100"
          }`}
          onClick={() => setStatusFilter("all")}
        >
          All Comments
        </button>
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
            statusFilter === "pending" ? "bg-main font-medium" : "bg-gray-100"
          }`}
          onClick={() => setStatusFilter("pending")}
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
            statusFilter === "approved" ? "bg-main font-medium" : "bg-gray-100"
          }`}
          onClick={() => setStatusFilter("approved")}
        >
          Approved
        </button>
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
            statusFilter === "rejected" ? "bg-main font-medium" : "bg-gray-100"
          }`}
          onClick={() => setStatusFilter("rejected")}
        >
          Rejected
        </button>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
            typeFilter === "all" ? "bg-main font-medium" : "bg-gray-100"
          }`}
          onClick={() => setTypeFilter("all")}
        >
          All Types
        </button>
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
            typeFilter === "product" ? "bg-main font-medium" : "bg-gray-100"
          }`}
          onClick={() => setTypeFilter("product")}
        >
          Product Reviews
        </button>
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
            typeFilter === "blog" ? "bg-main font-medium" : "bg-gray-100"
          }`}
          onClick={() => setTypeFilter("blog")}
        >
          Blog Comments
        </button>
      </div>

      <div className="space-y-4">
        {filteredComments.map((comment) => (
          <div key={comment.id} className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex items-start">
                {comment.user.avatar ? (
                  <Image
                    src={comment.user.avatar || "/placeholder.svg"}
                    alt={comment.user.name}
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-gray-500 font-medium">{comment.user.name.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <div className="flex items-center">
                    <h3 className="font-bold text-sm">{comment.user.name}</h3>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{comment.date}</span>
                  </div>

                  <div className="mt-1">
                    {comment.type === "product" ? (
                      <div className="flex items-center text-xs text-gray-500">
                        <span>On product: </span>
                        <a href={`/product/${comment.productId}`} className="ml-1 text-main hover:underline">
                          {comment.productName}
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center text-xs text-gray-500">
                        <span>On blog: </span>
                        <a href={`/shop/blog/${comment.blogId}`} className="ml-1 text-main hover:underline">
                          {comment.blogTitle}
                        </a>
                      </div>
                    )}
                  </div>

                  {comment.rating && (
                    <div className="flex mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= comment.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {getStatusBadge(comment.status)}
            </div>

            <p className="mt-3 text-sm">{comment.content}</p>

            {comment.status === "rejected" && comment.rejectionReason && (
              <div className="mt-2 text-xs text-red-500">
                <span className="font-medium">Rejection reason:</span> {comment.rejectionReason}
              </div>
            )}

            {comment.status === "pending" && (
              <div className="flex justify-end mt-3 space-x-2">
                <button
                  className="flex items-center bg-green-100 text-green-600 px-3 py-1.5 rounded-full text-xs"
                  onClick={() => {
                    // In a real app, this would call an API to approve the comment
                    console.log("Approve comment:", comment.id)
                  }}
                >
                  <Check className="w-3 h-3 mr-1" />
                  Approve
                </button>
                <button
                  className="flex items-center bg-red-100 text-red-600 px-3 py-1.5 rounded-full text-xs"
                  onClick={() => {
                    // In a real app, this would call an API to reject the comment
                    console.log("Reject comment:", comment.id)
                  }}
                >
                  <X className="w-3 h-3 mr-1" />
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
