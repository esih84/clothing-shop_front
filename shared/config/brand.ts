/**
 * تنظیمات مرکزی برند فروشگاه.
 * برای تغییر نام/شعار/اطلاعات تماس فقط همین فایل را ویرایش کنید.
 */
export const brand = {
  /** نام فارسی برند (در هدر، فوتر و عنوان صفحات استفاده می‌شود) */
  name: "پت‌لند",
  /** نام لاتین برند (برای کپی‌رایت، دامنه و SEO لاتین) */
  nameEn: "PetLand",
  /** شعار کوتاه */
  tagline: "هر چیزی که حیوون خونگیت لازم داره",
  /** توضیح بلندتر برای metadata و فوتر */
  description:
    "فروشگاه آنلاین لوازم و غذای حیوانات خانگی — غذا، اسباب‌بازی و لوازم نگهداری برای سگ، گربه و دوستان کوچولوت.",
  /** آدرس کامل سایت (برای canonical / OG / sitemap) */
  url: "https://petland.example",
  contact: {
    email: "info@petland.example",
    phone: "۰۲۱-۱۲۳۴۵۶۷۸",
  },
  social: {
    instagram: "https://instagram.com/",
    telegram: "https://t.me/",
    twitter: "https://twitter.com/",
  },
} as const;

export type Brand = typeof brand;
