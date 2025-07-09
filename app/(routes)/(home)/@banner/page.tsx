import { BannerSlider } from "@/components/banner-slider"
import { getBanners } from "@/lib/actions"

export default async function BannerSection() {
  const banners = await getBanners()

  return <BannerSlider banners={banners} />
}
