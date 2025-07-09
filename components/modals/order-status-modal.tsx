"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface OrderStatusModalProps {
  isOpen: boolean
  onClose: () => void
  currentStatus: string
  orderId: string
}

export function OrderStatusModal({ isOpen, onClose, currentStatus, orderId }: OrderStatusModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)

  const statuses = [
    { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    { value: "processing", label: "Processing", color: "bg-blue-100 text-blue-800" },
    { value: "shipped", label: "Shipped", color: "bg-purple-100 text-purple-800" },
    { value: "completed", label: "Completed", color: "bg-[#d8f5b4] text-green-800" },
    { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // In a real app, this would call an API to update the order status
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

    setIsSubmitting(false)
    onClose()
    // Refresh the page or update the state
    window.location.reload()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>Change the status of order #{orderId}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            {statuses.map((status) => (
              <label
                key={status.value}
                className={`flex items-center p-3 rounded-lg border ${
                  selectedStatus === status.value ? "border-[#d8f5b4] bg-[#d8f5b4]/10" : "border-gray-200"
                } cursor-pointer`}
              >
                <input
                  type="radio"
                  name="status"
                  value={status.value}
                  checked={selectedStatus === status.value}
                  onChange={() => setSelectedStatus(status.value)}
                  className="sr-only"
                />
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full mr-3 ${
                        selectedStatus === status.value ? "bg-[#d8f5b4]" : "bg-gray-200"
                      }`}
                    />
                    <span>{status.label}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${status.color}`}>{status.label}</span>
                </div>
              </label>
            ))}
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#d8f5b4] rounded-lg font-medium"
              disabled={isSubmitting || selectedStatus === currentStatus}
            >
              {isSubmitting ? "Updating..." : "Update Status"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
