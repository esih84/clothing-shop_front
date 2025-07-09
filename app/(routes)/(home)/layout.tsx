import type React from "react"

export default function HomeLayout({
  children,
  banner,
  categories,
  offers,
  products,
}: {
  children: React.ReactNode
  banner: React.ReactNode
  categories: React.ReactNode
  offers: React.ReactNode
  products: React.ReactNode
}) {
  return (
    <>
      {banner}
      {categories}
      {offers}
      {products}
      {children}
    </>
  )
}
