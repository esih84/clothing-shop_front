import { getBanners } from "@/features/banner/banner-api";
import { BannerCard } from "@/shared/components/banner/banner-card";
import { BANNER_POSITIONS } from "@/types/banner";

export default async function BrandsSection() {
  // بنرهای جایگاه «brands» — ادمین از داشبورد ثبت می‌کند (۲ بنر کنار هم).
  const { data: banners } = await getBanners(BANNER_POSITIONS.BRANDS);
  const items = (banners ?? []).slice(0, 2);

  // اگر بنری برای این جایگاه ثبت نشده باشد، بخش نمایش داده نمی‌شود.
  if (items.length === 0) return null;

  return (
    <div className="px-4 mb-6">
      <div className="grid grid-cols-2 gap-3">
        {items.map((banner) => (
          <div
            key={banner.id}
            className="relative overflow-hidden rounded-2xl h-[120px] sm:h-[160px] md:h-[200px]"
          >
            <BannerCard banner={banner} variant="card" />
          </div>
        ))}
      </div>
    </div>
  );
}
