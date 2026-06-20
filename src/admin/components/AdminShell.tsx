"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, PanelRightClose, PanelRightOpen, Search, Settings } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { adminSidebar } from "@/admin/data/adminMockData";
import { BrandLogoMark } from "@/shared/components/BrandLogo";
import "react-toastify/dist/ReactToastify.css";

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("khoobrooz-admin-sidebar");
    setCollapsed(saved === "collapsed");
  }, []);

  const toggleSidebar = () => {
    setCollapsed((value) => {
      const next = !value;
      window.localStorage.setItem("khoobrooz-admin-sidebar", next ? "collapsed" : "expanded");
      return next;
    });
  };

  return (
    <main className={`admin-app ${collapsed ? "admin-app-collapsed" : ""}`} dir="rtl">
      <aside className="admin-sidebar" aria-label="ناوبری پنل مدیریت">
        <div className="admin-sidebar-brand">
          <BrandLogoMark className="admin-brand-logo" />
          <div>
            <strong>خوبروز</strong>
            <small>پنل مدیریت</small>
          </div>
          <button className="admin-sidebar-toggle" aria-label={collapsed ? "باز کردن منوی پنل" : "بستن منوی پنل"} onClick={toggleSidebar} type="button">
            {collapsed ? <PanelRightOpen size={16} /> : <PanelRightClose size={16} />}
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {adminSidebar.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href.replace("/list", ""));

            return (
              <Link aria-label={item.label} className={active ? "active" : undefined} href={item.href} key={item.label} title={collapsed ? item.label : undefined}>
                <Icon size={17} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div className="admin-search" role="search">
            <Search size={17} />
            <input aria-label="جستجو در پنل" placeholder="جستجو در منو، مقاله، خبر..." />
          </div>
          <div className="admin-topbar-actions">
            <button aria-label={collapsed ? "باز کردن منوی پنل" : "بستن منوی پنل"} onClick={toggleSidebar} type="button">
              {collapsed ? <PanelRightOpen size={17} /> : <PanelRightClose size={17} />}
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
