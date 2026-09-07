import type React from "react"
import { getSiteSettings } from "@/features/settings/settings-api"

export default async function HomeLayout({
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
  const { home } = await getSiteSettings()

  return (
    <>
      {/*
        The home page had no <h1> at all. The banner slider is the visual hero here, so the
        heading is for crawlers and screen readers only — a visible line above the slider read
        as an orphan.
      */}
      <h1 className="sr-only">{home.heading}</h1>
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
