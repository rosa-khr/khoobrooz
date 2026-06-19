"use client";

import { Database, Plus } from "lucide-react";
import { AdminDashboardCharts } from "@/admin/components/AdminDashboardCharts";
import { AdminDataGrid } from "@/admin/components/AdminDataGrid";
import { AdminShell } from "@/admin/components/AdminShell";
import { adminQuickActions, adminStats, articleRows, menuRows } from "@/admin/data/adminMockData";

export default function AdminDashboard() {
  return (
    <AdminShell>
      <div className="admin-content">
        <section className="admin-hero">
          <div>
            <span>Khoobrooz Admin</span>
            <h1>داشبوردهای مدیریت خوبروز</h1>
            <p>نمای عملیاتی برای مدیریت منوها، محتوا، نرخ‌ها و داده‌های پایه سایت.</p>
          </div>
          <div className="admin-db-status">
            <Database size={18} />
            <span>SQL Server</span>
            <strong>۳۵ جدول آماده</strong>
          </div>
        </section>

        <section className="admin-stats-grid" aria-label="خلاصه وضعیت">
          {adminStats.map((stat) => (
            <article className={`admin-stat admin-stat-${stat.tone}`} key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <small>{stat.detail}</small>
            </article>
          ))}
        </section>

        <AdminDashboardCharts />

        <section className="admin-quick-actions" aria-label="اقدام سریع">
          {adminQuickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button key={action.label} type="button">
                <Icon size={17} />
                <span>{action.label}</span>
                <Plus size={14} />
              </button>
            );
          })}
        </section>

        <AdminDataGrid
          description="منوها تا سه سطح زیرمنو، URL، عنوان SEO، وضعیت و انتشار را پوشش می‌دهند."
          kind="menus"
          rows={menuRows}
          title="مدیریت منوها"
        />

        <AdminDataGrid
          description="مقالات دارای وضعیت تایید، انتشار، زمان‌بندی و فیلدهای SEO هستند."
          kind="articles"
          rows={articleRows}
          title="مدیریت مقالات"
        />
      </div>
    </AdminShell>
  );
}
