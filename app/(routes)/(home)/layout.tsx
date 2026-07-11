import type React from "react"

export default function HomeLayout({
  children,
  banner,
  categories,
  offers,
  brands,
  products,
  blogs,
}: {
  children: React.ReactNode
  banner: React.ReactNode
  categories: React.ReactNode
  offers: React.ReactNode
  brands: React.ReactNode
  products: React.ReactNode
  blogs: React.ReactNode
}) {
  return (
    <>
      {banner}
      {categories}
      {offers}
      {brands}
      {products}
      {blogs}
      {children}
    </>
  )
}
