"use client"

import { useState } from "react"
import { FilterModal } from "@/components/filter-modal"

export default function HomePage() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  return (
    <div>
      {/* Filter Modal */}
      <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} />
    </div>
  )
}
