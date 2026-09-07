import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Clock,
  Phone,
  Instagram,
  MessageCircle,
  Send,
  ChevronDown,
} from "lucide-react";
import type { SiteSettings } from "@/shared/config/site-settings";
import { getCategories } from "@/features/category/category-api";
import { categoryPath } from "@/shared/lib/urls";
import type { Category } from "@/types/category";

/**
 * Flattens a subtree into a single list. The tree is four levels deep and rendering it as
 * nested, indented lists made the footer a wall of text — every descendant is shown as a chip
 * in one wrapped row instead, so depth costs no vertical space.
 */
function flattenCategories(categories: Category[]): Category[] {
  return categories.flatMap((category) => [
    category,
    ...flattenCategories(category.children ?? []),
  ]);
}

export async function Footer({ settings }: { settings: SiteSettings }) {
  const { brand, contact, footer } = settings;

  // A social link left blank in the panel means the account does not exist yet,
  // so its icon is dropped rather than linking to the bare platform homepage.
  const socials = [
    { Icon: Instagram, href: contact.instagram, label: "اینستاگرام" },
    { Icon: Send, href: contact.telegram, label: "تلگرام" },
    { Icon: MessageCircle, href: contact.whatsapp, label: "واتس‌اپ" },
  ].filter((social) => social.href);

  // Every category needs a real <a href> somewhere on the site or crawlers never reach it —
  // the sliders and the filter sidebar are the only other entry points and both are JS-driven.
  const { data: categoryTree } = await getCategories();
  const topLevel = categoryTree ?? [];

  return (
    <footer
      className="w-full bg-foreground text-background dark:bg-card dark:text-foreground mt-12 rounded-t-3xl"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-6">
        {/* Main Grid — on mobile the brand block spans the full width and the two link columns
            sit side by side, so the layout is not a single right-hugging column. */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8 md:gap-10 pb-10 border-b border-white/15">
          {/* Brand — logo beside the tagline/socials on mobile, stacked from md up */}
          <div className="col-span-2 md:col-span-1 flex flex-row items-start gap-8 md:flex-col md:items-start md:gap-3">
            <div className="shrink-0 rounded-2xl bg-white/95 px-4 py-3">
              <Image
                src={brand.logoUrl}
                alt={brand.name}
                width={366}
                height={200}
                className="h-11 w-auto object-contain"
              />
            </div>
            <div className="flex min-w-0 flex-col items-start gap-3">
              <span className="text-sm text-background/70 dark:text-foreground/70 leading-relaxed">
                {brand.tagline}
              </span>
              {/* Social Icons */}
              <div className="flex gap-3 mt-2">
                {socials.map(({ Icon, href, label }) => (
                  <a
                    key={href}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors duration-200"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2">
            <span className="font-bold mb-2 text-background/90 dark:text-foreground/90 uppercase tracking-widest text-xs">
              {footer.quickLinksTitle}
            </span>
            {footer.quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-background/70 dark:text-foreground/70 hover:text-primary hover:-translate-x-1 transition-all duration-200 w-fit"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <span className="font-bold text-background/90 dark:text-foreground/90 uppercase tracking-widest text-xs mb-2">
              {footer.contactTitle}
            </span>
            {/* Every line here is optional in the panel; a blank value drops the
                row instead of leaving a bare icon behind. */}
            {[contact.phone, contact.phone2].filter(Boolean).map((phone) => (
              <a
                key={phone}
                href={`tel:${phone}`}
                dir="ltr"
                className="flex w-fit items-center gap-2 text-sm text-background/70 dark:text-foreground/70 hover:text-primary transition-colors duration-200"
              >
                <Phone size={15} />
                {phone}
              </a>
            ))}
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                dir="ltr"
                className="flex w-fit items-center gap-2 text-sm text-background/70 dark:text-foreground/70 hover:text-primary transition-colors duration-200"
              >
                <Mail size={15} />
                {contact.email}
              </a>
            )}
            {contact.workingHours && (
              <span className="flex items-center gap-2 text-sm text-background/70 dark:text-foreground/70">
                <Clock size={15} />
                {contact.workingHours}
              </span>
            )}
            {contact.address && (
              <span className="flex items-start gap-2 text-sm text-background/70 dark:text-foreground/70">
                <MapPin size={15} className="mt-0.5 shrink-0" />
                {contact.address}
              </span>
            )}
            {/* Enamad trust seal — must be a plain <img> loaded from enamad.ir with referrerPolicy="origin" for verification */}
            <a
              referrerPolicy="origin"
              target="_blank"
              href="https://trustseal.enamad.ir/?id=763208&Code=svacqJiRKhSvA4OU3rLHrTFmw0Hd0xel"
              className="mt-2 w-fit rounded-2xl bg-white/95 p-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                referrerPolicy="origin"
                src="https://trustseal.enamad.ir/logo.aspx?id=763208&Code=svacqJiRKhSvA4OU3rLHrTFmw0Hd0xel"
                alt="نماد اعتماد الکترونیکی"
                className="h-20 sm:h-24 w-auto max-w-full cursor-pointer"
              />
            </a>
          </div>
        </div>

        {/* Category directory — the crawlable path to every category landing page.
            It is collapsed behind a <details> because the full tree is far too long to sit in
            the footer by default; <details> (not JS state) keeps every <a> in the server-rendered
            HTML, so crawlers still reach them while it is closed. */}
        {topLevel.length > 0 && (
          <nav
            aria-label={footer.categoriesTitle}
            className="py-8 border-b border-white/15"
          >
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
                <span className="font-bold text-background/90 dark:text-foreground/90 uppercase tracking-widest text-xs">
                  {footer.categoriesTitle}
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs text-background/70 dark:text-foreground/70 transition-colors group-hover:bg-white/20">
                  <span className="group-open:hidden">نمایش همه</span>
                  <span className="hidden group-open:inline">بستن</span>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" />
                </span>
              </summary>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {topLevel.map((parent) => (
                  <div key={parent.id} className="flex flex-col gap-2.5">
                    <Link
                      href={categoryPath(parent.slug)}
                      className="w-fit font-bold text-sm text-background/90 dark:text-foreground/90 hover:text-primary transition-colors"
                    >
                      {parent.name}
                    </Link>
                    {parent.children && parent.children.length > 0 && (
                      <ul className="flex flex-wrap gap-1.5">
                        {flattenCategories(parent.children).map((child) => (
                          <li key={child.id}>
                            <Link
                              href={categoryPath(child.slug)}
                              className="inline-block rounded-full bg-white/10 px-2.5 py-1 text-xs text-background/70 dark:text-foreground/70 hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </details>
          </nav>
        )}

        {/* Bottom Bar */}
        <div className="pt-5 text-right text-xs text-background/50 dark:text-foreground/50">
          © {new Date().getFullYear()} {brand.nameEn}. {footer.copyright}
        </div>
      </div>
    </footer>
  );
}
