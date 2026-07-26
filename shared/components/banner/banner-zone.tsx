import { getBanners } from "@/features/banner/banner-api";
import type { BannerPosition } from "@/types/banner";
import { BannerStrip } from "./banner-strip";
import type { BannerType } from "./banner-card";

interface BannerZoneProps {
  position: BannerPosition;
  /** main = large hero banner; side = compact half-width banner */
  type?: BannerType;
  autoplay?: boolean | number;
  className?: string;
}

/**
 * A banner position usable on any page (Server Component):
 * `<BannerZone position="..." type="side" />`
 * Fetches the banners for that position and renders nothing if there are none.
 */
export async function BannerZone({
  position,
  type = "side",
  autoplay = 5,
  className,
}: BannerZoneProps) {
  const { data } = await getBanners(position);
  if (!data?.length) return null;

  return (
    <BannerStrip
      banners={data}
      type={type}
      autoplay={autoplay}
      className={className}
    />
  );
}
