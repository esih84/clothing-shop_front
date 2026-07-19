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
      {/*
        موبایل: بنر اصلی تمام‌عرض، دو بنر کناری کنار هم در یک ردیف.
        دسکتاپ: ارتفاع گرید از aspect خودش می‌آید (نه ارتفاع ثابت) تا نسبت
        تصاویر در همه‌ی عرض‌ها ثابت بماند — با aspect-[4/1] روی گرید،
        بنر اصلی ≈ ۳:۱ و بنرهای کناری ≈ ۲:۱ می‌شوند.
      */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:grid-rows-2 md:aspect-[4/1]">
        {/* اسلایدر اصلی */}
        <BannerStrip
          banners={mainBanners}
          variant="hero"
          autoplay={5}
          className="col-span-2 aspect-[5/2] md:col-span-3 md:row-span-2 md:aspect-auto md:h-full"
        />

        {/* دو بنر کناری — autoplay متفاوت تا هم‌زمان نپرند */}
        <BannerStrip
          banners={sideTopBanners}
          variant="card"
          autoplay={7}
          className="aspect-[2/1] md:aspect-auto md:h-full"
        />
        <BannerStrip
          banners={sideBottomBanners}
          variant="card"
          autoplay={9}
          className="aspect-[2/1] md:aspect-auto md:h-full"
        />
      </div>
    </div>
  );
}
