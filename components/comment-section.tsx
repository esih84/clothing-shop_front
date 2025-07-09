"use client"

import type React from "react"

import { useState } from "react"
import { User, Star, ThumbsUp, Flag, MoreVertical, Send } from "lucide-react"
import Image from "next/image"
import { Card } from "@/components/ui/card"

export interface Comment {
  id: string
  user: {
    name: string
    avatar?: string
  }
  date: string
  content: string
  rating?: number
  likes: number
  isLiked?: boolean
  replies?: Comment[]
}

interface CommentSectionProps {
  comments: Comment[]
  onAddComment: (content: string, rating?: number) => void
  allowRating?: boolean
  title?: string
}

export function CommentSection({
  comments,
  onAddComment,
  allowRating = false,
  title = "Comments",
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [rating, setRating] = useState(5)
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      onAddComment(newComment, allowRating ? rating : undefined)
      setNewComment("")
      if (allowRating) setRating(5)
    }
  }

  const toggleReplies = (commentId: string) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }))
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold font-playfair">
        {title} ({comments.length})
      </h3>

      {/* Add comment form */}
      <Card className="bg-white p-4 rounded-xl mb-6">
        <form onSubmit={handleSubmit}>
          {allowRating && (
            <div className="flex mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRating(star)} className="mr-1">
                  <Star
                    className={`w-5 h-5 ${
                      star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          )}

          <div className="flex">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
              <User className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full pr-10 py-2 px-3 border rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-indigo-600"
                disabled={!newComment.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </Card>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-semibold text-indigo-600">4.7</div>
          <div className="flex justify-center mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${star <= 5 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
              />
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-1">Average Rating</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-semibold text-indigo-600">94%</div>
          <div className="text-xs text-gray-500 mt-1">Would Recommend</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-semibold text-indigo-600">{comments.length}</div>
          <div className="text-xs text-gray-500 mt-1">Total Reviews</div>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id} className="bg-white p-4 rounded-xl border-0 shadow-sm">
            <div className="flex justify-between">
              <div className="flex items-center">
                {comment.user.avatar ? (
                  <Image
                    src={comment.user.avatar || "/placeholder.svg"}
                    alt={comment.user.name}
                    width={32}
                    height={32}
                    className="rounded-full mr-2"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-sm">{comment.user.name}</p>
                  <p className="text-xs text-gray-500">{comment.date}</p>
                </div>
              </div>
              <button className="text-gray-400">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {comment.rating && (
              <div className="flex mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= comment.rating! ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
            )}

            <p className="mt-2 text-sm">{comment.content}</p>

            <div className="flex items-center mt-3 text-xs text-gray-500">
              <button className={`flex items-center mr-4 ${comment.isLiked ? "text-indigo-600" : ""}`}>
                <ThumbsUp className="w-3.5 h-3.5 mr-1" />
                <span>{comment.likes}</span>
              </button>
              <button className="mr-4">Reply</button>
              <button className="flex items-center">
                <Flag className="w-3.5 h-3.5 mr-1" />
                Report
              </button>
            </div>

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3">
                <button onClick={() => toggleReplies(comment.id)} className="text-xs text-indigo-600 font-medium">
                  {showReplies[comment.id] ? "Hide replies" : `View ${comment.replies.length} replies`}
                </button>

                {showReplies[comment.id] && (
                  <div className="ml-8 mt-3 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          {reply.user.avatar ? (
                            <Image
                              src={reply.user.avatar || "/placeholder.svg"}
                              alt={reply.user.name}
                              width={24}
                              height={24}
                              className="rounded-full mr-2"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                              <User className="w-3 h-3 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-xs">{reply.user.name}</p>
                            <p className="text-xs text-gray-500">{reply.date}</p>
                          </div>
                        </div>
                        <p className="mt-1 text-xs">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
