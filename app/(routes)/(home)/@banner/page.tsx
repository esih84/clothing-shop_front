import { getBanners } from "@/features/banner/banner-api";
import { BannerStrip } from "@/shared/components/banner/banner-strip";
import { BANNER_POSITIONS } from "@/types/banner";

export default async function BannerSection() {
  // One fetch for all three home positions (instead of three separate requests)
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
        Mobile & tablet (below lg): full-width main banner, two side banners next to each other in one row.
        Desktop (lg+): the grid height comes from its own aspect ratio (not a fixed height) so the ratio
        of the images stays constant at all widths — with aspect-[4/1] on the grid,
        the main banner becomes ≈ 3:1 and the side banners ≈ 2:1.
      */}
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:grid-rows-2 lg:aspect-[4/1]">
        {/* Main slider */}
        <BannerStrip
          banners={mainBanners}
          type="main"
          autoplay={5}
          className="col-span-2 aspect-[5/2] lg:col-span-3 lg:row-span-2 lg:aspect-auto lg:h-full"
        />

        {/* Two side banners — different autoplay so they don't advance at the same time */}
        <BannerStrip
          banners={sideTopBanners}
          type="side"
          autoplay={7}
          className="aspect-[2/1] lg:aspect-auto lg:h-full"
        />
        <BannerStrip
          banners={sideBottomBanners}
          type="side"
          autoplay={9}
          className="aspect-[2/1] lg:aspect-auto lg:h-full"
        />
      </div>
    </div>
  );
}
