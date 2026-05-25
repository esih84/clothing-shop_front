"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { useCallback, useEffect, useRef } from "react"
import { getProducts, Product } from "@/lib/actions"
import dynamic from "next/dynamic"
const ProductCard = dynamic(() => import("./product-card").then(m => ({ default: m.ProductCard })), {
  loading: () => <div className="aspect-square bg-gray-100 rounded-lg animate-pulse" />,
  ssr: false,
})
export function Products({ initialProducts }: { initialProducts: Product[] }) {
  const bottomRef = useRef<HTMLDivElement>(null)

const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ["products"],
  queryFn: ({ pageParam }) => getProducts(pageParam as number),
  initialPageParam: 1,  
  getNextPageParam: (last, pages) => last.hasMore ? pages.length + 1 : undefined,
  initialData: {
    pages: [{ products: initialProducts, hasMore: true }],
    pageParams: [1],
  },
  staleTime: 1000 * 60 * 5,
})

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && hasNextPage) fetchNextPage() },
      { threshold: 0.1,rootMargin: "200px", }
    )
    if (bottomRef.current) observer.observe(bottomRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, fetchNextPage])


  
  const allProducts = data?.pages.flatMap((p) => p.products) ?? []

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allProducts.map((product) => (
          <ProductCard key={product.id} id={product.id} title={product.title} price={product.price} imageUrl={product.images[0]} />
        ))}
      </div>
      <div ref={bottomRef} className="h-10 flex items-center justify-center">
        {isFetchingNextPage && <span className="text-sm text-gray-400">در حال بارگذاری...</span>}
      </div>
    </>
  )
}
