"use client";

import { SwiperSlider } from "@/components/swiper-slider";
import { cn } from "@/lib/utils";

interface ImageSliderProps {
  images: string[];
  alt: string;
  thumbs?: boolean;
  className?: string;
}

export function ImageSlider({
  className,
  images,
  alt,
  thumbs = false,
}: ImageSliderProps) {
  return (
    <SwiperSlider
      images={images}
      alt={alt}
      thumbs={thumbs}
      navigation={true}
      pagination={true}
      className={cn("overflow-hidden", className)}
    />
  );
}
