import { Mail, Phone, Instagram, Twitter, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#670626] text-white mt-12" dir="rtl">
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-6">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-white/20">
          
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <span className="text-3xl font-extrabold tracking-wide">بانگکوسا</span>
            <span className="text-sm text-white/70 leading-relaxed">
              فروشگاه آنلاین مد و پوشاک — سبک خودت رو پیدا کن
            </span>
            {/* Social Icons */}
            <div className="flex gap-3 mt-2">
              {[Instagram, Twitter, Send].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2">
            <span className="font-bold text-base mb-2 text-white/90 uppercase tracking-widest text-xs">
              دسترسی سریع
            </span>
            {[
              { label: "خانه", href: "/" },
              { label: "فروشگاه", href: "/shop" },
              { label: "بلاگ", href: "/blogs" },
              { label: "پروفایل", href: "/profile" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200 w-fit"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <span className="font-bold text-white/90 uppercase tracking-widest text-xs mb-2">
              ارتباط با ما
            </span>
            <a
              href="mailto:info@bangkosa.com"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200"
            >
              <Mail size={15} />
              info@bangkosa.com
            </a>
            <span className="flex items-center gap-2 text-white/70">
              <Phone size={15} />
              ۰۲۱-۱۲۳۴۵۶۷۸
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-5 text-center text-xs text-white/50">
          © {new Date().getFullYear()} Bangkosa. همه حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}
