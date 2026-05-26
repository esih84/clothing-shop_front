"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
import { Calendar, MessageSquare, User } from "lucide-react"
import { UpdateBlogModal } from "@/components/modals/update-blog-modal"
import { DeleteConfirmationModal } from "@/components/modals/delete-confirmation-modal"
import { CommentSection, type Comment } from "@/components/comment-section"

// Mock blog comments
const blogComments: Comment[] = [
  {
    id: "1",
    user: {
      name: "Alex Thompson",
      avatar: "/placeholder.svg?height=32&width=32&text=AT",
    },
    date: "May 3, 2025",
    content: "Great article! I've been looking for summer fashion tips and this is exactly what I needed.",
    likes: 8,
    isLiked: true,
  },
  {
    id: "2",
    user: {
      name: "Jessica Parker",
    },
    date: "May 2, 2025",
    content:
      "I love the section about sustainable fashion. It's so important to consider the environmental impact of our clothing choices.",
    likes: 5,
    isLiked: false,
    replies: [
      {
        id: "2-1",
        user: {
          name: "Blog Author",
          avatar: "/placeholder.svg?height=24&width=24&text=BA",
        },
        date: "May 2, 2025",
        content: "Thank you Jessica! Sustainability is definitely a key focus for this summer's trends.",
        likes: 3,
        isLiked: false,
      },
    ],
  },
  {
    id: "3",
    user: {
      name: "Ryan Miller",
      avatar: "/placeholder.svg?height=32&width=32&text=RM",
    },
    date: "Apr 30, 2025",
    content:
      "Could you do a follow-up article on accessorizing these summer outfits? I'd love to see some recommendations!",
    likes: 3,
    isLiked: false,
  },
]

// Mock function to get blog data
const getBlogPost = (blogId: string) => {
  // In a real app, this would fetch from an API
  return {
    id: blogId,
    title: "Summer Fashion Trends 2025",
    content: `
      <p>Summer is just around the corner, and it's time to refresh your wardrobe with the latest fashion trends. This season is all about bold colors, sustainable materials, and comfortable yet stylish pieces that can take you from day to night.</p>
      
      <h2>Bold Colors and Patterns</h2>
      <p>This summer, expect to see vibrant colors and eye-catching patterns. Neon greens, electric blues, and bright oranges are making a comeback, perfect for making a statement at summer parties and beach outings.</p>
      
      <h2>Sustainable Fashion</h2>
      <p>Sustainability continues to be a major focus in fashion. Brands are increasingly using recycled materials, organic cotton, and implementing ethical production practices. Look for pieces that not only look good but also do good for the planet.</p>
      
      <h2>Comfort-First Designs</h2>
      <p>Post-pandemic fashion has embraced comfort without sacrificing style. Loose-fitting dresses, elastic waistbands, and breathable fabrics are trending this summer, making it easier to stay cool and comfortable in the heat.</p>
      
      <h2>Accessorize Wisely</h2>
      <p>Complete your summer look with the right accessories. Oversized sunglasses, straw hats, and beaded jewelry are must-haves this season. Don't forget a stylish yet functional tote bag for all your summer essentials.</p>
    `,
    excerpt: "Discover the hottest fashion trends for the upcoming summer season.",
    date: "Apr 28, 2025",
    author: "Jane Smith",
    comments: 12,
    imageUrl: "/placeholder.svg?height=400&width=800",
    tags: ["Fashion", "Summer", "Trends", "Style"],
  }
}

export default function BlogDetailPage({ params }: { params: Promise<{ blogId: string }> }) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
const { blogId } = use(params) 
  const blogPost = getBlogPost(blogId)

  const handleDelete = async () => {
    setIsDeleting(true)
    // In a real app, this would call an API to delete the blog post
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
    setIsDeleting(false)
    setIsDeleteModalOpen(false)
    // Redirect to blog list
    window.location.href = `/shop/blog`
  }

  // Listen for edit/delete events from the header
  useEffect(() => {
    const handleEdit = () => setIsUpdateModalOpen(true)
    const handleDelete = () => setIsDeleteModalOpen(true)

    document.addEventListener("edit-blog", handleEdit)
    document.addEventListener("delete-blog", handleDelete)

    return () => {
      document.removeEventListener("edit-blog", handleEdit)
      document.removeEventListener("delete-blog", handleDelete)
    }
  }, [])

  return (
    <div className="pb-20">
      {/* Blog Content */}
      <div className="p-4 space-y-4">
        <Image
          src={blogPost.imageUrl || "/placeholder.svg"}
          alt={blogPost.title}
          width={800}
          height={400}
          className="w-full h-48 object-cover rounded-xl"
        />

        <h1 className="text-2xl font-bold">{blogPost.title}</h1>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            <span>{blogPost.author}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{blogPost.date}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {blogPost.tags.map((tag) => (
            <span key={tag} className="bg-gray-100 px-3 py-1 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>

        <div className="prose max-w-none mt-4" dangerouslySetInnerHTML={{ __html: blogPost.content }} />

        <div className="flex items-center mt-6 text-sm text-gray-500">
          <MessageSquare className="w-4 h-4 mr-1" />
          <span>{blogComments.length} Comments</span>
        </div>

        {/* Comment Section */}
        <div className="mt-6">
          <CommentSection
            comments={blogComments}
            onAddComment={(content) => {
              console.log("New comment:", content)
              // In a real app, this would call an API to add the comment
            }}
            allowRating={false}
          />
        </div>
      </div>

      {/* Modals */}
      <UpdateBlogModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        blogPost={blogPost}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Blog Post"
        message="Are you sure you want to delete the blog post"
        itemName={blogPost.title}
        isDeleting={isDeleting}
      />
    </div>
  )
}
