import Link from "next/link";
import type { Banner } from "@/types/banner";

/**
 * Banner type — controls only the overlay sizing (the overlay markup is shared):
 * - `main`  = large prominent banner (the home hero / main slider).
 * - `side`  = compact narrow banner (the home side banners) — text & padding shrink hard.
 * - `brand` = half-width brand banner — medium sizing (roomier than `side`, smaller than `main`).
 */
export type BannerType = "main" | "side" | "brand";

interface BannerCardProps {
  banner: Banner;
  type: BannerType;
  priority?: boolean;
}

/**
 * Per-type overlay classes. `main`/`side` reproduce the original hero/compact styles exactly;
 * `brand` is its own style because the very small `side` sizing does not suit brand banners.
 */
const STYLES: Record<
  BannerType,
  { wrap: string; box: string; title: string; desc: string; button: string }
> = {
  main: {
    wrap: "absolute inset-0 z-20 flex flex-col justify-end p-3 md:justify-center md:p-10 lg:p-14",
    box: "max-w-[60%] md:max-w-[50%] my-auto mr-1",
    title:
      "text-[11px] font-semibold lg:font-extrabold lg:leading-tight leading-none text-[#0F73E6]  md:text-2xl lg:text-4xl",
    desc: "mt-2 line-clamp-2 text-[8px] font-thin md:font-normal leading-none md:leading-snug text-[#1a2433] sm:text-xs md:mt-3 lg:mt-4 md:text-xs lg:text-base",
    button:
      "mt-4  inline-block rounded-[0.25rem] bg-[#0F73E6] px-1.5 py-1 text-[0.5rem] lg:font-semibold text-white shadow-md sm:mt-3 sm:px-2 sm:py-1.5 sm:text-[0.6rem] md: px-4 md:py-2 md:mt-8 md:text-base lg:mt-6 lg:rounded-xl lg:px-6 lg:py-3 lg:text-base",
  },
  side: {
    wrap: "absolute inset-0 z-20 flex flex-col justify-end p-2.5 md:justify-center md:p-4 lg:p-4",
    box: "max-w-[60%] md:max-w-[50%] my-auto ",
    title:
      "line-clamp-2 text-[0.55rem] font-semibold lg:font-extrabold lg:leading-tight leading-none text-[#0F73E6] sm:text-xs md:text-base lg:text-lg",
    desc: "mt-2 line-clamp-2 hidden  text-[8px] font-thin  leading-none lg:leading-snug text-[#1a2433] lg:font-light md:block md:text-tiny",
    button:
      "mt-6  inline-block rounded-[0.25rem] bg-[#0F73E6] px-1 py-0.5 text-[0.5rem]  md:text-tiny lg:font-semibold text-white shadow-md sm:mt-3 sm:px-1 sm:py-0.5  md:px-2 md:mt-4 md:py-1 lg:mt-6 lg:rounded-[0.5rem] lg:px-2 lg:py-1.5 lg:text-xs",
  },
  brand: {
    wrap: "absolute inset-0 z-20 flex flex-col justify-end p-2.5 md:justify-center md:p-6 lg:p-8",
    box: "max-w-[60%] md:max-w-[50%] my-auto mr-1",
    title:
      "line-clamp-2 text-tiny font-semibold md:font-bold lg:font-extrabold lg:leading-tight leading-none text-[#0F73E6] sm:text-xs md:text-xs lg:text-2xl",
    desc: "mt-2 line-clamp-2 text-[8px] font-thin md:font-light leading-none lg:leading-snug text-[#1a2433]  md:text-tiny lg:text-base",
    button:
      "mt-3  inline-block rounded-[0.25rem] bg-[#0F73E6] px-1.5 py-1 text-[0.5rem] lg:font-semibold text-white shadow-md sm:mt-3 sm:px-2 sm:py-1.5 sm:text-[0.6rem] lg:mt-6 lg:rounded-xl lg:px-6 lg:py-3 lg:text-base",
  },
};

/**
 * Render a single banner. All types share the same overlay markup (title center-right on desktop,
 * bottom on mobile, with an optional button); `type` only picks the sizing preset above.
 * The whole banner is a link; the button text comes from the banner itself (`buttonText`) and if empty
 * the button is not rendered. If there is no title/description/button at all, no layer
 * is placed over the image, so purely visual banners look clean.
 */
export function BannerCard({
  banner,
  type,
  priority = false,
}: BannerCardProps) {
  const styles = STYLES[type];

  const desktopSrc = banner.imageUrl || "/placeholder.svg";
  // If the admin did not set a mobile image, the desktop image is shown instead
  const mobileSrc = banner.mobileImageUrl || desktopSrc;
  const buttonText = banner.buttonText?.trim();
  const hasOverlay = Boolean(banner.title || banner.description || buttonText);

  // <picture> instead of next/image: image optimization is disabled (next.config: unoptimized)
  // and this way the browser fetches only the image that matches the breakpoint.
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

  const overlay = (
    <>
      {/*
        No gradient — the image background is light blue, so the text sits directly on the
        image. The title uses the site's bold blue and the description uses the site's navy text
        (#1a2433 ~ --foreground) so it stays readable on light blue.
        Mobile: text at the bottom of the box. Desktop: center-right (RTL).
      */}
      <div className={styles.wrap}>
        {/* Mobile takes more width so the text fits; desktop is narrower and on the right */}
        <div className={styles.box}>
          {banner.title && <h2 className={styles.title}>{banner.title}</h2>}
          {banner.description && (
            <p className={styles.desc}>{banner.description}</p>
          )}
          {buttonText && (
            // span, not Link — the whole banner is already a link and a nested <a> is invalid
            <span className={styles.button}>{buttonText}</span>
          )}
        </div>
      </div>
    </>
  );

  const content = (
    <>
      {image}
      {hasOverlay && overlay}
    </>
  );

  // The whole banner is a link; without a link, a non-clickable element is rendered
  return banner.link ? (
    <Link
      href={banner.link}
      data-banner-type={type}
      className="relative block h-full w-full"
    >
      {content}
    </Link>
  ) : (
    <div data-banner-type={type} className="relative h-full w-full">
      {content}
    </div>
  );
}
