"use client";

import { usePathname } from "next/navigation";
import { Bell, ChevronDown, List, Search, Settings, X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { adminSidebarGroups } from "@/admin/data/adminMockData";
import { BrandLogoMark } from "@/shared/components/BrandLogo";
import "react-toastify/dist/ReactToastify.css";

const breadcrumbLabels: Record<string, string> = {
  admin: "داشبوردها",
  menus: "منوها",
  categories: "دسته‌بندی‌ها",
  pages: "صفحات",
  articles: "مقالات",
  news: "خبرها",
  tags: "تگ‌ها",
  users: "کاربران",
  "world-clocks": "ساعت جهانی",
  "content-sources": "منابع خبری",
  "source-items": "اخبار ورودی",
  "api-services": "سرویس‌های API",
  reports: "گزارش‌ها",
  settings: "تنظیمات",
  list: "لیست",
  view: "مشاهده",
  edit: "ویرایش"
};

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = window.localStorage.getItem("khoobrooz-admin-sidebar");
    setCollapsed(saved === "collapsed");
  }, []);

  const toggleSidebar = () => {
    if (window.matchMedia("(max-width: 980px)").matches) {
      setMobileOpen((value) => !value);
      return;
    }

    setCollapsed((value) => {
      const next = !value;
      window.localStorage.setItem("khoobrooz-admin-sidebar", next ? "collapsed" : "expanded");
      return next;
    });
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const nextOpenGroups: Record<string, boolean> = {};

    for (const group of adminSidebarGroups) {
      const hasActiveItem = group.items.some((item) => {
        const activePath = item.href.replace("/list", "");
        return item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(activePath);
      });

      if (hasActiveItem) {
        nextOpenGroups[group.label] = true;
      }
    }

    setOpenGroups((current) => ({ ...current, ...nextOpenGroups }));
  }, [pathname]);

  const breadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => breadcrumbLabels[segment] ?? segment);

  return (
    <main className={`admin-app ${collapsed ? "admin-app-collapsed" : ""} ${mobileOpen ? "admin-app-mobile-open" : ""}`} dir="rtl">
      <aside className="admin-sidebar" aria-label="ناوبری پنل مدیریت">
        <div className="admin-sidebar-brand">
          <BrandLogoMark className="admin-brand-logo" />
          <div>
            <strong>خوبروز</strong>
            <small>پنل مدیریت</small>
          </div>
          <button className="admin-sidebar-toggle" aria-label="باز و بسته کردن منوی پنل" onClick={toggleSidebar} type="button">
            {mobileOpen ? <X size={16} /> : <List size={16} />}
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {adminSidebarGroups.map((group) => {
            const groupIsActive = group.items.some((item) => {
              const activePath = item.href.replace("/list", "");
              return item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(activePath);
            });
            const groupIsOpen = collapsed || openGroups[group.label] || groupIsActive;

            return (
              <section className={groupIsOpen ? "admin-sidebar-group is-open" : "admin-sidebar-group"} key={group.label}>
                <button
                  aria-expanded={groupIsOpen}
                  className={groupIsActive ? "admin-sidebar-group-trigger active" : "admin-sidebar-group-trigger"}
                  onClick={() => setOpenGroups((value) => ({ ...value, [group.label]: !groupIsOpen }))}
                  title={collapsed ? group.label : undefined}
                  type="button"
                >
                  <span>{group.label}</span>
                  <ChevronDown size={14} />
                </button>
                <div className="admin-sidebar-group-items">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href.replace("/list", ""));

                    return (
                      <a aria-label={item.label} className={active ? "active" : undefined} href={item.href} key={item.label} onClick={() => setMobileOpen(false)} title={collapsed ? item.label : undefined}>
                        <Icon size={17} />
                        <span>{item.label}</span>
                      </a>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </nav>
      </aside>
      <button className="admin-sidebar-backdrop" aria-label="بستن منوی پنل" onClick={() => setMobileOpen(false)} type="button" />

      <section className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-start">
            <nav className="admin-breadcrumb" aria-label="مسیر جاری">
              {breadcrumbs.map((item, index) => (
                <span aria-current={index === breadcrumbs.length - 1 ? "page" : undefined} key={`${item}-${index}`}>
                  {item}
                </span>
              ))}
            </nav>
            <div className="admin-search" role="search">
              <Search size={17} />
              <input aria-label="جستجو در پنل" placeholder="جستجو در منو، مقاله، خبر..." />
            </div>
          </div>
          <div className="admin-topbar-actions">
            <button aria-label="باز و بسته کردن منوی پنل" onClick={toggleSidebar} type="button">
              <List size={17} />
            </button>
            <button aria-label="اعلان‌ها" type="button">
              <Bell size={17} />
            </button>
            <button aria-label="تنظیمات" type="button">
              <Settings size={17} />
            </button>
          </div>
        </header>
        {children}
      </section>

      <ToastContainer position="bottom-left" rtl theme="light" closeOnClick pauseOnHover />
    </main>
  );
}
