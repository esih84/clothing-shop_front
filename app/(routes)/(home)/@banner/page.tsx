// components/sections/banner-section.tsx
import { BannerSlider } from "@/components/banner-slider";
import { useGetBanners } from "@/lib/services/banner/useServerBanner";

export default async function BannerSection() {
  const { data: banners } = await useGetBanners(["home", "home_side"]);

  if (!banners ||!banners.length) return null;

  return (
    <BannerSlider
      banners={banners}
      mainPositions={["home"]}
      sidePositions={["home_side"]}
    />
  );
}
