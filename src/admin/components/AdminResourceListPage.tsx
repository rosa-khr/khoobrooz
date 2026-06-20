"use client";

import { AdminDataGrid } from "@/admin/components/AdminDataGrid";
import { AdminShell } from "@/admin/components/AdminShell";
import { articleRows, menuRows, newsRows } from "@/admin/data/adminMockData";

type AdminResourceListPageProps = {
  resource: string;
};

const resourceCopy: Record<string, { title: string; description: string; label: string }> = {
  menus: {
    title: "مدیریت منوها",
    description: "لیست منوها، زیرمنوها، URL، عنوان SEO و وضعیت انتشار.",
    label: "Navigation"
  },
  articles: {
    title: "مدیریت مقالات",
    description: "مقالات، زمان‌بندی، تایید، انتشار و فیلدهای SEO.",
    label: "Articles"
  },
  news: {
    title: "مدیریت خبرها",
    description: "خبرها، تایید محتوایی، انتشار و زمان‌بندی نمایش.",
    label: "News"
  },
  tags: {
    title: "مدیریت تگ‌ها",
    description: "تگ‌های قابل استفاده در مقاله‌ها و خبرها.",
    label: "Tags"
  },
  users: {
    title: "مدیریت کاربران",
    description: "کاربران سایت و اطلاعات پایه حساب‌ها.",
    label: "Users"
  },
  countries: {
    title: "مدیریت کشورها",
    description: "کشورهای قابل استفاده در dropdownها و سرویس‌های تجاری.",
    label: "Countries"
  },
  "world-clocks": {
    title: "مدیریت ساعت جهانی",
    description: "شهرها و کشورهایی که ساعت آن‌ها در سایت نمایش داده می‌شود.",
    label: "World Clock"
  },
  reports: {
    title: "گزارش‌ها",
    description: "گزارش‌های SEO، سرچ کنسول، آنالیتیکس و بازدید.",
    label: "Reports"
  },
  settings: {
    title: "تنظیمات",
    description: "تنظیمات عمومی سایت و پنل مدیریت.",
    label: "Settings"
  }
};

export function AdminResourceListPage({ resource }: AdminResourceListPageProps) {
  const copy = resourceCopy[resource] ?? resourceCopy.reports;

  return (
    <AdminShell>
      <div className="admin-content">
        <section className="admin-page-heading">
          <span>{copy.label}</span>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
        </section>

        {resource === "menus" ? (
          <AdminDataGrid description={copy.description} kind="menus" rows={menuRows} title={copy.title} />
        ) : null}

        {resource === "articles" ? (
          <AdminDataGrid description={copy.description} kind="articles" rows={articleRows} title={copy.title} />
        ) : null}

        {resource === "news" ? (
          <AdminDataGrid description={copy.description} kind="news" rows={newsRows} title={copy.title} />
        ) : null}

        {!["menus", "articles", "news"].includes(resource) ? (
          <section className="admin-empty-state">
            <strong>{copy.title}</strong>
            <p>لیست این بخش در مرحله بعدی به CRUD اختصاصی خودش وصل می‌شود.</p>
          </section>
        ) : null}
      </div>
    </AdminShell>
  );
}
