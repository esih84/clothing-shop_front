import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Providers } from "./providers"
import { DynamicHeader } from "@/components/dynamic-header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ScrollToTop } from "@/components/scroll-to-top"

// Initialize the fonts
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Bungkusa - Fashion E-commerce",
  description: "A modern fashion e-commerce platform",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-gray-50 min-h-screen md:mx-12">
        <Providers>
          <DynamicHeader />
          <main>{children}</main>
          <BottomNavigation />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  )
}
