"use client";

import { SwiperSlider } from "@/components/swiper-slider";

interface ImageSliderProps {
  images: string[];
  alt: string;
  thumbs?: boolean;
}

export function ImageSlider({ images, alt, thumbs = false }: ImageSliderProps) {
  return (
    <SwiperSlider
      images={images}
      alt={alt}
      thumbs={thumbs}
      navigation={true}
      pagination={true}
      className=" overflow-hidden"
    />
  );
}
