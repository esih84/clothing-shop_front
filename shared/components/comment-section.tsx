"use client"

import { useState } from "react"
import { MessageCircle, Star, ThumbsUp, Reply } from "lucide-react"
import { CommentModal } from "@/shared/components/modals/comment-modal"

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
  isLiked: boolean
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
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAddComment = (content: string, rating?: number) => {
    onAddComment(content, rating)
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Comment Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{title}</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Add Comment
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      {/* Comment Modal */}
      <CommentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddComment}
        allowRating={allowRating}
      />
    </div>
  )
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="border-b border-border pb-4 last:border-b-0">
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {comment.user.avatar ? (
            <img
              src={comment.user.avatar || "/placeholder.svg"}
              alt={comment.user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm font-medium text-muted-foreground">{comment.user.name.charAt(0).toUpperCase()}</span>
            </div>
          )}
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="text-sm font-medium text-foreground">{comment.user.name}</h4>
            <span className="text-xs text-muted-foreground">{comment.date}</span>
            {comment.rating && (
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < comment.rating! ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
            )}
          </div>
          <p className="text-sm text-foreground mb-2">{comment.content}</p>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground">
              <ThumbsUp className={`w-3 h-3 ${comment.isLiked ? "fill-blue-500 text-blue-500" : ""}`} />
              <span>{comment.likes}</span>
            </button>
            <button className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground">
              <Reply className="w-3 h-3" />
              <span>Reply</span>
            </button>
          </div>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 pl-4 border-l-2 border-border space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
