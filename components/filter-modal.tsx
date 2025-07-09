"use client"

import { useState } from "react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

interface FilterOption {
  id: string
  label: string
  count?: number
  checked?: boolean
}

interface FilterGroup {
  id: string
  title: string
  type: "checkbox" | "radio" | "color"
  options: FilterOption[]
}

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FilterModal({ isOpen, onClose }: FilterModalProps) {
  // Sample filter data
  const filterGroups: FilterGroup[] = [
    {
      id: "gender",
      title: "Gender",
      type: "checkbox",
      options: [
        { id: "men", label: "Men", count: 1276, checked: false },
        { id: "women", label: "Woman", count: 897, checked: false },
        { id: "unisex", label: "Unisex", count: 1085, checked: true },
      ],
    },
    {
      id: "size",
      title: "Size",
      type: "radio",
      options: [
        { id: "s", label: "S", checked: true },
        { id: "m", label: "M", checked: false },
        { id: "l", label: "L", checked: false },
        { id: "xl", label: "XL", checked: false },
        { id: "xxl", label: "XXL", checked: false },
      ],
    },
    {
      id: "color",
      title: "Color",
      type: "color",
      options: [
        { id: "black", label: "Black" },
        { id: "white", label: "White" },
        { id: "grey", label: "Grey" },
        { id: "green", label: "Green" },
        { id: "blue", label: "Blue" },
        { id: "orange", label: "Orange" },
        { id: "red", label: "Red" },
        { id: "pink", label: "Pink" },
        { id: "yellow", label: "Yellow" },
        { id: "purple", label: "Purple" },
      ],
    },
    {
      id: "price",
      title: "Price",
      type: "checkbox",
      options: [
        { id: "under30", label: "Under $30", count: 63, checked: false },
        { id: "30-50", label: "$30 - $50", count: 721, checked: false },
      ],
    },
  ]

  const [filters, setFilters] = useState(filterGroups)

  // Handle checkbox change
  const handleCheckboxChange = (groupId: string, optionId: string) => {
    setFilters((prevFilters) =>
      prevFilters.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            options: group.options.map((option) => {
              if (option.id === optionId) {
                return { ...option, checked: !option.checked }
              }
              return option
            }),
          }
        }
        return group
      }),
    )
  }

  // Handle radio change
  const handleRadioChange = (groupId: string, optionId: string) => {
    setFilters((prevFilters) =>
      prevFilters.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            options: group.options.map((option) => ({
              ...option,
              checked: option.id === optionId,
            })),
          }
        }
        return group
      }),
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[85vh]">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span className="text-lg font-medium">Filter</span>
            </DrawerTitle>
            <DrawerDescription>Apply filters to refine your product search</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-6 overflow-y-auto max-h-[60vh]">
            {filters.map((group) => (
              <div key={group.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{group.title}</h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                </div>

                <div className="space-y-2">
                  {group.type === "checkbox" && (
                    <div className="space-y-2">
                      {group.options.map((option) => (
                        <label key={option.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={option.checked}
                            onChange={() => handleCheckboxChange(group.id, option.id)}
                            className="w-4 h-4 rounded border-gray-300 text-main focus:ring-main"
                          />
                          <span className="ml-2">{option.label}</span>
                          {option.count !== undefined && (
                            <span className="ml-auto text-gray-500 text-sm">{option.count}</span>
                          )}
                        </label>
                      ))}
                    </div>
                  )}

                  {group.type === "radio" && (
                    <div className="flex flex-wrap gap-2">
                      {group.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleRadioChange(group.id, option.id)}
                          className={`px-4 py-2 rounded-full text-sm ${option.checked ? "bg-main" : "bg-gray-100"}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {group.type === "color" && (
                    <div className="grid grid-cols-5 gap-2">
                      {group.options.map((option) => {
                        // Map color names to tailwind classes
                        const colorClass =
                          {
                            black: "bg-black",
                            white: "bg-white border border-gray-200",
                            grey: "bg-gray-400",
                            green: "bg-green-500",
                            blue: "bg-blue-500",
                            orange: "bg-orange-500",
                            red: "bg-red-500",
                            pink: "bg-pink-500",
                            yellow: "bg-yellow-500",
                            purple: "bg-purple-500",
                          }[option.id] || "bg-gray-200"

                        return (
                          <div key={option.id} className="flex flex-col items-center">
                            <button
                              className={`w-8 h-8 rounded-full ${colorClass} mb-1 focus:outline-none focus:ring-2 focus:ring-main focus:ring-offset-2`}
                              aria-label={option.label}
                            />
                            <span className="text-xs">{option.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <DrawerFooter>
            <button className="px-4 py-2 bg-main rounded-lg text-sm font-medium">Apply Filters</button>
            <DrawerClose asChild>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Reset</button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
