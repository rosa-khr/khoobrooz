export const defaultLocale = "fa";
export const locales = ["fa", "en", "ar", "ru", "zh"] as const;

export type Locale = (typeof locales)[number];

export const contact = {
  generalWhatsapp: "09103060396",
  generalWhatsappIntl: "+989103060396",
  generalWhatsappUrl: "https://wa.me/989103060396",
  generalPhoneUrl: "tel:+989103060396",
  clearancePhone: "09124174031",
  clearancePhoneIntl: "+989124174031",
  clearancePhoneUrl: "tel:+989124174031",
  email: "info@khoorooz.com",
  emailUrl: "mailto:info@khoorooz.com",
  baleName: "khoobrooz",
  baleUrl: "https://ble.ir/khoobrooz",
  linkedinName: "khoobrooz.trade",
  linkedinUrl: "https://www.linkedin.com/company/khoobrooz.trade",
  instagramName: "khoobrooz.ir",
  instagramUrl: "https://www.instagram.com/khoobrooz.ir",
  telegramName: "khoobrooz",
  telegramUrl: "https://t.me/khoobrooz"
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function localizedPath(locale: Locale, path = "/") {
  const cleanPath = path === "/" ? "" : path;
  return `/${locale}${cleanPath}`;
}
