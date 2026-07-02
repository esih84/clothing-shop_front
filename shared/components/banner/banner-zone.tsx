import { getBanners } from "@/features/banner/banner-api";
import type { BannerPosition } from "@/types/banner";
import { BannerStrip } from "./banner-strip";
import type { BannerVariant } from "./banner-card";

interface BannerZoneProps {
  position: BannerPosition;
  variant?: BannerVariant;
  autoplay?: boolean | number;
  className?: string;
}

/**
 * جایگاه بنر قابل‌استفاده در هر صفحه (Server Component):
 * `<BannerZone position="..." variant="card" />`
 * بنرهای آن جایگاه را fetch می‌کند و اگر بنری نبود چیزی رندر نمی‌کند.
 */
export async function BannerZone({
  position,
  variant = "card",
  autoplay = 5,
  className,
}: BannerZoneProps) {
  const { data } = await getBanners(position);
  if (!data?.length) return null;

  return (
    <BannerStrip
      banners={data}
      variant={variant}
      autoplay={autoplay}
      className={className}
    />
  );
}
