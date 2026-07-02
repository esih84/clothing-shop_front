import Link from "next/link";
import Image from "next/image";
import type { Banner } from "@/types/banner";

export type BannerVariant = "hero" | "card";

interface BannerCardProps {
  banner: Banner;
  variant: BannerVariant;
  priority?: boolean;
}

/** رندر یک بنر: hero (بزرگ با گرادیان و دکمه) یا card (کوچک، کل کارت لینک) */
export function BannerCard({
  banner,
  variant,
  priority = false,
}: BannerCardProps) {
  const image = (
    <Image
      src={banner.imageUrl || "/placeholder.svg"}
      alt={banner.title}
      fill
      className="object-cover"
      priority={priority}
    />
  );

  if (variant === "hero") {
    return (
      <div className="relative w-full h-full">
        {image}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
        <div className="absolute bottom-6 right-6 z-20 text-white">
          <h2 className="text-xl font-bold">{banner.title}</h2>
          {banner.description && (
            <p className="text-sm opacity-80">{banner.description}</p>
          )}
          <Link
            href={banner.link || "#"}
            className="mt-3 inline-block bg-white text-black text-sm px-4 py-2 rounded-lg"
          >
            مشاهده
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={banner.link || "#"}
      className="relative block w-full h-full"
    >
      {image}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute bottom-4 right-4 text-white z-10">
        <h3 className="text-sm font-bold">{banner.title}</h3>
        {banner.description && (
          <p className="text-xs opacity-80">{banner.description}</p>
        )}
      </div>
    </Link>
  );
}
