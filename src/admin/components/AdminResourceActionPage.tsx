"use client";

import { AdminShell } from "@/admin/components/AdminShell";

type AdminResourceActionPageProps = {
  action: "view" | "edit";
  id: string;
  resource: string;
};

const actionLabels = {
  view: "مشاهده",
  edit: "ویرایش"
};

export function AdminResourceActionPage({ action, id, resource }: AdminResourceActionPageProps) {
  return (
    <AdminShell>
      <div className="admin-content">
        <section className="admin-page-heading">
          <span>{actionLabels[action]}</span>
          <h1>{actionLabels[action]} رکورد</h1>
          <p>
            مسیر `{resource}/{action}/{id}` آماده است و فرم اختصاصی این بخش در مرحله بعدی پیاده‌سازی می‌شود.
          </p>
        </section>
      </div>
    </AdminShell>
  );
}
