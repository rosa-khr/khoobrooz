"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminDataGrid } from "@/admin/components/AdminDataGrid";
import { AdminShell } from "@/admin/components/AdminShell";
import { loadAdminPage, loadApiServiceCatalog, type AdminApiServiceGroup, type AdminGridRecord, type AdminResource } from "@/admin/lib/adminApi";

type AdminResourceListPageProps = {
  resource: string;
};

const resourceCopy: Record<string, { title: string; description: string; label: string }> = {
  categories: {
    title: "مدیریت دسته‌بندی‌ها",
    description: "دسته‌بندی‌های ساختار سایت، خدمات، دانشنامه، اخبار و بخشنامه‌ها با ساختار والد و فرزند.",
    label: "Categories"
  },
  pages: {
    title: "مدیریت صفحات",
    description: "صفحات اصلی، لندینگ‌ها و routeهایی که محتوایشان بعداً از پنل تکمیل می‌شود.",
    label: "Pages"
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
  "content-sources": {
    title: "مدیریت منابع و ورودی اخبار",
    description: "منابع RSS، Atom، API، Scraper و دستی برای پایش اخبار تجارت و بخشنامه‌ها.",
    label: "Content Sources"
  },
  "source-items": {
    title: "اخبار ورودی",
    description: "صف بررسی اخبار و بخشنامه‌های دریافت‌شده؛ هیچ موردی بدون تایید مدیر منتشر نمی‌شود.",
    label: "Incoming News"
  },
  tags: {
    title: "مدیریت تگ‌ها",
    description: "تگ‌های قابل استفاده در مقاله‌ها و خبرها.",
    label: "Tags"
  },
  services: {
    title: "مدیریت خدمات",
    description: "لیست خدمات سایت با عنوان، آدرس انگلیسی و وضعیت.",
    label: "Services"
  },
  users: {
    title: "مدیریت کاربران",
    description: "کاربران سایت و اطلاعات پایه حساب‌ها.",
    label: "Users"
  },
  "world-clocks": {
    title: "مدیریت ساعت جهانی",
    description: "حداکثر ۶ کشور/پایتخت برای نمایش کارت‌های ساعت جهانی.",
    label: "World Clock"
  },
  "api-services": {
    title: "سرویس‌های API",
    description: "قرارداد سرویس‌های بک‌اند، ورودی‌ها، خروجی‌ها و وضعیت پیاده‌سازی هر endpoint.",
    label: "Service Catalog"
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
  const gridResource = ["categories", "pages", "services", "articles", "news", "tags", "world-clocks", "content-sources", "source-items"].includes(resource) ? resource as AdminResource : null;
  const [rows, setRows] = useState<AdminGridRecord[]>([]);
  const [serviceGroups, setServiceGroups] = useState<AdminApiServiceGroup[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(gridResource));
  const [error, setError] = useState<string | null>(null);

  const refreshRows = useCallback(() => {
    if (!gridResource) {
      return Promise.resolve();
    }

    setIsLoading(true);
    setError(null);

    return loadAdminPage(gridResource)
      .then(({ response: { items } }) => {
        setRows(items);
      })
      .catch((reason: unknown) => {
        setRows([]);
        setError(reason instanceof Error ? reason.message : "Load page failed.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [gridResource]);

  useEffect(() => {
    let ignore = false;

    if (resource !== "api-services") {
      setServiceGroups([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    loadApiServiceCatalog()
      .then(({ response: { items } }) => {
        if (!ignore) {
          setServiceGroups(items);
        }
      })
      .catch((reason: unknown) => {
        if (!ignore) {
          setServiceGroups([]);
          setError(reason instanceof Error ? reason.message : "Load service catalog failed.");
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [resource]);

  useEffect(() => {
    let ignore = false;

    if (!gridResource) {
      setRows([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    loadAdminPage(gridResource)
      .then(({ response: { items } }) => {
        if (!ignore) {
          setRows(items);
        }
      })
      .catch((reason: unknown) => {
        if (!ignore) {
          setRows([]);
          setError(reason instanceof Error ? reason.message : "Load page failed.");
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [gridResource]);

  return (
    <AdminShell>
      <div className="admin-content">
        <section className="admin-page-heading">
          <span>{copy.label}</span>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
        </section>

        {gridResource ? (
          <>
            {isLoading ? <section className="admin-empty-state"><strong>در حال دریافت داده...</strong><p>اطلاعات از سرویس بک‌اند خوانده می‌شود.</p></section> : null}
            {error ? <section className="admin-empty-state"><strong>خطا در دریافت داده</strong><p>{error}</p></section> : null}
            {!isLoading && !error ? <AdminDataGrid description={copy.description} kind={gridResource} onChanged={refreshRows} rows={rows} title={copy.title} /> : null}
          </>
        ) : null}

        {resource === "api-services" ? (
          <>
            {isLoading ? <section className="admin-empty-state"><strong>در حال دریافت سرویس‌ها...</strong><p>کاتالوگ سرویس‌ها از بک‌اند خوانده می‌شود.</p></section> : null}
            {error ? <section className="admin-empty-state"><strong>خطا در دریافت سرویس‌ها</strong><p>{error}</p></section> : null}
            {!isLoading && !error ? (
              <section className="admin-service-catalog" aria-label="لیست سرویس‌های API">
                {serviceGroups.map((group) => (
                  <details className="admin-service-collection" dir="ltr" key={group.id} open>
                    <summary className="admin-service-collection-heading">
                      <div>
                        <span>Collection</span>
                        <h2>{group.serviceName}</h2>
                        <p>{group.title}</p>
                      </div>
                      <small>{group.actions.length} services</small>
                    </summary>
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
                              <pre>{JSON.stringify(service.request, null, 2)}</pre>
                            </div>
                            <div>
                              <strong>Response</strong>
                              <pre>{JSON.stringify(service.response, null, 2)}</pre>
                            </div>
                          </div>
                        </details>
                      ))}
                    </div>
                  </details>
                ))}
              </section>
            ) : null}
          </>
        ) : null}

        {!["categories", "pages", "services", "articles", "news", "tags", "world-clocks", "content-sources", "source-items", "api-services"].includes(resource) ? (
          <section className="admin-empty-state">
            <strong>{copy.title}</strong>
            <p>لیست این بخش در مرحله بعدی به CRUD اختصاصی خودش وصل می‌شود.</p>
          </section>
        ) : null}
      </div>
    </AdminShell>
  );
}
