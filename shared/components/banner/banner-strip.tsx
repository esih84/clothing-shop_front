"use client";

import { AppSlider } from "@/shared/components/app-slider";
import { cn } from "@/shared/lib/utils";
import type { Banner } from "@/types/banner";
import { BannerCard, type BannerType } from "./banner-card";

interface BannerStripProps {
  banners: Banner[];
  /** main = large hero banner; side = compact half-width banner */
  type?: BannerType;
  /** true = every 5 seconds, a number = seconds, false = off */
  autoplay?: boolean | number;
  /** Height/layout is provided from outside */
  className?: string;
}

/** Slider for a group of banners; with a single banner it renders without sliding */
export function BannerStrip({
  banners,
  type = "side",
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
            type={type}
            priority={type === "main" && idx === 0}
          />
        )}
      />
    </div>
  );
}
