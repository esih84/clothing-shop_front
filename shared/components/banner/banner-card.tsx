import Link from "next/link";
import type { Banner } from "@/types/banner";

export type BannerVariant = "hero" | "card";

interface BannerCardProps {
  banner: Banner;
  variant: BannerVariant;
  priority?: boolean;
  /**
   * فشرده: برای بنرهای نصف‌عرض (مثل برندها) که جای کمی دارند —
   * متن و padding در موبایل/دسکتاپ کوچک‌تر می‌شود تا سرریز نکند.
   */
  compact?: boolean;
}

/**
 * رندر یک بنر: hero (بزرگ با متن و دکمه) یا card (کوچک).
 * کل بنر لینک است؛ متن دکمه از خود بنر (`buttonText`) می‌آید و اگر خالی
 * باشد دکمه رندر نمی‌شود. اگر عنوان/توضیح/دکمه هیچ‌کدام نباشند، هیچ لایه‌ای
 * روی تصویر نمی‌آید تا بنرهای صرفاً تصویری تمیز دیده شوند.
 */
export function BannerCard({
  banner,
  variant,
  priority = false,
  compact = false,
}: BannerCardProps) {
  const desktopSrc = banner.imageUrl || "/placeholder.svg";
  // اگر ادمین تصویر موبایل ثبت نکرده باشد، همان تصویر دسکتاپ نمایش داده می‌شود
  const mobileSrc = banner.mobileImageUrl || desktopSrc;
  const buttonText = banner.buttonText?.trim();
  const hasOverlay = Boolean(banner.title || banner.description || buttonText);

  // <picture> به‌جای next/image: بهینه‌سازی تصویر غیرفعال است (next.config: unoptimized)
  // و این‌طور مرورگر فقط همان تصویری را می‌گیرد که به بریک‌پوینت می‌خورد.
  const image = (
    <picture>
      <source media="(max-width: 767px)" srcSet={mobileSrc} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={desktopSrc}
        alt={banner.title}
        className="absolute inset-0 h-full w-full object-cover"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
    </picture>
  );

  const overlay =
    variant === "hero" ? (
      <>
        {/*
          بدون گرادیان — پس‌زمینهٔ عکس آبیِ کم‌رنگ است، پس متن مستقیم روی عکس
          می‌نشیند. عنوان با آبیِ پررنگِ سایت و توضیح با سرمه‌ایِ متنِ سایت
          (#1a2433 ~ --foreground) تا روی آبیِ روشن خوانا بماند.
          موبایل: متن پایینِ کادر. دسکتاپ: وسط-راست (RTL).
        */}
        <div
          className={
            compact
              ? "absolute inset-0 z-20 flex flex-col justify-end p-2.5 md:justify-center md:p-6 lg:p-8"
              : "absolute inset-0 z-20 flex flex-col justify-end p-3 md:justify-center md:p-10 lg:p-14"
          }
        >
          {/* موبایل عرض بیشتری می‌گیرد تا متن جا شود؛ دسکتاپ باریک‌تر و کنارِ راست */}
          <div className={compact ? "max-w-[92%] md:max-w-[70%]" : "max-w-[88%] md:max-w-[55%]"}>
            {banner.title && (
              <h2
                className={
                  compact
                    ? "line-clamp-2 text-[11px] font-extrabold leading-tight text-[#0F73E6] sm:text-sm md:text-xl lg:text-2xl"
                    : "text-base font-extrabold leading-tight text-[#0F73E6] sm:text-lg md:text-4xl lg:text-5xl"
                }
              >
                {banner.title}
              </h2>
            )}
            {banner.description && (
              <p
                className={
                  compact
                    ? "mt-0.5 line-clamp-1 text-[10px] font-medium leading-snug text-[#1a2433] sm:text-[11px] md:mt-2 md:line-clamp-2 md:text-sm"
                    : "mt-1 line-clamp-2 text-[11px] font-medium leading-snug text-[#1a2433] sm:text-xs md:mt-4 md:text-lg"
                }
              >
                {banner.description}
              </p>
            )}
            {buttonText && (
              // span نه Link — کل بنر خودش لینک است و <a> تودرتو نامعتبر است
              <span className="mt-2 inline-block rounded-lg bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground shadow-md sm:mt-3 sm:px-6 sm:py-3 sm:text-sm md:mt-6 md:rounded-xl md:px-8 md:py-4 md:text-base">
                {buttonText}
              </span>
            )}
          </div>
        </div>
      </>
    ) : (
      <>
        {/* بدون گرادیان — پس‌زمینهٔ آبیِ کم‌رنگِ عکس، متن مستقیم رویش */}
        <div className="absolute inset-x-3 bottom-2.5 z-20">
          {banner.title && (
            <h3 className="text-sm font-extrabold leading-tight text-[#0F73E6] md:text-2xl lg:text-3xl">
              {banner.title}
            </h3>
          )}
          {banner.description && (
            <p className="mt-1 line-clamp-2 text-[11px] font-medium leading-snug text-[#1a2433] md:mt-3 md:text-sm lg:text-base">
              {banner.description}
            </p>
          )}
          {buttonText && (
            <span className="mt-2 inline-block rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow md:text-sm">
              {buttonText}
            </span>
          )}
        </div>
      </>
    );

  const content = (
    <>
      {image}
      {hasOverlay && overlay}
    </>
  );

  // کل بنر لینک است؛ بدون لینک، عنصر غیرقابل‌کلیک رندر می‌شود
  return banner.link ? (
    <Link href={banner.link} className="relative block h-full w-full">
      {content}
    </Link>
  ) : (
    <div className="relative h-full w-full">{content}</div>
  );
}
