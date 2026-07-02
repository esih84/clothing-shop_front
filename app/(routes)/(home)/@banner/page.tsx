import { getBanners } from "@/features/banner/banner-api";
import { BannerStrip } from "@/shared/components/banner/banner-strip";
import { BANNER_POSITIONS } from "@/types/banner";

export default async function BannerSection() {
  // یک fetch برای هر سه جایگاه خانه (به‌جای سه request جدا)
  const { data: banners } = await getBanners([
    BANNER_POSITIONS.HOME_MAIN,
    BANNER_POSITIONS.HOME_SIDE_TOP,
    BANNER_POSITIONS.HOME_SIDE_BOTTOM,
  ]);
  if (!banners || !banners.length) return null;

  const mainBanners = banners.filter(
    (b) => b.position === BANNER_POSITIONS.HOME_MAIN,
  );
  const sideTopBanners = banners.filter(
    (b) => b.position === BANNER_POSITIONS.HOME_SIDE_TOP,
  );
  const sideBottomBanners = banners.filter(
    (b) => b.position === BANNER_POSITIONS.HOME_SIDE_BOTTOM,
  );

  return (
    <div className="px-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* اسلایدر اصلی */}
        <BannerStrip
          banners={mainBanners}
          variant="hero"
          autoplay={5}
          className="md:col-span-2 md:row-span-2 h-[200px] sm:h-[250px] md:h-[350px] lg:h-[450px]"
        />

        {/* دو ردیف بنر کناری — autoplay متفاوت تا هم‌زمان نپرند */}
        <BannerStrip
          banners={sideTopBanners}
          variant="card"
          autoplay={7}
          className="h-[140px] md:h-auto"
        />
        <BannerStrip
          banners={sideBottomBanners}
          variant="card"
          autoplay={9}
          className="h-[140px] md:h-auto"
        />
      </div>
    </div>
  );
}
