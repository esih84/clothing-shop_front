/**
 * Shape and fallback values of the admin-editable site settings.
 *
 * The site's own domain is deliberately absent: it is deployment config that
 * the sitemap and every canonical URL are built from, not something an admin
 * changes from the panel. It lives in `brand.ts`.
 *
 * The backend registry (`settings.definitions.ts`) is the source of truth and
 * always returns every key, so these defaults are only reached when the API is
 * unreachable — they exist so the storefront never renders a blank header or an
 * empty button label. Keep them in step with the backend registry.
 */

export interface SettingLink {
  label: string;
  href: string;
}

export interface SiteSettings {
  /** The two brand colours the rest of the palette is derived from. */
  theme: {
    primary: string;
    secondary: string;
  };
  brand: {
    name: string;
    nameEn: string;
    tagline: string;
    description: string;
    logoUrl: string;
  };
  contact: {
    phone: string;
    phone2: string;
    email: string;
    address: string;
    workingHours: string;
    instagram: string;
    telegram: string;
    whatsapp: string;
  };
  home: {
    heading: string;
    categoriesTitle: string;
    offersTitle: string;
    productsTitle: string;
    blogsTitle: string;
    viewAllLabel: string;
  };
  cart: {
    title: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyCtaLabel: string;
    checkoutLabel: string;
  };
  wishlist: {
    title: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyCtaLabel: string;
    detailsLabel: string;
  };
  orders: {
    title: string;
    emptyTitle: string;
    emptyCtaLabel: string;
  };
  footer: {
    quickLinksTitle: string;
    contactTitle: string;
    categoriesTitle: string;
    quickLinks: SettingLink[];
    copyright: string;
  };
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  // The hexes of the hand-written palette in globals.css, so the defaults
  // reproduce it exactly: 45 94% 52% and 212 88% 48%.
  theme: {
    primary: "#F8BE12",
    secondary: "#0F73E6",
  },
  brand: {
    name: "پت میل",
    nameEn: "Petmeal",
    tagline: "هر چیزی که حیوون خونگیت لازم داره",
    description:
      "فروشگاه آنلاین لوازم و غذای حیوانات خانگی — غذا، اسباب‌بازی و لوازم نگهداری برای سگ، گربه و دوستان کوچولوت.",
    logoUrl: "/logo.png",
  },
  contact: {
    phone: "09330581953",
    phone2: "",
    email: "",
    address: "",
    workingHours: "",
    instagram: "https://instagram.com/",
    telegram: "https://t.me/",
    whatsapp: "",
  },
  home: {
    heading: "پت شاپ آنلاین پت میل — خرید غذا و لوازم سگ و گربه",
    categoriesTitle: "دسته‌بندی‌ها",
    offersTitle: "پیشنهادات ویژه",
    productsTitle: "محصولات ویژه",
    blogsTitle: "آخرین مقالات",
    viewAllLabel: "مشاهده همه",
  },
  cart: {
    title: "سبد خرید",
    emptyTitle: "سبد خرید شما خالی است",
    emptyDescription: "به نظر می‌رسد هنوز چیزی به سبد خرید اضافه نکرده‌اید.",
    emptyCtaLabel: "شروع خرید",
    checkoutLabel: "ادامه‌ی فرآیند خرید",
  },
  wishlist: {
    title: "علاقه‌مندی‌ها",
    emptyTitle: "لیست علاقه‌مندی‌ها خالی است",
    emptyDescription:
      "محصولاتی که دوست داری را اینجا ذخیره کن تا بعداً راحت پیدایشان کنی.",
    emptyCtaLabel: "دیدن محصولات",
    detailsLabel: "جزئیات محصول",
  },
  orders: {
    title: "سفارش‌های من",
    emptyTitle: "هنوز سفارشی ثبت نکرده‌اید",
    emptyCtaLabel: "شروع خرید",
  },
  footer: {
    quickLinksTitle: "دسترسی سریع",
    contactTitle: "ارتباط با ما",
    categoriesTitle: "دسته‌بندی محصولات",
    quickLinks: [
      { label: "خانه", href: "/" },
      { label: "دسته‌بندی‌ها", href: "/categories" },
      { label: "بلاگ", href: "/blogs" },
      { label: "پروفایل", href: "/profile" },
    ],
    copyright: "همه حقوق محفوظ است.",
  },
};
