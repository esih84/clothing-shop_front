// components/sections/banner-section.tsx
import { BannerSlider } from "@/components/banner-slider";
import { bannerService } from "@/lib/services/banner";

export default async function BannerSection() {
  const banners = await bannerService.findAll(["home", "home_side"]);

  if (!banners?.length) return null;

  return (
    <BannerSlider
      banners={banners}
      mainPositions={["home"]}
      sidePositions={["home_side"]}
    />
  );
}
