"use client"

import { useState, useEffect, useCallback } from "react"
import { ProductCard } from "@/components/product-card"
import { getProducts } from "@/lib/actions"
import type { Product } from "@/lib/actions"

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const loadProducts = useCallback(async (pageNum: number, reset = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }
      setError(false)

      const newProducts = await getProducts(pageNum, 6)

      if (newProducts.length === 0) {
        setHasMore(false)
      } else {
        setProducts((prev) => (reset ? newProducts : [...prev, ...newProducts]))
        if (newProducts.length < 6) {
          setHasMore(false)
        }
      }
    } catch (err) {
      console.error("Error loading products:", err)
      setError(true)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    loadProducts(1, true)
  }, [loadProducts])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        if (!loadingMore && hasMore && !error) {
          setPage((prev) => {
            const nextPage = prev + 1
            loadProducts(nextPage)
            return nextPage
          })
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loadProducts, loadingMore, hasMore, error])

  if (loading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 font-playfair">Featured Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error && products.length === 0) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 font-playfair">Featured Products</h2>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Failed to load products</p>
            <button
              onClick={() => {
                setPage(1)
                loadProducts(1, true)
              }}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 font-playfair">Featured Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {loadingMore && (
          <div className="mt-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!hasMore && products.length > 0 && (
          <div className="text-center mt-8 py-4">
            <p className="text-gray-500">No more products to load</p>
          </div>
        )}

        {error && products.length > 0 && (
          <div className="text-center mt-8 py-4">
            <p className="text-red-600 mb-2">Failed to load more products</p>
            <button
              onClick={() => loadProducts(page)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
