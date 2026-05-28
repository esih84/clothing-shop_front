import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Vazirmatn } from "next/font/google"
import { Providers } from "./providers"
import { BottomNavigation } from "@/components/global/bottom-navigation"
import { ScrollToTop } from "@/components/global/scroll-to-top"
import { DynamicHeader } from "@/components/global/dynamic-header"
import { Footer } from "@/components/global/footer"
const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-vazirmatn",
  weight: ["400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "بانگکوسا - فروشگاه آنلاین مد",
  description: "پلتفرم مدرن خرید آنلاین مد و پوشاک",
  generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="bg-gray-50 min-h-screen ">
        <Providers>
          <DynamicHeader />
          <main className="mt-4 md:mx-12">{children}</main>
          <BottomNavigation />
          <ScrollToTop />
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
