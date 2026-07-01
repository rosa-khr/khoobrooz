export const defaultLocale = "fa";
export const locales = ["fa", "en", "ar", "ru", "zh", "tr"] as const;

export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  fa: "FA",
  en: "EN",
  ar: "AR",
  ru: "RU",
  zh: "ZH",
  tr: "TR"
};

export const localeNames: Record<Locale, string> = {
  fa: "فارسی",
  en: "English",
  ar: "العربية",
  ru: "Русский",
  zh: "中文",
  tr: "Türkçe"
};

export const localeDirections: Record<Locale, "rtl" | "ltr"> = {
  fa: "rtl",
  en: "ltr",
  ar: "rtl",
  ru: "ltr",
  zh: "ltr",
  tr: "ltr"
};

export const contact = {
  address: "تهران، بلوار آفریقا (جردن)، بالاتر از خیابان اسفندیار، خیابان انصاری (صداقت)، پلاک 1",
  generalWhatsapp: "0910 306 0306",
  generalWhatsappIntl: "+989103060306",
  generalWhatsappUrl: "https://wa.me/989103060306",
  generalPhoneUrl: "tel:+989103060306",
  clearancePhone: "0910 306 0306",
  clearancePhoneIntl: "+989103060306",
  clearancePhoneUrl: "tel:+989103060306",
  email: "info@khoobrooz.com",
  emailUrl: "mailto:info@khoobrooz.com",
  baleName: "khoobrooz_trade",
  baleUrl: "https://ble.ir/khoobrooz_trade",
  linkedinName: "khoobrooz.trade",
  linkedinUrl: "https://www.linkedin.com/company/khoobrooz.trade",
  instagramName: "khoobrooz.ir",
  instagramUrl: "https://www.instagram.com/khoobrooz.ir",
  telegramName: "khoobrooz_trade",
  telegramUrl: "https://t.me/khoobrooz_trade"
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function localizedPath(locale: Locale, path = "/") {
  const cleanPath = path === "/" ? "" : path;
  if (locale === defaultLocale) {
    return cleanPath || "/";
  }

  return `/${locale}${cleanPath}`;
}

export function stripLocaleFromPath(pathname: string) {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];

  if (isLocale(maybeLocale)) {
    const cleanPath = `/${segments.slice(2).join("/")}`.replace(/\/$/, "");
    return cleanPath || "/";
  }

  return pathname || "/";
}

export function switchLocalePath(pathname: string, locale: Locale) {
  return localizedPath(locale, stripLocaleFromPath(pathname));
}
