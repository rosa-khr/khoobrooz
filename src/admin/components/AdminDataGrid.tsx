"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, type ColDef } from "ag-grid-community";
import { Eye, Pencil, Trash2, BadgeCheck } from "lucide-react";
import { toast } from "react-toastify";
import { AccuracyBadge, BooleanBadge, PublishBadge } from "@/admin/components/AdminBadges";
import type { AdminArticleItem, AdminMenuItem, AdminNewsItem } from "@/admin/data/adminMockData";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

ModuleRegistry.registerModules([AllCommunityModule]);

type GridKind = "menus" | "articles" | "news";

type AdminDataGridProps = {
  title: string;
  description: string;
  kind: GridKind;
  rows: AdminMenuItem[] | AdminArticleItem[] | AdminNewsItem[];
};

export function AdminDataGrid({ title, description, kind, rows }: AdminDataGridProps) {
  const [mounted, setMounted] = useState(false);
  const resourcePath = kind === "menus" ? "menus" : kind;

  useEffect(() => {
    setMounted(true);
  }, []);

  const columnDefs = useMemo<ColDef[]>(() => {
    const baseColumns: ColDef[] = [
      {
        headerName: "وضعیت",
        field: "accuracy",
        width: 128,
        cellRenderer: ({ value }: { value: 0 | 1 | 2 }) => <AccuracyBadge value={value} />
      },
      {
        headerName: "انتشار",
        field: "isPublished",
        width: 135,
        cellRenderer: ({ value }: { value: boolean }) => <PublishBadge value={value} />
      },
      {
        headerName: "آخرین ویرایش",
        field: "modifiedAt",
        width: 132
      },
      {
        headerName: "عملیات",
        field: "id",
        pinned: "left",
        width: kind === "articles" || kind === "news" ? 156 : 126,
        cellRenderer: ({ data }: { data: AdminMenuItem | AdminArticleItem | AdminNewsItem }) => (
          <div className="admin-grid-actions">
            <Link aria-label="مشاهده" href={`/admin/${resourcePath}/view/${data.id}`}>
              <Eye size={15} />
            </Link>
            <Link aria-label="ویرایش" href={`/admin/${resourcePath}/edit/${data.id}`}>
              <Pencil size={15} />
            </Link>
            {kind === "articles" || kind === "news" ? (
              <button aria-label="تایید" onClick={() => toast.success(`تایید محتوا: ${data.title}`)} type="button">
                <BadgeCheck size={15} />
              </button>
            ) : null}
            <button aria-label="حذف" onClick={() => toast.warning(`حذف منطقی: ${data.title}`)} type="button">
              <Trash2 size={15} />
            </button>
          </div>
        )
      }
    ];

    if (kind === "menus") {
      return [
        { headerName: "عنوان", field: "title", flex: 1, minWidth: 150 },
        { headerName: "والد", field: "parentTitle", width: 160, valueFormatter: ({ value }) => value || "منوی اصلی" },
        { headerName: "آدرس", field: "url", flex: 1, minWidth: 160, dir: "ltr" },
        { headerName: "سطح", field: "level", width: 92 },
        { headerName: "عنوان SEO", field: "seoTitle", flex: 1.3, minWidth: 220 },
        ...baseColumns
      ];
    }

    return [
      { headerName: "عنوان", field: "title", flex: 1.5, minWidth: 230 },
      { headerName: "دسته", field: "category", width: 150 },
      { headerName: "اسلاگ", field: "slug", flex: 1, minWidth: 180, dir: "ltr" },
      { headerName: "عنوان SEO", field: "seoTitle", flex: 1.2, minWidth: 210 },
      {
        headerName: "تایید",
        field: "approve",
        width: 145,
        cellRenderer: ({ value }: { value: boolean }) => <BooleanBadge falseLabel="در انتظار تایید" trueLabel="تایید شده" value={value} />
      },
      { headerName: "زمان‌بندی", field: "scheduledAt", width: 132, valueFormatter: ({ value }) => value || "-" },
      ...baseColumns
    ];
  }, [kind, resourcePath]);

  return (
    <section className="admin-grid-section" id={kind}>
      <div className="admin-section-heading">
        <div>
          <span>{kind === "menus" ? "Navigation" : "Content"}</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <button onClick={() => toast.success("فرم ایجاد در فاز بعدی وصل می‌شود.")} type="button">
          رکورد جدید
        </button>
      </div>

      <div className="admin-grid-wrap ag-theme-material">
        {mounted ? (
          <AgGridReact
            animateRows
            columnDefs={columnDefs}
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              suppressHeaderMenuButton: true
            }}
            domLayout="normal"
            enableRtl
            rowData={rows}
            rowHeight={54}
          />
        ) : (
          <div className="admin-grid-loading">در حال آماده‌سازی جدول...</div>
        )}
      </div>
    </section>
  );
}
