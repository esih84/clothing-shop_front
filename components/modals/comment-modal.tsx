"use client"

import type React from "react"

import { useState } from "react"
import { X, Star } from "lucide-react"

interface CommentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (content: string, rating?: number) => void
  allowRating?: boolean
}

export function CommentModal({ isOpen, onClose, onSubmit, allowRating = false }: CommentModalProps) {
  const [comment, setComment] = useState("")
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim()) {
      onSubmit(comment.trim(), allowRating ? rating : undefined)
      setComment("")
      setRating(0)
      setHoveredRating(0)
    }
  }

  const handleClose = () => {
    setComment("")
    setRating(0)
    setHoveredRating(0)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Add Comment</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Rating */}
          {allowRating && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    onMouseEnter={() => setHoveredRating(i + 1)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        i < (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Comment */}
          <div className="mb-6">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Comment
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!comment.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
