"use client";

import { dashboardContentFlow, dashboardPublishStatus, dashboardSeoMetrics } from "@/admin/data/adminMockData";

export function AdminDashboardCharts() {
  const maxFlow = Math.max(...dashboardContentFlow.flatMap((item) => [item.articles, item.news]));
  const totalStatus = dashboardPublishStatus.reduce((sum, item) => sum + item.value, 0);
  let progress = 0;

  return (
    <section className="admin-dashboard-grid" aria-label="گزارش‌های داشبورد">
      <article className="admin-chart-card admin-chart-card-wide">
        <div className="admin-card-heading">
          <span>Content Flow</span>
          <h2>تولید محتوا به تفکیک ماه</h2>
          <p>مقایسه تعداد مقاله‌ها و خبرهای منتشر شده در هر ماه.</p>
        </div>

        <div className="admin-bar-chart" aria-label="نمودار تولید محتوا">
          {dashboardContentFlow.map((item) => (
            <div className="admin-bar-group" key={item.label}>
              <div className="admin-bars">
                <span style={{ height: `${(item.articles / maxFlow) * 100}%` }} />
                <span style={{ height: `${(item.news / maxFlow) * 100}%` }} />
              </div>
              <small>{item.label}</small>
            </div>
          ))}
        </div>

        <div className="admin-chart-legend">
          <span><i className="admin-legend-navy" /> مقاله</span>
          <span><i className="admin-legend-gold" /> خبر</span>
        </div>
      </article>

      <article className="admin-chart-card">
        <div className="admin-card-heading">
          <span>Publish Status</span>
          <h2>انتشار محتوا</h2>
          <p>تفکیک محتواهای منتشر شده، پیش‌نویس و زمان‌بندی شده.</p>
        </div>

        <svg className="admin-donut-chart" viewBox="0 0 42 42" role="img" aria-label="نمودار انتشار محتوا">
          <circle cx="21" cy="21" fill="transparent" r="15.915" stroke="#e3e7ec" strokeWidth="5" />
          {dashboardPublishStatus.map((item) => {
            const value = (item.value / totalStatus) * 100;
            const dash = `${value} ${100 - value}`;
            const offset = 25 - progress;
            progress += value;

            return (
              <circle
                cx="21"
                cy="21"
                fill="transparent"
                key={item.label}
                r="15.915"
                stroke={item.color}
                strokeDasharray={dash}
                strokeDashoffset={offset}
                strokeLinecap="round"
                strokeWidth="5"
              />
            );
          })}
          <text className="admin-donut-value" dominantBaseline="middle" textAnchor="middle" x="21" y="20">
            {totalStatus}
          </text>
          <text className="admin-donut-label" dominantBaseline="middle" textAnchor="middle" x="21" y="25">
            محتوا
          </text>
        </svg>

        <div className="admin-status-list">
          {dashboardPublishStatus.map((item) => (
            <div key={item.label}>
              <span><i style={{ background: item.color }} /> {item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </article>

      <article className="admin-chart-card admin-seo-card">
        <div className="admin-card-heading">
          <span>SEO Signals</span>
          <h2>گزارش‌های استراتژی SEO</h2>
          <p>شاخص‌هایی که برای برنامه‌ریزی محتوا و اولویت‌بندی صفحات استفاده می‌شوند.</p>
        </div>

        <div className="admin-seo-metrics">
          {dashboardSeoMetrics.map((item) => (
            <div key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.detail}</small>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
