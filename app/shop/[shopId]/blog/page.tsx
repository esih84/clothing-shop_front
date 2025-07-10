"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Calendar,
  MessageSquare,
  Edit,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DeleteConfirmationModal } from "@/components/modals/delete-confirmation-modal";

export default function BlogPage() {
  const params = useParams();
  const router = useRouter();
  const shopId = params.shopId as string;
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalData, setDeleteModalData] = useState<{
    isOpen: boolean;
    postId: string;
    title: string;
  }>({
    isOpen: false,
    postId: "",
    title: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Mock blog post data
  const blogPosts = [
    {
      id: "1",
      title: "Summer Fashion Trends 2025",
      excerpt:
        "Discover the hottest fashion trends for the upcoming summer season.",
      date: "Apr 28, 2025",
      comments: 12,
      imageUrl: "/placeholder.svg?height=120&width=120",
    },
    {
      id: "2",
      title: "How to Style Minimalist Outfits",
      excerpt:
        "Learn the art of creating stylish minimalist outfits with fewer pieces.",
      date: "Apr 20, 2025",
      comments: 8,
      imageUrl: "/placeholder.svg?height=120&width=120",
    },
    {
      id: "3",
      title: "Sustainable Fashion: A Guide",
      excerpt:
        "Everything you need to know about sustainable and ethical fashion choices.",
      date: "Apr 15, 2025",
      comments: 15,
      imageUrl: "/placeholder.svg?height=120&width=120",
    },
  ];

  const filteredPosts = blogPosts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (postId: string, title: string) => {
    setDeleteModalData({
      isOpen: true,
      postId,
      title,
    });
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    // In a real app, this would call an API to delete the blog post
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    setIsDeleting(false);
    setDeleteModalData({ isOpen: false, postId: "", title: "" });
    // Refresh the page or update the state
    window.location.reload();
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col mb-10 sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search blog posts"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 text-sm"
          />
        </div>

        <button
          className="bg-black text-white p-2 rounded-full shadow-sm flex items-center justify-center"
          onClick={() => router.push(`/shop/${shopId}/blog/create`)}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 md:gap-8">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden "
          >
            <div className="flex">
              <div className="w-1/3">
                <Image
                  src={post.imageUrl || "/placeholder.svg"}
                  alt={post.title}
                  width={120}
                  height={120}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-2/3 min-h-full justify-between flex flex-col  p-4">
                <div>
                  <Link href={`/shop/${shopId}/blog/${post.id}`}>
                    <h3 className=" font-normal text-sm md:text-md md:font-bold">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-xs md:text-sm text-gray-500  line-clamp-1 md:line-clamp-2 mt-1">
                    {post.excerpt}
                  </p>
                </div>
                <div className="flex justify-between items-center ">
                  <div className="flex items-center text-xs text-gray-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{post.date}</span>
                    <MessageSquare className="w-3 h-3 ml-2 mr-1" />
                    <span>{post.comments}</span>
                  </div>
                  <div className="flex space-x-1 md:space-x-2">
                    <Link href={`/shop/${shopId}/blog/${post.id}`}>
                      <button className="text-blue-500">
                        <Edit className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      className="text-red-500"
                      onClick={() => handleDeleteClick(post.id, post.title)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalData.isOpen}
        onClose={() =>
          setDeleteModalData({ ...deleteModalData, isOpen: false })
        }
        onConfirm={handleDeleteConfirm}
        title="Delete Blog Post"
        message="Are you sure you want to delete the blog post"
        itemName={deleteModalData.title}
        isDeleting={isDeleting}
      />
    </div>
  );
}
