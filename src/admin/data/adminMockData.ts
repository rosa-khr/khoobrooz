import {
  BadgeCheck,
  BookOpenText,
  ChartColumnIncreasing,
  Braces,
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

export type AdminNewsItem = AdminArticleItem;

export type AdminSidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
};

export type AdminApiServiceAction = {
  id: number;
  name: "loadPage" | "find" | "add" | "update" | "delete" | "approve" | "publish" | "sync" | "submit";
  title: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  scope: "Public" | "Admin";
  input: string;
  output: string;
  status: "active" | "planned";
};

export type AdminApiServiceGroup = {
  id: number;
  serviceName: string;
  title: string;
  description: string;
  actions: AdminApiServiceAction[];
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

export const apiServiceGroups: AdminApiServiceGroup[] = [
  {
    id: 1,
    serviceName: "MenuService",
    title: "مدیریت منوها",
    description: "سرویس‌های لازم برای ساخت منو، زیرمنو تا سه سطح، URL و فیلدهای SEO.",
    actions: [
      {
        id: 101,
        name: "loadPage",
        title: "لیست منوها",
        method: "GET",
        path: "/api/admin/menus",
        scope: "Admin",
        input: "Query اختیاری: page، limit، parentId، accuracy، isPublished",
        output: "لیست منوها همراه با pagination، parentTitle، level، seoTitle و audit fields.",
        status: "planned"
      },
      {
        id: 102,
        name: "find",
        title: "جزئیات منو",
        method: "GET",
        path: "/api/admin/menus/{id}",
        scope: "Admin",
        input: "id منو",
        output: "یک رکورد منو همراه با زیرمنوها، SEO و وضعیت انتشار.",
        status: "planned"
      },
      {
        id: 103,
        name: "add",
        title: "ایجاد منو",
        method: "POST",
        path: "/api/admin/menus",
        scope: "Admin",
        input: "title، url، parentId، seoTitle، seoDescription، accuracy، isPublished",
        output: "رکورد منوی ایجاد شده همراه با id و createDate.",
        status: "planned"
      },
      {
        id: 104,
        name: "update",
        title: "ویرایش منو",
        method: "PUT",
        path: "/api/admin/menus/{id}",
        scope: "Admin",
        input: "id و فیلدهای قابل ویرایش منو",
        output: "رکورد بروزرسانی شده همراه با modifyUser و modifyDate.",
        status: "planned"
      },
      {
        id: 105,
        name: "delete",
        title: "حذف منطقی منو",
        method: "DELETE",
        path: "/api/admin/menus/{id}",
        scope: "Admin",
        input: "id منو",
        output: "تغییر accuracy به TRASHED = 2 بدون حذف فیزیکی رکورد.",
        status: "planned"
      }
    ]
  },
  {
    id: 2,
    serviceName: "MarketRateService",
    title: "نرخ‌ها و برد بازار",
    description: "سرویس‌های نمایش نرخ ارز، طلا، سکه، نفت و ابزارهای بازار و sync منبع خارجی.",
    actions: [
      {
        id: 201,
        name: "loadPage",
        title: "برد نرخ‌های بازار",
        method: "GET",
        path: "/api/v1/market-rates/board",
        scope: "Public",
        input: "بدون ورودی",
        output: "لیست نرخ‌های خلاصه برای نوار بازار: بورس، انس طلا، مثقال، طلا، سکه، دلار، یورو، نفت برنت و بیت کوین.",
        status: "active"
      },
      {
        id: 202,
        name: "loadPage",
        title: "لیست نرخ‌های رسمی و کاربردی",
        method: "GET",
        path: "/api/v1/market-rates",
        scope: "Public",
        input: "Query اختیاری: group، source، limit",
        output: "لیست ابزارهای ارزی، فلزات و سکه‌های مجاز همراه با آخرین قیمت و زمان بروزرسانی.",
        status: "active"
      },
      {
        id: 203,
        name: "sync",
        title: "همگام‌سازی نرخ‌ها",
        method: "POST",
        path: "/api/admin/market-rates/sync",
        scope: "Admin",
        input: "sourceKey و syncMode؛ اجرای زمان‌بندی روزانه ساعت ۹ و ۱۵ ایران.",
        output: "گزارش sync شامل تعداد آیتم‌های خوانده‌شده، ذخیره‌شده و خطاها.",
        status: "planned"
      }
    ]
  },
  {
    id: 3,
    serviceName: "ArticleService",
    title: "مقالات",
    description: "سرویس‌های لیست، جزئیات، CRUD، تایید و انتشار مقاله‌ها.",
    actions: [
      {
        id: 301,
        name: "loadPage",
        title: "لیست مقاله‌ها",
        method: "GET",
        path: "/api/v1/articles",
        scope: "Public",
        input: "Query اختیاری: category، tag، page، limit",
        output: "لیست مقاله‌های approve و published شده همراه با اطلاعات SEO و pagination.",
        status: "planned"
      },
      {
        id: 302,
        name: "find",
        title: "جزئیات مقاله",
        method: "GET",
        path: "/api/v1/articles/{slug}",
        scope: "Public",
        input: "slug مقاله",
        output: "مقاله کامل همراه با tags، category، seoTitle، seoDescription و publishDate.",
        status: "planned"
      },
      {
        id: 303,
        name: "approve",
        title: "تایید مقاله",
        method: "POST",
        path: "/api/admin/articles/{article}/approve",
        scope: "Admin",
        input: "approve: boolean",
        output: "وضعیت تایید مقاله، modifyUser و modifyDate.",
        status: "planned"
      },
      {
        id: 304,
        name: "publish",
        title: "انتشار مقاله",
        method: "POST",
        path: "/api/admin/articles/{article}/publish",
        scope: "Admin",
        input: "isPublished: boolean و publishDate اختیاری",
        output: "وضعیت انتشار مقاله و زمان انتشار.",
        status: "planned"
      }
    ]
  },
  {
    id: 4,
    serviceName: "ContactRequestService",
    title: "درخواست‌های تماس",
    description: "ثبت و پیگیری درخواست‌های عمومی، مشاوره و امور گمرکی.",
    actions: [
      {
        id: 401,
        name: "submit",
        title: "ثبت درخواست تماس",
        method: "POST",
        path: "/api/v1/contact-requests",
        scope: "Public",
        input: "name، phone، subject، message، serviceKey",
        output: "شماره پیگیری و وضعیت ثبت درخواست.",
        status: "planned"
      },
      {
        id: 402,
        name: "loadPage",
        title: "لیست درخواست‌ها",
        method: "GET",
        path: "/api/admin/contact-requests",
        scope: "Admin",
        input: "Query اختیاری: page، status، serviceKey، accuracy",
        output: "لیست درخواست‌ها همراه با وضعیت رسیدگی و اطلاعات تماس.",
        status: "planned"
      }
    ]
  }
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

export const newsRows: AdminNewsItem[] = [
  {
    id: 201,
    title: "آخرین تغییرات ثبت سفارش واردات",
    category: "واردات",
    slug: "import-order-latest-updates",
    seoTitle: "تغییرات ثبت سفارش واردات",
    approve: false,
    isPublished: false,
    accuracy: 0,
    scheduledAt: null,
    modifiedAt: "۱۴۰۵/۰۳/۲۹"
  },
  {
    id: 202,
    title: "روند جدید بررسی اسناد گمرکی",
    category: "ترخیص کالا",
    slug: "customs-document-review-flow",
    seoTitle: "بررسی اسناد گمرکی",
    approve: false,
    isPublished: false,
    accuracy: 0,
    scheduledAt: "۱۴۰۵/۰۴/۰۱",
    modifiedAt: "۱۴۰۵/۰۳/۲۹"
  },
  {
    id: 203,
    title: "به‌روزرسانی نرخ‌های مرجع تجاری",
    category: "بازار و ارز",
    slug: "trade-reference-rates-update",
    seoTitle: "به‌روزرسانی نرخ‌های تجاری",
    approve: true,
    isPublished: true,
    accuracy: 1,
    scheduledAt: null,
    modifiedAt: "۱۴۰۵/۰۳/۲۸"
  }
];

export const pendingArticleRows = articleRows.filter((item) => !item.approve);
export const pendingNewsRows = newsRows.filter((item) => !item.approve);
