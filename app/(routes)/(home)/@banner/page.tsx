import { BannerSlider } from "@/components/banner-slider"
import { getBanners } from "@/lib/actions"

export default  function BannerSection() {
  const banners = getBanners()

  return <BannerSlider bannersData={banners} />
}
