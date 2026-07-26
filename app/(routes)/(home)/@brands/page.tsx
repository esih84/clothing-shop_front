import { getBanners } from "@/features/banner/banner-api";
import { BannerCard } from "@/shared/components/banner/banner-card";
import { ScrollReveal } from "@/shared/components/global/scroll-reveal";
import { BANNER_POSITIONS } from "@/types/banner";

export default async function BrandsSection() {
  // Banners for the "brands" position — the admin registers them from the dashboard (2 banners side by side).
  const { data: banners } = await getBanners(BANNER_POSITIONS.BRANDS);
  const items = (banners ?? []).slice(0, 2);

  // If no banner is registered for this position, the section is not shown.
  if (items.length === 0) return null;

  return (
    <div className="px-4 mb-6">
      {/* Mobile: single column (stacked). Desktop: two columns side by side. */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {items.map((banner, index) => (
          <ScrollReveal key={banner.id} delay={(index % 2) * 50}>
            <div
              // Mobile full-width 3:1 (shorter since it became full width); desktop 5:2.
              className="relative overflow-hidden rounded-2xl aspect-[3/1] md:aspect-[5/2]"
            >
              {/* type=brand: medium sizing tuned for half-width brand banners
                (text is vertically centered on desktop just like the main banner) */}
              <BannerCard banner={banner} type="brand" />
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
