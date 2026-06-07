import Link from "next/link";
import { Instagram, Linkedin, Mail, MapPin, MessageCircle, MessageSquareText, Phone, Send } from "lucide-react";
import { Locale, contact, localizedPath } from "@/core/lib/site";
import { SeaRoutePattern } from "@/shared/components/SeaRoutePattern";

const primaryContactItems = [
  { value: contact.clearancePhone, href: contact.clearancePhoneUrl, icon: Phone },
  { value: contact.generalWhatsapp, href: contact.generalWhatsappUrl, icon: MessageCircle },
  { value: contact.email, href: contact.emailUrl, icon: Mail }
];

const socialItems = [
  {
    label: "تلگرام",
    value: "t.me/khoobrooz",
    href: contact.telegramUrl,
    icon: Send
  },
  {
    label: "بله",
    value: "ble.ir/khoobrooz",
    href: contact.baleUrl,
    icon: MessageSquareText
  },
  {
    label: "اینستاگرام",
    value: "instagram.com/khoobrooz.ir",
    href: contact.instagramUrl,
    icon: Instagram
  },
  {
    label: "لینکدین",
    value: "linkedin.com/company/khoobrooz.trade",
    href: contact.linkedinUrl,
    icon: Linkedin
  }
];

export function Footer({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#07172b] text-blue-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(244,178,62,0.09),transparent_30%),linear-gradient(180deg,rgba(7,23,43,0.98),rgba(6,19,37,0.99))]" aria-hidden="true" />
      <SeaRoutePattern className="z-0 text-[#d7e7f4] opacity-[0.18]" />
      <div className="absolute inset-0 bg-gradient-to-l from-[#07172b]/86 via-[#07172b]/64 to-[#061325]/96" aria-hidden="true" />

      <div className="container relative z-10 grid gap-8 py-9 lg:grid-cols-[1.15fr_0.7fr_0.85fr_1.2fr]">
        <div className="min-w-0">
          <h3 className="mb-3 text-xl font-black text-white">خوبروز</h3>
          <p className="text-sm leading-7 text-blue-200">برند خدمات بازرگانی، آموزش تجارت خارجی، ترخیص کالا و اسناد کاربردی واردات و صادرات.</p>
          <p className="mt-4 inline-flex items-start gap-2 text-sm leading-7 text-blue-200">
            <MapPin className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />
            <span>ایران، تهران؛ ارائه خدمات مشاوره و پیگیری بازرگانی به صورت آنلاین و هماهنگ‌شده.</span>
          </p>
        </div>
        <div className="min-w-0">
          <h3 className="mb-3 font-black text-white">صفحات</h3>
          <ul className="grid gap-2 text-sm text-blue-200">
            <li><Link href={localizedPath(locale, "/services")}>خدمات</Link></li>
            <li><Link href={localizedPath(locale, "/knowledge")}>دانشنامه</Link></li>
            <li><Link href={localizedPath(locale, "/documents")}>فایل‌ها</Link></li>
            <li><Link href={localizedPath(locale, "/about")}>درباره خوبروز</Link></li>
            <li><Link href={localizedPath(locale, "/contact")}>تماس با ما</Link></li>
          </ul>
        </div>
        <div className="min-w-0">
          <h3 className="mb-3 font-black text-white">خدمات اصلی</h3>
          <ul className="grid gap-2 text-sm text-blue-200">
            <li><Link href={localizedPath(locale, "/services/customs-clearance")}>ترخیص کالا</Link></li>
            <li><Link href={localizedPath(locale, "/services")}>واردات و صادرات</Link></li>
            <li><Link href={localizedPath(locale, "/education")}>آموزش تجارت خارجی</Link></li>
            <li><Link href={localizedPath(locale, "/markets/currency-rates")}>قیمت ارزهای رایج</Link></li>
          </ul>
        </div>
        <div className="min-w-0">
          <h3 className="mb-3 font-black text-white">ارتباط و شبکه‌های اجتماعی</h3>
          <div className="grid gap-2">
            {primaryContactItems.map((item) => {
              const Icon = item.icon;
              const isExternal = item.href.startsWith("http");

              return (
                <a
                  key={item.value}
                  href={item.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer" : undefined}
                  className="flex min-w-0 items-center gap-2 text-sm text-blue-200 transition hover:text-white"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-[4px] bg-white/10 text-accent">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 truncate font-mono text-sm font-bold text-blue-100" dir="ltr">
                    {item.value}
                  </span>
                </a>
              );
            })}
          </div>
          <div className="mt-4 border-t border-white/10 pt-4">
            <span className="mb-2 block text-xs font-bold text-blue-200">شبکه‌های اجتماعی</span>
            <div className="flex flex-wrap items-center gap-2">
              {socialItems.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${item.label}: ${item.value}`}
                    title={item.value}
                    className="grid size-9 place-items-center rounded-[4px] border border-white/10 bg-white/[0.045] text-blue-100 transition hover:border-accent/70 hover:bg-accent hover:text-primary"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 border-t border-white/10 bg-[#061325]/92">
        <div className="container flex min-h-12 flex-col items-center justify-between gap-2 py-3 text-center text-xs text-blue-200 md:flex-row">
          <span>© {year} Khoobrooz Trade. All rights reserved.</span>
          <span>تمام حقوق مادی و معنوی این وب‌سایت برای خوبروز محفوظ است.</span>
        </div>
      </div>
    </footer>
  );
}
