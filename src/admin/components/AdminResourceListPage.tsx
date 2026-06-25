"use client";

import { AdminDataGrid } from "@/admin/components/AdminDataGrid";
import { AdminShell } from "@/admin/components/AdminShell";
import { apiServiceGroups, articleRows, menuRows, newsRows } from "@/admin/data/adminMockData";

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
  "api-services": {
    title: "سرویس‌های API",
    description: "قرارداد سرویس‌های بک‌اند، ورودی‌ها، خروجی‌ها و وضعیت پیاده‌سازی هر endpoint.",
    label: "Swagger / OpenAPI"
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

        {resource === "api-services" ? (
          <section className="admin-service-catalog" aria-label="لیست سرویس‌های API">
            {apiServiceGroups.map((group) => (
              <article className="admin-service-collection" dir="ltr" key={group.id}>
                <div className="admin-service-collection-heading">
                  <span>Collection</span>
                  <h2>{group.serviceName}</h2>
                  <p>{group.title}</p>
                </div>
                <div className="admin-service-actions">
                  {group.actions.map((service) => (
                    <details className="admin-service-action" key={service.id}>
                      <summary className="admin-service-summary">
                        <span className={`admin-method-badge admin-method-${service.method.toLowerCase()}`}>{service.method}</span>
                        <div>
                          <strong>{service.name}</strong>
                          <small>{service.title}</small>
                          <code>{service.path}</code>
                        </div>
                        <span className={service.status === "active" ? "admin-service-status active" : "admin-service-status"}>{service.status === "active" ? "Active" : "Planned"}</span>
                      </summary>
                      <div className="admin-service-meta">
                        <span>{service.scope}</span>
                        <span>{group.description}</span>
                      </div>
                      <div className="admin-service-contract">
                        <div>
                          <strong>Request</strong>
                          <pre>{JSON.stringify({ input: service.input }, null, 2)}</pre>
                        </div>
                        <div>
                          <strong>Response</strong>
                          <pre>{JSON.stringify({ output: service.output }, null, 2)}</pre>
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              </article>
            ))}
          </section>
        ) : null}

        {!["menus", "articles", "news", "api-services"].includes(resource) ? (
          <section className="admin-empty-state">
            <strong>{copy.title}</strong>
            <p>لیست این بخش در مرحله بعدی به CRUD اختصاصی خودش وصل می‌شود.</p>
          </section>
        ) : null}
      </div>
    </AdminShell>
  );
}
