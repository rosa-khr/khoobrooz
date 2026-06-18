"use client";

import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, type ColDef } from "ag-grid-community";
import { Eye, Pencil, Trash2, BadgeCheck } from "lucide-react";
import { toast } from "react-toastify";
import { AccuracyBadge, BooleanBadge, PublishBadge } from "@/admin/components/AdminBadges";
import type { AdminArticleItem, AdminMenuItem } from "@/admin/data/adminMockData";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([AllCommunityModule]);

type GridKind = "menus" | "articles";

type AdminDataGridProps = {
  title: string;
  description: string;
  kind: GridKind;
  rows: AdminMenuItem[] | AdminArticleItem[];
};

export function AdminDataGrid({ title, description, kind, rows }: AdminDataGridProps) {
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
        width: kind === "articles" ? 156 : 126,
        cellRenderer: ({ data }: { data: AdminMenuItem | AdminArticleItem }) => (
          <div className="admin-grid-actions">
            <button aria-label="مشاهده" onClick={() => toast.info(`مشاهده: ${data.title}`)} type="button">
              <Eye size={15} />
            </button>
            <button aria-label="ویرایش" onClick={() => toast.success(`ویرایش آماده است: ${data.title}`)} type="button">
              <Pencil size={15} />
            </button>
            {kind === "articles" ? (
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
  }, [kind]);

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

      <div className="admin-grid-wrap ag-theme-quartz">
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
      </div>
    </section>
  );
}
