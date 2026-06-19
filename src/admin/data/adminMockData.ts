import {
  BadgeCheck,
  BookOpenText,
  ChartColumnIncreasing,
  Clock3,
  FileText,
  Globe2,
  LayoutDashboard,
  Link2,
  Newspaper,
  ShieldCheck,
  Tags,
  Users
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Accuracy = 0 | 1 | 2;

export type AdminMenuItem = {
  id: number;
  title: string;
  parentTitle: string | null;
  url: string;
  seoTitle: string;
  level: 1 | 2 | 3;
  isPublished: boolean;
  accuracy: Accuracy;
  modifiedAt: string;
};

export type AdminArticleItem = {
  id: number;
  title: string;
  category: string;
  slug: string;
  seoTitle: string;
  approve: boolean;
  isPublished: boolean;
  accuracy: Accuracy;
  scheduledAt: string | null;
  modifiedAt: string;
};

export type AdminSidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
};

export const adminSidebar: AdminSidebarItem[] = [
  { label: "داشبوردها", href: "/admin", icon: LayoutDashboard, active: true },
  { label: "منوها", href: "/admin/menus/list", icon: Link2 },
  { label: "مقالات", href: "/admin/articles/list", icon: BookOpenText },
  { label: "خبرها", href: "/admin/news/list", icon: Newspaper },
  { label: "تگ‌ها", href: "/admin/tags/list", icon: Tags },
  { label: "کاربران", href: "/admin/users/list", icon: Users },
  { label: "کشورها", href: "/admin/countries/list", icon: Globe2 },
  { label: "ساعت جهانی", href: "/admin/world-clocks/list", icon: Clock3 },
  { label: "گزارش‌ها", href: "/admin/reports/list", icon: ChartColumnIncreasing },
  { label: "تنظیمات", href: "/admin/settings/list", icon: ShieldCheck }
];

export const adminStats = [
  { label: "مقاله‌های منتشر شده", value: "۳۸", detail: "محتوای فعال سایت", tone: "navy" },
  { label: "خبرهای منتشر شده", value: "۲۶", detail: "خبرهای قابل نمایش", tone: "amber" },
  { label: "مقاله‌های منتشر نشده", value: "۱۲", detail: "نیازمند بررسی SEO", tone: "gray" },
  { label: "خبرهای منتشر نشده", value: "۷", detail: "در انتظار انتشار", tone: "steel" }
];

export const adminQuickActions = [
  { label: "مقاله جدید", icon: FileText },
  { label: "تایید محتوا", icon: BadgeCheck },
  { label: "تنظیم SEO", icon: ShieldCheck }
];

export const dashboardContentFlow = [
  { label: "فروردین", articles: 14, news: 6 },
  { label: "اردیبهشت", articles: 18, news: 8 },
  { label: "خرداد", articles: 24, news: 11 },
  { label: "تیر", articles: 20, news: 9 },
  { label: "مرداد", articles: 28, news: 13 },
  { label: "شهریور", articles: 31, news: 12 }
];

export const dashboardPublishStatus = [
  { label: "منتشر شده", value: 64, color: "#07172b" },
  { label: "پیش‌نویس", value: 22, color: "#8a95a3" },
  { label: "زمان‌بندی شده", value: 8, color: "#f4b23e" }
];

export const dashboardSeoMetrics = [
  { label: "کل بازدیدها", value: "۱۲.۴K", detail: "۳۰ روز اخیر" },
  { label: "کلیک سرچ", value: "۳.۸K", detail: "Google Search" },
  { label: "CTR", value: "۴.۶٪", detail: "میانگین ورودی ارگانیک" },
  { label: "صفحات نیازمند محتوا", value: "۹", detail: "فرصت تولید مقاله" }
];

export const menuRows: AdminMenuItem[] = [
  {
    id: 1,
    title: "خانه",
    parentTitle: null,
    url: "/",
    seoTitle: "خوبروز | خدمات بازرگانی و ترخیص",
    level: 1,
    isPublished: true,
    accuracy: 1,
    modifiedAt: "۱۴۰۵/۰۳/۲۹"
  },
  {
    id: 2,
    title: "خدمات",
    parentTitle: null,
    url: "/services",
    seoTitle: "خدمات بازرگانی، واردات و صادرات",
    level: 1,
    isPublished: true,
    accuracy: 1,
    modifiedAt: "۱۴۰۵/۰۳/۲۹"
  },
  {
    id: 3,
    title: "ترخیص کالا",
    parentTitle: "خدمات",
    url: "/services/customs-clearance",
    seoTitle: "مشاوره امور گمرکی و ترخیص کالا",
    level: 2,
    isPublished: true,
    accuracy: 1,
    modifiedAt: "۱۴۰۵/۰۳/۲۹"
  },
  {
    id: 4,
    title: "دانشنامه تجارت",
    parentTitle: "آموزش و دانشنامه",
    url: "/knowledge",
    seoTitle: "دانشنامه تجارت خارجی",
    level: 2,
    isPublished: false,
    accuracy: 0,
    modifiedAt: "۱۴۰۵/۰۳/۲۸"
  },
  {
    id: 5,
    title: "تماس با ما",
    parentTitle: "خوبروز",
    url: "/contact",
    seoTitle: "تماس با خوبروز",
    level: 2,
    isPublished: true,
    accuracy: 1,
    modifiedAt: "۱۴۰۵/۰۳/۲۷"
  }
];

export const articleRows: AdminArticleItem[] = [
  {
    id: 101,
    title: "مراحل اولیه ترخیص کالا برای واردکننده",
    category: "ترخیص کالا",
    slug: "customs-clearance-first-steps",
    seoTitle: "مراحل ترخیص کالا برای واردکننده",
    approve: true,
    isPublished: true,
    accuracy: 1,
    scheduledAt: null,
    modifiedAt: "۱۴۰۵/۰۳/۲۹"
  },
  {
    id: 102,
    title: "تفاوت نرخ ارز رسمی و نرخ بازار در برآورد تجاری",
    category: "بازار و ارز",
    slug: "official-rate-vs-market-rate",
    seoTitle: "تفاوت نرخ ارز رسمی و بازار",
    approve: false,
    isPublished: false,
    accuracy: 0,
    scheduledAt: "۱۴۰۵/۰۴/۰۱",
    modifiedAt: "۱۴۰۵/۰۳/۲۹"
  },
  {
    id: 103,
    title: "مدارک رایج در ثبت سفارش واردات",
    category: "واردات",
    slug: "import-order-documents",
    seoTitle: "مدارک ثبت سفارش واردات",
    approve: false,
    isPublished: false,
    accuracy: 0,
    scheduledAt: null,
    modifiedAt: "۱۴۰۵/۰۳/۲۸"
  },
  {
    id: 104,
    title: "اصطلاحات پایه حمل دریایی",
    category: "حمل بین‌المللی",
    slug: "sea-freight-basic-terms",
    seoTitle: "اصطلاحات حمل دریایی",
    approve: true,
    isPublished: false,
    accuracy: 1,
    scheduledAt: "۱۴۰۵/۰۴/۰۲",
    modifiedAt: "۱۴۰۵/۰۳/۲۷"
  }
];
