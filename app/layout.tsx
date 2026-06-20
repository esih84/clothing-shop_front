import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import localFont from "next/font/local"
import { Providers } from "./providers"
import { BottomNavigation } from "@/shared/components/global/bottom-navigation"
import { ScrollToTop } from "@/shared/components/global/scroll-to-top"
import { DynamicHeader } from "@/shared/components/global/dynamic-header"
import { Footer } from "@/shared/components/global/footer"
import { BoneBackground } from "@/shared/components/global/bone-background"
import { OrganizationJsonLd } from "@/shared/components/global/json-ld"
import { brand } from "@/shared/config/brand"
// فونت محلی Vazir از پوشه‌ی public (بدون وابستگی به دانلود از گوگل)
const vazirmatn = localFont({
  variable: "--font-vazirmatn",
  display: "swap",
  src: [
    { path: "../public/fonts/Vazir-Thin.woff2", weight: "100", style: "normal" },
    { path: "../public/fonts/Vazir-Light.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/Vazir.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Vazir-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/Vazir-Bold.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/Vazir-Black.woff2", weight: "900", style: "normal" },
  ],
})

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: {
    default: `${brand.name} | ${brand.tagline}`,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
  applicationName: brand.name,
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: brand.name,
    title: `${brand.name} | ${brand.tagline}`,
    description: brand.description,
    url: brand.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} | ${brand.tagline}`,
    description: brand.description,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="bg-gray-50 min-h-screen ">
        <OrganizationJsonLd />
        <Providers>
          <BoneBackground />
          <DynamicHeader />
          <main className="mt-4 md:mx-12 min-h-screen">{children}</main>
          <BottomNavigation />
          <ScrollToTop />
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
