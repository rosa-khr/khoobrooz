import Link from "next/link";
import { Instagram, Linkedin, Mail, MapPin, MessageCircle, Send, Smartphone } from "lucide-react";
import { Locale, contact, localizedPath } from "@/core/lib/site";
import { getDictionary } from "@/data/i18n";
import { localizedNavigation, type NavigationItem } from "@/data/navigation";
import { BrandLogoMark } from "@/shared/components/BrandLogo";
import { SeaRoutePattern } from "@/shared/components/SeaRoutePattern";

const primaryContactItems = [
  { value: contact.clearancePhone, href: contact.clearancePhoneUrl, icon: Smartphone },
  { value: contact.email, href: contact.emailUrl, icon: Mail }
];

const socialItems = [
  {
    label: "تلگرام",
    value: `t.me/${contact.telegramName}`,
    href: contact.telegramUrl,
    icon: Send
  },
  {
    label: "واتساپ",
    value: contact.generalWhatsapp,
    href: contact.generalWhatsappUrl,
    icon: MessageCircle
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

type MenuResponse = {
  responseStatus: 0 | 1;
  response: {
    items: NavigationItem[];
    total: number;
  };
};

const backendApiBaseUrl = process.env.BACKEND_API_URL?.replace(/\/api\/v1$/, "") ?? "http://localhost:8000";

async function loadFooterNavigation(locale: Locale) {
  const fallback = localizedNavigation(locale);

  try {
    const response = await fetch(`${backendApiBaseUrl}/api/v1/menus`, {
      cache: "no-store"
    });
    const payload = (await response.json()) as MenuResponse;

    if (!response.ok || payload.responseStatus !== 1 || payload.response.items.length === 0) {
      return fallback;
    }

    const localizeItem = (item: NavigationItem): NavigationItem => ({
      ...item,
      href: localizedPath(locale, item.href),
      children: item.children?.map(localizeItem)
    });

    return payload.response.items.map(localizeItem);
  } catch {
    return fallback;
  }
}

export async function Footer({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear();
  const dictionary = getDictionary(locale);
  const nav = await loadFooterNavigation(locale);
  const serviceChildren = nav[1]?.children ?? [];
  const brandChildren = nav[5]?.children ?? [];

  return (
  <footer data-dynamic-content className="relative overflow-hidden bg-[#07172b] text-blue-100">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(244,178,62,0.09),transparent_30%),linear-gradient(180deg,rgba(7,23,43,0.98),rgba(6,19,37,0.99))]" aria-hidden="true" />
    <SeaRoutePattern className="z-0 text-[#d7e7f4] opacity-[0.18]" />
    <div className="absolute inset-0 bg-gradient-to-l from-[#07172b]/86 via-[#07172b]/64 to-[#061325]/96" aria-hidden="true" />

    <div className="container relative z-10 grid gap-8 py-9 lg:grid-cols-[1.15fr_0.7fr_0.85fr_1.2fr]">
      <div className="min-w-0">
        <div className="mb-3 inline-flex items-center gap-2.5">
          <BrandLogoMark className="size-10" />
          <h3 className="text-xl font-black text-white">{dictionary.brand.name}</h3>
        </div>
        <p className="text-sm leading-7 text-blue-200">{dictionary.footer.intro}</p>
        <p className="mt-4 inline-flex items-start gap-2 text-sm leading-7 text-blue-200">
          <MapPin className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />
          <span>{contact.address}</span>
        </p>
      </div>

      <div className="min-w-0">
        <h3 className="mb-3 font-black text-white">{dictionary.footer.pages}</h3>
        <ul className="grid gap-2 text-sm text-blue-200">
          <li><Link href={nav[1]?.href ?? localizedPath(locale, "/services")}>{nav[1]?.label}</Link></li>
          <li><Link href={nav[2]?.href ?? localizedPath(locale, "/knowledge")}>{nav[2]?.label}</Link></li>
          <li><Link href={nav[3]?.href ?? localizedPath(locale, "/documents")}>{nav[3]?.label}</Link></li>
          <li><Link href={brandChildren[0]?.href ?? localizedPath(locale, "/about")}>{brandChildren[0]?.label}</Link></li>
          <li><Link href={brandChildren[1]?.href ?? localizedPath(locale, "/contact")}>{brandChildren[1]?.label}</Link></li>
        </ul>
      </div>

      <div className="min-w-0">
        <h3 className="mb-3 font-black text-white">{dictionary.footer.mainServices}</h3>
        <ul className="grid gap-2 text-sm text-blue-200">
          <li><Link href={serviceChildren[0]?.href ?? localizedPath(locale, "/services/customs-clearance")}>{serviceChildren[0]?.label}</Link></li>
          <li><Link href={serviceChildren[1]?.href ?? localizedPath(locale, "/services/yuan-transfer")}>{serviceChildren[1]?.label}</Link></li>
          <li><Link href={serviceChildren[2]?.href ?? localizedPath(locale, "/services")}>{serviceChildren[2]?.label}</Link></li>
          <li><Link href={nav[4]?.children?.[0]?.href ?? localizedPath(locale, "/markets/currency-rates")}>{nav[4]?.children?.[0]?.label}</Link></li>
        </ul>
      </div>

      <div className="min-w-0">
        <h3 className="mb-3 font-black text-white">{dictionary.footer.contactSocial}</h3>

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
                <span className="footer-contact-value min-w-0 truncate text-sm font-bold text-blue-100" dir="ltr">
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
                  aria-label={item.label}
                  title={item.label}
                  className="grid size-9 place-items-center rounded-[4px] border border-white/10 bg-white/[0.045] text-blue-100 transition hover:border-accent/70 hover:bg-accent hover:text-primary"
                >
                  <Icon className="size-4" aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-4 border-t border-white/10 pt-4">
          <span className="mb-3 block text-xs font-bold text-blue-200">
            نماد اعتماد الکترونیکی
          </span>

          <a
            referrerPolicy="origin"
            target="_blank"
            rel="noopener noreferrer"
            href="https://trustseal.enamad.ir/?id=439097&Code=lJFy9sF8wPgQSWLShwrCgJ6GW8wurwYQ"
            className="inline-flex rounded-md bg-white p-2"
          >
            <img
              referrerPolicy="origin"
              src="https://trustseal.enamad.ir/logo.aspx?id=439097&Code=lJFy9sF8wPgQSWLShwrCgJ6GW8wurwYQ"
              alt="نماد اعتماد الکترونیکی خوبروز"
              style={{ cursor: "pointer", width: "82px", height: "auto" }}
            />
          </a>
        </div>
      </div>
    </div>

    <div className="relative z-10 border-t border-white/10 bg-[#061325]/92">
      <div className="container flex min-h-12 flex-col items-center justify-between gap-2 py-3 text-center text-xs text-blue-200 md:flex-row">
        <span>© {year} Khoobrooz Trade. All rights reserved.</span>
        <span>{dictionary.footer.rights}</span>
      </div>
    </div>
  </footer>
);
}
