"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Instagram, Linkedin, Mail, Menu, MessageCircle, MessageSquareText, Phone, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Locale, contact, localeLabels, localeNames, locales, localizedPath, switchLocalePath } from "@/core/lib/site";
import { getDictionary } from "@/data/i18n";
import { localizedNavigation, type NavigationItem } from "@/data/navigation";
import { BrandLogoMark } from "@/shared/components/BrandLogo";
import { HeaderDateWidget } from "@/shared/components/DateTools";

const headerContacts = [
  {
    label: "واتساپ",
    value: contact.generalWhatsapp,
    href: contact.generalWhatsappUrl,
    icon: MessageCircle
  },
  {
    label: "تلگرام",
    value: contact.telegramName,
    href: contact.telegramUrl,
    icon: Send
  },
  {
    label: "بله",
    value: contact.baleName,
    href: contact.baleUrl,
    icon: MessageSquareText
  },
  {
    label: "اینستاگرام",
    value: contact.instagramName,
    href: contact.instagramUrl,
    icon: Instagram
  },
  {
    label: "لینکدین",
    value: contact.linkedinName,
    href: contact.linkedinUrl,
    icon: Linkedin
  },
  {
    label: "ایمیل",
    value: contact.email,
    href: contact.emailUrl,
    icon: Mail
  }
];

type MenuResponse = {
  responseStatus: 0 | 1;
  response: {
    items: NavigationItem[];
    total: number;
  };
};

export function Header({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [now, setNow] = useState(() => new Date());
  const pathname = usePathname();
  const dictionary = getDictionary(locale);
  const [nav, setNav] = useState<NavigationItem[]>(() => localizedNavigation(locale));

  useEffect(() => {
    let mounted = true;
    const localizeItem = (item: NavigationItem): NavigationItem => ({
      ...item,
      href: localizedPath(locale, item.href),
      children: item.children?.map(localizeItem)
    });

    fetch("/api/menus", { cache: "no-store" })
      .then((response) => response.json() as Promise<MenuResponse>)
      .then((payload) => {
        if (mounted && payload.responseStatus === 1 && payload.response.items.length > 0) {
          setNav(payload.response.items.map(localizeItem));
        }
      })
      .catch(() => {
        if (mounted) {
          setNav(localizedNavigation(locale));
        }
      });

    return () => {
      mounted = false;
    };
  }, [locale]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setOpen(false);
    setOpenSections({});
  }, [pathname]);

  const toggleSection = (sectionKey: string) => {
    setOpenSections((value) => ({
      ...value,
      [sectionKey]: !value[sectionKey]
    }));
  };

  const renderSubmenuItems = (items: NavigationItem[], parentKey: string, depth = 1) => (
    <div className="grid gap-1">
      {items.map((child) => {
        const childKey = `${parentKey}-${child.href}-${child.label}`;
        const hasChildren = Boolean(child.children?.length);
        const isChildOpen = Boolean(openSections[childKey]);

        return (
          <div key={childKey} className="group/sub relative grid gap-1 lg:block">
            <div className="flex items-center gap-1">
              <Link
                href={child.href}
                className={`flex min-h-9 flex-1 items-center rounded-khoobrooz px-3 py-2 transition hover:text-accent ${
                  depth === 1 ? "text-sm font-extrabold text-white" : "text-xs font-bold text-blue-100"
                }`}
              >
                <span className="truncate">{child.label}</span>
              </Link>
              {hasChildren ? (
                <>
                  <button
                    type="button"
                    className="grid size-9 shrink-0 place-items-center rounded-khoobrooz text-blue-100 transition hover:text-accent lg:hidden"
                    aria-label={`باز کردن زیرمنوی ${child.label}`}
                    aria-expanded={isChildOpen}
                    onClick={() => toggleSection(childKey)}
                  >
                    <ChevronDown className={`size-4 transition ${isChildOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                  </button>
                  <ChevronDown className="hidden size-4 shrink-0 text-blue-100 transition group-hover/sub:rotate-90 group-hover/sub:text-accent lg:block" aria-hidden="true" />
                </>
              ) : null}
            </div>

            {hasChildren ? (
              <div
                className={`${
                  isChildOpen ? "grid" : "hidden"
                } gap-1 border-r border-line pr-3 lg:invisible lg:absolute lg:right-[calc(100%+0.5rem)] lg:top-0 lg:z-50 lg:grid lg:w-72 lg:border-0 lg:pr-0 lg:opacity-0 lg:shadow-soft lg:transition lg:group-hover/sub:visible lg:group-hover/sub:opacity-100 lg:group-focus-within/sub:visible lg:group-focus-within/sub:opacity-100`}
              >
                <div className="grid gap-1 rounded-khoobrooz border border-white/20 bg-[#071a33] p-2 text-white shadow-2xl ring-1 ring-accent/15">
                  {renderSubmenuItems(child.children ?? [], childKey, depth + 1)}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <div className="border-b border-white/10 bg-[#061325] text-blue-50">
        <div className="container flex min-h-9 items-center justify-center overflow-hidden">
          <HeaderDateWidget now={now} />
        </div>
      </div>
      <div className="bg-primary text-sm text-blue-50">
        <div className="container flex min-h-10 items-center justify-between gap-4">
          <span className="truncate">{dictionary.header.topbar}</span>
          <div className="hidden items-center gap-2 text-blue-100 md:flex">
            <a className="inline-flex min-h-8 items-center gap-1.5 rounded-[4px] border border-white/15 bg-white/10 px-2.5 text-xs font-bold text-[#ffe4a8] transition hover:border-accent hover:bg-white/15" href={contact.clearancePhoneUrl}>
              <Phone className="size-4" aria-hidden="true" />
              <span className="header-phone-number" dir="ltr">{contact.clearancePhone}</span>
            </a>
            <div className="group relative">
              <button
                type="button"
                className="inline-flex min-h-8 items-center gap-1.5 rounded-[4px] border border-white/15 bg-white/5 px-2.5 text-xs font-bold text-blue-50 transition hover:border-accent hover:bg-white/10"
              >
                <MessageCircle className="size-4 text-accent" aria-hidden="true" />
                {dictionary.header.contacts}
                <ChevronDown className="size-3.5 text-blue-200 transition group-hover:rotate-180" aria-hidden="true" />
              </button>
              <div className="invisible absolute left-0 top-full z-50 w-64 translate-y-2 pt-2 opacity-0 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <div className="grid gap-1 rounded-[6px] border border-line bg-white p-2 text-primary shadow-soft">
                  {headerContacts.map((item) => {
                    const Icon = item.icon;
                    const isExternal = item.href.startsWith("http");

                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noreferrer" : undefined}
                        className="flex items-center justify-between gap-3 rounded-[4px] px-2.5 py-2 text-sm transition hover:bg-[#fff8e9]"
                      >
                        <span className="inline-flex items-center gap-2 font-extrabold">
                          <Icon className="size-4 text-accent" aria-hidden="true" />
                          {item.label}
                        </span>
                        <span className="truncate text-left text-xs font-bold text-muted" dir="ltr">
                          {item.value}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <header data-dynamic-content className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="container relative flex min-h-[76px] items-center justify-between gap-5">
          <Link href={localizedPath(locale, "/")} className="inline-flex items-center gap-2.5 font-black text-primary" aria-label="خوبروز">
            <BrandLogoMark className="size-11" />
            <span className="grid leading-tight">
              {dictionary.brand.name}
              <small className="text-xs font-semibold text-muted">{dictionary.brand.tagline}</small>
            </span>
          </Link>

          <nav
            className={`${
              open ? "grid" : "hidden"
            } absolute inset-x-0 top-full gap-1 rounded-khoobrooz border border-white/20 bg-[#071a33] p-3 text-white shadow-2xl ring-1 ring-accent/15 lg:static lg:flex lg:items-center lg:gap-1 lg:border-0 lg:bg-transparent lg:p-0 lg:text-inherit lg:shadow-none lg:ring-0`}
          >
            {nav.map((item) => {
              const sectionKey = `${item.href}-${item.label}`;
              const isSectionOpen = Boolean(openSections[sectionKey]);
              const hasChildren = Boolean(item.children?.length);

              return (
              <div key={sectionKey} className="group relative">
                <div className="flex items-center gap-1">
                  <Link
                    href={item.href}
                    className={`flex min-h-10 flex-1 items-center justify-between gap-1 rounded-khoobrooz px-3 py-2 text-sm font-semibold transition lg:min-h-0 lg:flex-none lg:justify-start lg:group-hover:bg-[#071a33]/10 ${
                      isSectionOpen ? "bg-white/10 text-accent lg:bg-[#071a33]/10 lg:text-primary" : "text-white hover:text-accent lg:text-slate-700 lg:hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {hasChildren && (
                    <button
                      type="button"
                      className={`grid size-10 place-items-center rounded-khoobrooz transition lg:hidden ${
                        isSectionOpen ? "bg-white/10 text-accent" : "text-blue-100 hover:text-accent"
                      }`}
                      aria-label={`باز کردن زیرمنوی ${item.label}`}
                      aria-expanded={isSectionOpen}
                      onClick={() => toggleSection(sectionKey)}
                    >
                      <ChevronDown className={`size-4 transition ${isSectionOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                    </button>
                  )}
                </div>

                {hasChildren && (
                  <div className={`${isSectionOpen ? "grid" : "hidden"} gap-1 border-r border-line pr-3 lg:invisible lg:absolute lg:right-0 lg:top-full lg:z-50 lg:grid lg:w-80 lg:translate-y-2 lg:border-0 lg:p-0 lg:opacity-0 lg:shadow-soft lg:transition lg:group-hover:visible lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-within:visible lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100`}>
                    <div className="grid gap-1 rounded-khoobrooz border border-white/20 bg-[#071a33] p-2 text-white shadow-2xl ring-1 ring-accent/15">
                      {renderSubmenuItems(item.children ?? [], sectionKey)}
                    </div>
                  </div>
                )}
              </div>
              );
            })}
            <div className="mt-2 flex flex-wrap gap-2 border-t border-line pt-3 lg:hidden">
              {locales.map((item) => (
                <Link
                  key={item}
                  href={switchLocalePath(pathname, item)}
                  className={`rounded-[4px] border px-2.5 py-1.5 text-xs transition ${
                    item === locale ? "border-accent bg-[#fff8e9] font-black text-primary" : "border-line font-bold text-muted"
                  }`}
                >
                  {localeLabels[item]}
                </Link>
              ))}
            </div>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <div className="group relative">
              <button
                type="button"
                className="inline-flex min-h-8 items-center gap-1 rounded-[4px] border border-line bg-white px-2.5 py-1 text-xs font-bold text-primary transition hover:border-accent hover:bg-[#fff8e9]"
                aria-label={dictionary.header.language}
              >
                {localeLabels[locale]}
                <ChevronDown className="size-3.5 text-muted transition group-hover:rotate-180" aria-hidden="true" />
              </button>
              <div className="invisible absolute left-0 top-full z-50 w-36 translate-y-2 pt-2 opacity-0 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <div className="grid gap-1 rounded-[6px] border border-line bg-white p-1.5 shadow-soft">
                  {locales.map((item) => (
                    <Link
                      key={item}
                      href={switchLocalePath(pathname, item)}
                      className={`flex items-center justify-between rounded-[4px] px-2 py-1.5 text-xs transition hover:bg-[#fff8e9] ${
                        item === locale ? "font-black text-primary" : "font-bold text-muted"
                      }`}
                    >
                      <span>{localeNames[item]}</span>
                      <span dir="ltr">{localeLabels[item]}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="grid size-11 place-items-center rounded-khoobrooz border border-line bg-white text-primary lg:hidden"
            aria-label="باز کردن منو"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>
    </>
  );
}
