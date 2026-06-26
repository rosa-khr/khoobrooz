import {
  BadgeCheck,
  BookOpenText,
  BriefcaseBusiness,
  ChartColumnIncreasing,
  Braces,
  Clock3,
  FileText,
  LayoutDashboard,
  Link2,
  Newspaper,
  ShieldCheck,
  Tags,
  Users
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Accuracy = 0 | 1 | 2;

export type AdminSidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
};

export const adminSidebar: AdminSidebarItem[] = [
  { label: "داشبوردها", href: "/admin", icon: LayoutDashboard, active: true },
  { label: "منوها", href: "/admin/menus/list", icon: Link2 },
  { label: "خدمات", href: "/admin/services/list", icon: BriefcaseBusiness },
  { label: "مقالات", href: "/admin/articles/list", icon: BookOpenText },
  { label: "خبرها", href: "/admin/news/list", icon: Newspaper },
  { label: "تگ‌ها", href: "/admin/tags/list", icon: Tags },
  { label: "کاربران", href: "/admin/users/list", icon: Users },
  { label: "ساعت جهانی", href: "/admin/world-clocks/list", icon: Clock3 },
  { label: "سرویس‌های API", href: "/admin/api-services/list", icon: Braces },
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
