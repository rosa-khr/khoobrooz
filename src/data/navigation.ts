import { Locale, localizedPath } from "@/core/lib/site";
import { getDictionary } from "@/data/i18n";

export type NavigationItem = {
  label: string;
  href: string;
  description?: string;
  children?: NavigationItem[];
};

export const navigation: NavigationItem[] = [
  {
    label: "خدمات",
    href: "/services",
    children: [
      { label: "خرید از چین", href: "/buy-from-china", description: "خرید، تامین و پیگیری سفارش از چین" },
      { label: "ترخیص کالا", href: "/services/customs-clearance", description: "بررسی مسیر ترخیص، اسناد و امور گمرکی" },
      { label: "حواله‌های ارزی", href: "/services/currency-transfer", description: "هماهنگی حواله برای پرداخت‌های تجاری" },
      { label: "ثبت سفارش واردات", href: "/services/import-registration", description: "پیگیری مسیر ثبت سفارش واردات" },
      { label: "حمل بین‌المللی", href: "/services/international-shipping", description: "هماهنگی حمل و لجستیک بین‌المللی" },
      { label: "خدمات صادرات", href: "/services/export-services", description: "مسیر خدماتی صادرات کالا" }
    ]
  },
  {
    label: "واردات از چین",
    href: "/import-from-china",
    children: [
      { label: "مراحل واردات از چین", href: "/import-from-china/steps", description: "مسیر واردات، مدارک و هماهنگی سفارش" },
      { label: "حمل کالا از چین", href: "/import-from-china/shipping", description: "مسیر حمل و لجستیک از چین" },
      { label: "ثبت سفارش واردات", href: "/import-from-china/order-registration", description: "پیش‌نیازها و مدارک ثبت سفارش" }
    ]
  },
  {
    label: "حواله‌های ارزی",
    href: "/currency-transfer",
    children: [
      { label: "حواله تتر", href: "/currency-transfer/tether", description: "انتقال تتر برای پرداخت‌های تجاری" },
      { label: "حواله دلار", href: "/currency-transfer/dollar", description: "حواله دلار برای پرداخت‌های تجاری" },
      { label: "حواله یوان", href: "/currency-transfer/yuan", description: "پرداخت RMB برای خرید و واردات از چین" },
      { label: "حواله لیر", href: "/currency-transfer/lira", description: "حواله لیر برای پرداخت‌های تجاری" },
      { label: "حواله درهم", href: "/currency-transfer/aed", description: "حواله درهم برای پرداخت‌های تجاری" }
    ]
  },
  {
    label: "دانشنامه تجاری",
    href: "/trade-encyclopedia",
    children: [
      { label: "گمرک", href: "/trade-encyclopedia/customs", description: "مفاهیم آموزشی گمرکی" },
      {
        label: "اسناد تجاری",
        href: "/trade-encyclopedia/commercial-documents",
        description: "اسناد رایج خرید، واردات و صادرات",
        children: [
          { label: "پروفرما", href: "/trade-encyclopedia/commercial-documents/proforma", description: "پیش‌فاکتور خرید خارجی" },
          { label: "پروفرما اینویس", href: "/trade-encyclopedia/commercial-documents/proforma-invoice", description: "سند پایه توافق خرید خارجی" },
          { label: "اینویس تجاری", href: "/trade-encyclopedia/commercial-documents/commercial-invoice", description: "فاکتور تجاری واردات و صادرات" },
          { label: "پکینگ لیست", href: "/trade-encyclopedia/commercial-documents/packing-list", description: "فهرست بسته‌بندی کالا" },
          { label: "بارنامه", href: "/trade-encyclopedia/commercial-documents/bill-of-lading", description: "سند حمل کالا" },
          { label: "گواهی مبدأ", href: "/trade-encyclopedia/commercial-documents/certificate-of-origin", description: "سند کشور مبدأ کالا" },
          { label: "گواهی بازرسی", href: "/trade-encyclopedia/commercial-documents/inspection-certificate", description: "سند کنترل و بازرسی کالا" },
          { label: "اظهارنامه گمرکی", href: "/trade-encyclopedia/commercial-documents/customs-declaration", description: "سند اظهار کالا به گمرک" },
          { label: "مجوزهای واردات و صادرات", href: "/trade-encyclopedia/commercial-documents/import-export-permits", description: "مجوزهای لازم برای تجارت خارجی" }
        ]
      },
      { label: "اینکوترمز", href: "/trade-encyclopedia/incoterms", description: "قواعد حمل و تحویل کالا" },
      { label: "انگلیسی تجاری", href: "/trade-encyclopedia/business-english", description: "اصطلاحات و مکاتبات تجاری" },
      { label: "حمل‌ونقل بین‌المللی", href: "/trade-encyclopedia/international-shipping", description: "روش‌های حمل و مفاهیم لجستیک" },
      { label: "امور ارزی", href: "/trade-encyclopedia/foreign-exchange", description: "مفاهیم ارزی در تجارت خارجی" },
      { label: "اصطلاحات بازرگانی", href: "/trade-encyclopedia/trade-terms", description: "واژه‌ها و اصطلاحات کاربردی تجارت" }
    ]
  },
  {
    label: "اخبار تجارت",
    href: "/trade-news",
    children: [
      { label: "اخبار گمرک", href: "/trade-news/customs-news", description: "خبرهای گمرکی و رویه‌های اجرایی" },
      { label: "اخبار واردات", href: "/trade-news/import-news", description: "خبرهای واردات کالا و ثبت سفارش" },
      { label: "اخبار صادرات", href: "/trade-news/export-news", description: "خبرهای صادرات کالا و بازارهای هدف" },
      { label: "تجارت با چین", href: "/trade-news/china-trade", description: "خبرهای تجارت ایران و چین" },
      { label: "تجارت با اوراسیا", href: "/trade-news/eurasia-trade", description: "خبرهای تجارت با اتحادیه اوراسیا" },
      { label: "تجارت آسیا", href: "/trade-news/asia-trade", description: "خبرهای تجارت با کشورهای آسیایی" },
      { label: "حمل و لجستیک", href: "/trade-news/shipping-logistics", description: "خبرهای حمل‌ونقل و زنجیره تامین" }
    ]
  },
  { label: "بخشنامه‌های گمرکی", href: "/trade-circulars/customs-circulars" },
  {
    label: "ارتباط با خوبروز",
    href: "/contact",
    children: [
      { label: "تماس با ما", href: "/contact", description: "واتساپ، شبکه‌های اجتماعی و مسیرهای تماس" },
      { label: "درباره خوبروز", href: "/about", description: "جایگاه برند، رویکرد و ارزش‌های خوبروز" },
      { label: "سوالات متداول", href: "/faq", description: "پاسخ سوال‌های رایج درباره خدمات" }
    ]
  }
];

export function localizedNavigation(locale: Locale) {
  const navigation = getDictionary(locale).nav;
  const localizeItem = (item: NavigationItem): NavigationItem => ({
    ...item,
    href: localizedPath(locale, item.href),
    children: item.children?.map(localizeItem)
  });

  return navigation.map(localizeItem);
}
