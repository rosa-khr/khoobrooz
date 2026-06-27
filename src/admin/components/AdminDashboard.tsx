"use client";

import { Database, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AdminDashboardCharts } from "@/admin/components/AdminDashboardCharts";
import { AdminDataGrid } from "@/admin/components/AdminDataGrid";
import { AdminShell } from "@/admin/components/AdminShell";
import { adminQuickActions, adminStats } from "@/admin/data/adminMockData";
import { loadAdminPage, type AdminContentRecord, type AdminGridRecord } from "@/admin/lib/adminApi";

export default function AdminDashboard() {
  const [pendingArticles, setPendingArticles] = useState<AdminGridRecord[]>([]);
  const [pendingNews, setPendingNews] = useState<AdminGridRecord[]>([]);

  const refreshPendingContent = useCallback(() => {
    Promise.all([loadAdminPage("articles"), loadAdminPage("news")])
      .then(([articles, news]) => {
        const { response: { items: articleItems } } = articles;
        const { response: { items: newsItems } } = news;
        setPendingArticles(articleItems.filter((item) => !(item as AdminContentRecord).approve));
        setPendingNews(newsItems.filter((item) => !(item as AdminContentRecord).approve));
      })
      .catch(() => {
        setPendingArticles([]);
        setPendingNews([]);
      });
  }, []);

  useEffect(() => {
    refreshPendingContent();
  }, [refreshPendingContent]);

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
            <span>MySQL</span>
            <strong>۱۰ جدول آماده</strong>
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
          description="فقط مقاله‌هایی که هنوز تایید نشده‌اند و باید قبل از انتشار بررسی شوند."
          kind="articles"
          onChanged={refreshPendingContent}
          rows={pendingArticles}
          title="مقاله‌های نیازمند تایید"
        />

        <AdminDataGrid
          description="خبرهایی که هنوز تایید نشده‌اند و برای انتشار نیاز به بررسی دارند."
          kind="news"
          onChanged={refreshPendingContent}
          rows={pendingNews}
          title="خبرهای نیازمند تایید"
        />
      </div>
    </AdminShell>
  );
}
