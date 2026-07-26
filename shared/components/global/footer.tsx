import Image from "next/image";
import { Mail, Phone, Instagram, Twitter, Send } from "lucide-react";
import { brand } from "@/shared/config/brand";

export function Footer() {
  const socials = [
    { Icon: Instagram, href: brand.social.instagram },

    { Icon: Send, href: brand.social.telegram },
  ];

  return (
    <footer
      className="w-full bg-foreground text-background dark:bg-card dark:text-foreground mt-12 rounded-t-3xl"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-6">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-white/15">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl bg-white/95 px-4 py-3 w-fit">
              <Image
                src="/logo.png"
                alt={brand.name}
                width={180}
                height={50}
                className="h-11 w-auto object-contain"
              />
            </div>
            <span className="text-sm text-background/70 dark:text-foreground/70 leading-relaxed">
              {brand.tagline}
            </span>
            {/* Social Icons */}
            <div className="flex gap-3 mt-2">
              {socials.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2">
            <span className="font-bold mb-2 text-background/90 dark:text-foreground/90 uppercase tracking-widest text-xs">
              دسترسی سریع
            </span>
            {[
              { label: "خانه", href: "/" },
              { label: "دسته‌بندی‌ها", href: "/categories" },
              { label: "بلاگ", href: "/blogs" },
              { label: "پروفایل", href: "/profile" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-background/70 dark:text-foreground/70 hover:text-primary hover:-translate-x-1 transition-all duration-200 w-fit"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <span className="font-bold text-background/90 dark:text-foreground/90 uppercase tracking-widest text-xs mb-2">
              ارتباط با ما
            </span>
            {/* <a
              href={`mailto:${brand.contact.email}`}
              className="flex items-center gap-2 text-background/70 dark:text-foreground/70 hover:text-primary transition-colors duration-200"
            >
              <Mail size={15} />
              {brand.contact.email}
            </a> */}
            <span className="flex items-center gap-2 text-background/70 dark:text-foreground/70">
              <Phone size={15} />
              {brand.contact.phone}
            </span>
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
                className="h-24 w-auto cursor-pointer"
              />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-5 text-right text-xs text-background/50 dark:text-foreground/50">
          © {new Date().getFullYear()} {brand.nameEn}. همه حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}
