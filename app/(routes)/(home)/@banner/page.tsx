// components/sections/banner-section.tsx
import { BannerSlider } from "@/shared/components/banner-slider";
import { getBanners } from "@/features/banner/banner-api";

export default async function BannerSection() {
  const { data: banners } = await getBanners(["home", "home_side"]);
  if (!banners || !banners.length) return null;

  return (
    <BannerSlider
      banners={banners}
      mainPositions={["home"]}
      sidePositions={["home_side"]}
    />
  );
}
