/**
 * تنظیمات مرکزی برند فروشگاه.
 * برای تغییر نام/شعار/اطلاعات تماس فقط همین فایل را ویرایش کنید.
 */
export const brand = {
  /** نام فارسی برند (در هدر، فوتر و عنوان صفحات استفاده می‌شود) */
  name: "پت میل",
  /** نام لاتین برند (برای کپی‌رایت، دامنه و SEO لاتین) */
  nameEn: "Petmeal",
  /** شعار کوتاه */
  tagline: "هر چیزی که حیوون خونگیت لازم داره",
  /** توضیح بلندتر برای metadata و فوتر */
  description:
    "فروشگاه آنلاین لوازم و غذای حیوانات خانگی — غذا، اسباب‌بازی و لوازم نگهداری برای سگ، گربه و دوستان کوچولوت.",
  /** آدرس کامل سایت (برای canonical / OG / sitemap) */
  url: "https://petmeal.ir",
  contact: {
    // email: "info@petland.example",
    phone: "09330581953",
  },
  social: {
    instagram: "https://instagram.com/",
    telegram: "https://t.me/",
  },
} as const;

export type Brand = typeof brand;
