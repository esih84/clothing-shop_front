import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "./providers";
import { BottomNavigation } from "@/shared/components/global/bottom-navigation";
import { ScrollToTop } from "@/shared/components/global/scroll-to-top";
import { DynamicHeader } from "@/shared/components/global/dynamic-header";
import { Footer } from "@/shared/components/global/footer";
import { BoneBackground } from "@/shared/components/global/bone-background";
import { OrganizationJsonLd } from "@/shared/components/global/json-ld";
import { brand as brandConfig } from "@/shared/config/brand";
import { SiteSettingsProvider } from "@/shared/config/site-settings-provider";
import { buildThemeCss } from "@/shared/lib/theme";
import { getSiteSettings } from "@/features/settings/settings-api";
// Local Vazir font from the public folder (no dependency on downloading from Google)
const vazirmatn = localFont({
  variable: "--font-vazirmatn",
  display: "swap",
  src: [
    {
      path: "../public/fonts/Vazir-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/Vazir-Light.woff2",
      weight: "300",
      style: "normal",
    },
    { path: "../public/fonts/Vazir.woff2", weight: "400", style: "normal" },
    {
      path: "../public/fonts/Vazir-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Vazir-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Vazir-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
});

/**
 * The default title leads with the keywords people actually search for ("پت شاپ آنلاین",
 * "خرید غذای سگ و گربه") instead of the brand slogan; the slogan lives in the description.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { brand } = await getSiteSettings();
  const homeTitle = `پت شاپ آنلاین ${brand.name} | خرید غذای سگ و گربه با قیمت روز`;

  return {
    metadataBase: new URL(brandConfig.url),
    title: {
      default: homeTitle,
      template: `%s | ${brand.name}`,
    },
    description: `${brand.description} ${brand.tagline}.`,
    applicationName: brand.name,
    alternates: { canonical: brandConfig.url },
    openGraph: {
      type: "website",
      locale: "fa_IR",
      siteName: brand.name,
      title: homeTitle,
      description: brand.description,
      url: brandConfig.url,
    },
    twitter: {
      card: "summary_large_image",
      title: homeTitle,
      description: brand.description,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  // Rendered server-side and inline, not fetched: a stylesheet request would let
  // the default palette paint first and then flip once it lands.
  const themeCss = buildThemeCss(settings.theme.primary, settings.theme.secondary);

  return (
    <html
      lang="fa"
      dir="rtl"
      className={vazirmatn.variable}
      suppressHydrationWarning
    >
      <body className="bg-background min-h-screen ">
        {/* href + precedence so React hoists this into <head> exactly once —
            without them the tag is rendered in place and also copied into the
            head, shipping the palette twice. */}
        <style
          href="site-theme"
          precedence="high"
          dangerouslySetInnerHTML={{ __html: themeCss }}
        />
        <OrganizationJsonLd settings={settings} />
        <SiteSettingsProvider settings={settings}>
          <Providers>
            <BoneBackground />
            <DynamicHeader />
            <main className="mt-4 md:mx-12 min-h-screen">{children}</main>
            <BottomNavigation />
            <ScrollToTop />
            <Footer settings={settings} />
          </Providers>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
