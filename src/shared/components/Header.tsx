"use client";

import Link from "next/link";
import { ChevronDown, Instagram, Linkedin, Mail, Menu, MessageCircle, MessageSquareText, Phone, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Locale, contact } from "@/core/lib/site";
import { localizedNavigation } from "@/data/navigation";
import { Button } from "@/shared/components/Button";
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

export function Header({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const nav = localizedNavigation(locale);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      <div className="border-b border-white/10 bg-[#061325] text-blue-50">
        <div className="container flex min-h-9 items-center justify-center overflow-hidden">
          <HeaderDateWidget now={now} />
        </div>
      </div>
      <div className="bg-primary text-sm text-blue-50">
        <div className="container flex min-h-10 items-center justify-between gap-4">
          <span className="truncate">خدمات بازرگانی، ترخیص کالا، واردات و صادرات</span>
          <div className="hidden items-center gap-2 text-blue-100 md:flex">
            <a className="inline-flex min-h-8 items-center gap-1.5 rounded-[4px] border border-white/15 bg-white/10 px-2.5 font-mono text-xs font-black text-[#ffe4a8] transition hover:border-accent hover:bg-white/15" href={contact.clearancePhoneUrl} dir="ltr">
              <Phone className="size-4" aria-hidden="true" />
              {contact.clearancePhone}
            </a>
            <div className="group relative">
              <button
                type="button"
                className="inline-flex min-h-8 items-center gap-1.5 rounded-[4px] border border-white/15 bg-white/5 px-2.5 text-xs font-bold text-blue-50 transition hover:border-accent hover:bg-white/10"
              >
                <MessageCircle className="size-4 text-accent" aria-hidden="true" />
                ارتباطات
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
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="container relative flex min-h-[76px] items-center justify-between gap-5">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2.5 font-black text-primary">
            <span className="grid size-10 place-items-center rounded-khoobrooz bg-primary text-accent">خ</span>
            <span className="grid leading-tight">
              خوبروز
              <small className="text-xs font-semibold text-muted">Khoobrooz Trade</small>
            </span>
          </Link>

          <nav
            className={`${
              open ? "grid" : "hidden"
            } absolute inset-x-0 top-full gap-1 rounded-khoobrooz border border-line bg-white p-3 shadow-soft lg:static lg:flex lg:items-center lg:gap-1 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
          >
            {nav.map((item) => (
              <div key={`${item.href}-${item.label}`} className="group relative">
                <Link
                  href={item.href}
                  className="flex items-center justify-between gap-1 rounded-khoobrooz px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 lg:justify-start"
                >
                  {item.label}
                  {item.children && <ChevronDown className="size-4 text-muted transition group-hover:rotate-180" aria-hidden="true" />}
                </Link>

                {item.children && (
                  <div className="grid gap-1 border-r border-line pr-3 lg:invisible lg:absolute lg:right-0 lg:top-full lg:z-50 lg:w-80 lg:translate-y-2 lg:border-0 lg:p-0 lg:opacity-0 lg:shadow-soft lg:transition lg:group-hover:visible lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                    <div className="grid gap-1 rounded-khoobrooz bg-white lg:border lg:border-line lg:p-2">
                      {item.children.map((child) => (
                        <Link
                          key={`${child.href}-${child.label}`}
                          href={child.href}
                          className="rounded-khoobrooz px-3 py-2 text-sm hover:bg-slate-100"
                        >
                          <span className="block font-extrabold text-primary">{child.label}</span>
                          {child.description && <span className="mt-0.5 block text-xs leading-6 text-muted">{child.description}</span>}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <span className="rounded-khoobrooz border border-line bg-white px-3 py-2 text-sm text-primary">FA</span>
            <Button href={contact.generalWhatsappUrl}>دریافت مشاوره</Button>
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
