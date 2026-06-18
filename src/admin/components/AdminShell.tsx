"use client";

import { Bell, Search, Settings } from "lucide-react";
import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import { adminSidebar } from "@/admin/data/adminMockData";
import "react-toastify/dist/ReactToastify.css";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <main className="admin-app" dir="rtl">
      <aside className="admin-sidebar" aria-label="ناوبری پنل مدیریت">
        <div className="admin-sidebar-brand">
          <span>خ</span>
          <div>
            <strong>خوبروز</strong>
            <small>پنل مدیریت</small>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {adminSidebar.map((item) => {
            const Icon = item.icon;
            return (
              <a className={item.active ? "active" : undefined} href={item.href} key={item.label}>
                <Icon size={17} />
                <span>{item.label}</span>
              </a>
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
