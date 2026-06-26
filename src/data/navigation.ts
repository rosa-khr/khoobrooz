import { Locale, localizedPath } from "@/core/lib/site";
import { getDictionary } from "@/data/i18n";

export type NavigationItem = {
  label: string;
  href: string;
  description?: string;
  children?: NavigationItem[];
};

export const navigation: NavigationItem[] = [
  { label: "خانه", href: "/" },
  {
    label: "خدمات",
    href: "/services",
    children: [
      {
        label: "ترخیص کالا",
        href: "/services/customs-clearance",
        description: "بررسی مدارک، مراحل و مسیر تماس اختصاصی ترخیص"
      },
      {
        label: "حواله یوآن چین",
        href: "/services/yuan-transfer",
        description: "پرداخت RMB برای سفارش‌های وارداتی و خرید از چین"
      },
      {
        label: "ثبت سفارش واردات",
        href: "/services",
        description: "مسیر ثبت سفارش کالا و پیش‌نیازهای واردات"
      },
      {
        label: "واردات کالا",
        href: "/services",
        description: "از بررسی کالا تا حمل، ثبت سفارش و ترخیص"
      },
      {
        label: "واردات از چین و کارگو",
        href: "/services",
        description: "خرید، حمل، کارگو و مسیر ترخیص کالا از چین"
      },
      {
        label: "صادرات کالا",
        href: "/services",
        description: "اسناد، مذاکره، آماده‌سازی و مسیر صادرات"
      }
    ]
  },
  {
    label: "آموزش و دانشنامه",
    href: "/knowledge",
    children: [
      {
        label: "آموزش صادرات و واردات",
        href: "/education",
        description: "مفاهیم پایه، اسناد و مراحل رایج تجارت خارجی"
      },
      {
        label: "دانشنامه تجارت",
        href: "/knowledge",
        description: "اصطلاحات گمرکی، واردات، صادرات و اسناد تجاری"
      },
      {
        label: "بخشنامه‌ها و اخبار",
        href: "/news",
        description: "اخبار و محتوای زمان‌دار تجارت و گمرک"
      }
    ]
  },
  { label: "فایل‌ها و اسناد", href: "/documents" },
  {
    label: "بازار",
    href: "/markets/currency-rates",
    children: [
      {
        label: "قیمت ارزهای رایج",
        href: "/markets/currency-rates",
        description: "جدول دلار، یورو، پوند، درهم و ارزهای پرکاربرد تجارت"
      }
    ]
  },
  {
    label: "خوبروز",
    href: "/about",
    children: [
      {
        label: "درباره خوبروز",
        href: "/about",
        description: "جایگاه برند، رویکرد و ارزش‌های خوبروز"
      },
      {
        label: "تماس با ما",
        href: "/contact",
        description: "واتساپ عمومی و مسیر اختصاصی ترخیص"
      },
      {
        label: "سوالات متداول",
        href: "/faq",
        description: "پاسخ سوال‌های رایج درباره خدمات و فایل‌ها"
      }
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
