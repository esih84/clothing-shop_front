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

/** کنترل اسلایدر از بیرون (مثلاً کلیک روی thumbnail) */
export interface AppSliderHandle {
  slideTo: (index: number) => void;
  next: () => void;
  prev: () => void;
}

interface AppSliderProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  /** کلید یکتای هر اسلاید؛ پیش‌فرض index */
  getKey?: (item: T, index: number) => string | number;
  /**
   * حرکت خودکار: `true` = هر ۵ ثانیه، عدد = فاصله بر حسب ثانیه،
   * `false`/غایب = خاموش
   */
  autoplay?: boolean | number;
  loop?: boolean;
  /** فلش‌های قبلی/بعدی */
  navigation?: boolean;
  /** نقاط پایین اسلایدر */
  pagination?: boolean;
  spaceBetween?: number;
  slidesPerView?: number | "auto";
  /** جهت اسلایدر؛ برای چیدمان درست در RTL صریح ست می‌شود */
  dir?: "rtl" | "ltr";
  /** نقاط شکست ریسپانسیو (مثلاً موبایل ۲ کارت، دسکتاپ ۵ کارت) */
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
    // slideToLoop با ایندکس واقعی کار می‌کند (در حالت loop هم درست است)
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
          "--swiper-navigation-color": "#1473E6",
          "--swiper-navigation-size": "20px",
          "--swiper-pagination-color": "#1473E6",
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
