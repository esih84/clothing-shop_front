"use client";

import {
  useImperativeHandle,
  useRef,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { cn } from "@/shared/lib/utils";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

/** Control the slider from outside (e.g. clicking a thumbnail) */
export interface AppSliderHandle {
  slideTo: (index: number) => void;
  next: () => void;
  prev: () => void;
}

interface AppSliderProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  /** Unique key for each slide; defaults to index */
  getKey?: (item: T, index: number) => string | number;
  /**
   * Autoplay: `true` = every 5 seconds, a number = interval in seconds,
   * `false`/absent = off
   */
  autoplay?: boolean | number;
  loop?: boolean;
  /** Previous/next arrows */
  navigation?: boolean;
  /** Dots at the bottom of the slider */
  pagination?: boolean;
  spaceBetween?: number;
  slidesPerView?: number | "auto";
  /** Slider direction; set explicitly for correct RTL layout */
  dir?: "rtl" | "ltr";
  /** Responsive breakpoints (e.g. mobile 2 cards, desktop 5 cards) */
  breakpoints?: Record<
    number,
    { slidesPerView?: number | "auto"; spaceBetween?: number }
  >;
  className?: string;
  slideClassName?: string;
  wrapperClassName?: string;
  onSlideChange?: (index: number) => void;
  ref?: Ref<AppSliderHandle>;
}

export function AppSlider<T>({
  items,
  renderItem,
  getKey,
  autoplay = false,
  loop = false,
  navigation = false,
  pagination = false,
  spaceBetween = 0,
  slidesPerView = 1,
  dir,
  breakpoints,
  className,
  slideClassName,
  wrapperClassName,
  onSlideChange,
  ref,
}: AppSliderProps<T>) {
  const swiperRef = useRef<SwiperType | null>(null);

  useImperativeHandle(ref, () => ({
    // slideToLoop works with the real index (correct in loop mode too)
    slideTo: (index) => swiperRef.current?.slideToLoop(index),
    next: () => swiperRef.current?.slideNext(),
    prev: () => swiperRef.current?.slidePrev(),
  }));

  const autoplayDelayMs = autoplay
    ? (typeof autoplay === "number" ? autoplay : 5) * 1000
    : null;

  if (!items.length) return null;

  return (
    <Swiper
      modules={[Autoplay, Navigation, Pagination]}
      dir={dir}
      breakpoints={breakpoints}
      spaceBetween={spaceBetween}
      slidesPerView={slidesPerView}
      navigation={navigation}
      pagination={pagination ? { clickable: true } : false}
      loop={loop}
      autoplay={
        autoplayDelayMs
          ? {
              delay: autoplayDelayMs,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }
          : false
      }
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
      }}
      onSlideChange={(swiper) => onSlideChange?.(swiper.realIndex)}
      wrapperClass={wrapperClassName}
      style={
        {
          "--swiper-navigation-color": "hsl(var(--secondary))",
          "--swiper-navigation-size": "20px",
          "--swiper-pagination-color": "hsl(var(--secondary))",
        } as CSSProperties
      }
      className={cn("w-full", className)}
    >
      {items.map((item, index) => (
        <SwiperSlide
          key={getKey ? getKey(item, index) : index}
          className={slideClassName}
        >
          {renderItem(item, index)}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
