import type React from "react"

export default function HomeLayout({
  children,
  banner,
  categories,
  offers,
  products,
  blogs,
}: {
  children: React.ReactNode
  banner: React.ReactNode
  categories: React.ReactNode
  offers: React.ReactNode
  products: React.ReactNode
  blogs: React.ReactNode
}) {
  return (
    <>
      {banner}
      {categories}
      {offers}
      {products}
      {blogs}
      {children}
    </>
  )
}
