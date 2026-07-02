"use client";

import { AppSlider } from "@/shared/components/app-slider";
import { cn } from "@/shared/lib/utils";
import type { Banner } from "@/types/banner";
import { BannerCard, type BannerVariant } from "./banner-card";

interface BannerStripProps {
  banners: Banner[];
  variant?: BannerVariant;
  /** true = هر ۵ ثانیه، عدد = ثانیه، false = خاموش */
  autoplay?: boolean | number;
  /** ارتفاع/چیدمان از بیرون داده می‌شود */
  className?: string;
}

/** اسلایدر یک دسته بنر؛ با یک بنر بدون اسلاید رندر می‌شود */
export function BannerStrip({
  banners,
  variant = "card",
  autoplay = 5,
  className,
}: BannerStripProps) {
  if (!banners.length) return null;

  const hasMultiple = banners.length > 1;

  return (
    <div className={cn("relative overflow-hidden rounded-xl", className)}>
      <AppSlider
        items={banners}
        getKey={(banner) => banner.id}
        autoplay={hasMultiple ? autoplay : false}
        loop={hasMultiple}
        pagination={hasMultiple}
        className="h-full"
        renderItem={(banner, idx) => (
          <BannerCard
            banner={banner}
            variant={variant}
            priority={variant === "hero" && idx === 0}
          />
        )}
      />
    </div>
  );
}
