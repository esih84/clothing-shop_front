"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"

interface Category {
  id: string
  name: string
}

interface CategorySelectorProps {
  categoriesData: Promise<Category[]>
}

const cardGradients = [
  "from-[#670626] to-[#8B1A3C]",
  "from-[#8B1A3C] to-[#A52A5E]",
  "from-[#670626] to-[#C4527A]",
  "from-[#A52A5E] to-[#D4789A]",
  "from-[#670626] to-[#8B1A3C]",
  "from-[#C4527A] to-[#E3A7C4]",
  "from-[#670626] to-[#A52A5E]",
]

export function CategorySelector({ categoriesData }: CategorySelectorProps) {
  const [mounted, setMounted] = useState(false)
  const categories = use(categoriesData)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const display = categories.slice(0, 5)

  return (
    <div className="py-6">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4 px-3 sm:px-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-[#670626]" />
          <h2 className="text-base font-bold tracking-wide">دسته‌بندی محصولات</h2>
        </div>
        <Link
          href="/categories"
          className="text-xs text-[#670626] border-b border-[#670626]/40 pb-0.5 hover:border-[#670626] transition-colors"
        >
          مشاهده همه
        </Link>
      </div>

      {/* Framed card row — fills full width, staggered vertical alignment */}
      <div className="mx-3 sm:mx-4 border ">
        <div className="grid grid-cols-2 sm:flex sm:gap-3 h-auto">
          {display.map((category, index) => {
            const nameOnTop = index % 2 === 1;
            return (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className={[
                  "flex flex-col group border-x sm:flex-1",
                  index === 4 ? "hidden sm:flex" : "",
                  "min-w-0"
                ].join(" ")}
              >
                {/* Name zone — top (centered in available space) */}
                {nameOnTop && (
                  <div className="flex-1 flex items-center justify-center border-t md:border-t-0 border-b p-2">
                    <p className="text-[11px] sm:text-xs font-semibold text-primary text-center leading-tight">
                      {category.name}
                    </p>
                  </div>
                )}

                {/* Image card */}
                <div
                  className={`relative aspect-[3/4] w-full max-w-[90%] m-2 mx-auto overflow-hidden border border-[#E3A7C4] group-hover:border-[#670626]/40 transition-colors bg-gradient-to-b ${
                    cardGradients[index % cardGradients.length]
                  }`}
                >
                  {/* First-letter watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] pointer-events-none select-none">
                    <span className="text-[5rem] font-bold text-white leading-none">
                      {category.name.charAt(0)}
                    </span>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />
                </div>

                {/* Name zone — bottom (centered in available space) */}
                {!nameOnTop && (
                  <div className="flex-1 flex items-center justify-center border-t border-b md:border-b-0  p-2">
                    <p className="text-[11px] sm:text-xs font-semibold text-primary text-center leading-tight">
                      {category.name}
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  )
}
