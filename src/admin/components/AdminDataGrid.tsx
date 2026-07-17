"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, type ColDef, type GridApi, type GridReadyEvent } from "ag-grid-community";
import { Eye, Pencil, Trash2, BadgeCheck } from "lucide-react";
import { toast } from "react-toastify";
import { AccuracyBadge, BooleanBadge, PublishBadge } from "@/admin/components/AdminBadges";
import { deleteAdminRecord, saveAdminRecord, type AdminContentRecord, type AdminGridRecord } from "@/admin/lib/adminApi";
import { formatPersianDateTime } from "@/admin/lib/date";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

ModuleRegistry.registerModules([AllCommunityModule]);

type GridKind = "menus" | "categories" | "pages" | "services" | "articles" | "news" | "tags" | "world-clocks";

const persianGridLocale = {
  page: "صفحه",
  more: "بیشتر",
  to: "تا",
  of: "از",
  next: "بعدی",
  last: "آخرین",
  first: "اولین",
  previous: "قبلی",
  loadingOoo: "در حال بارگذاری...",
  selectAll: "انتخاب همه",
  searchOoo: "جستجو...",
  blanks: "خالی",
  filterOoo: "فیلتر...",
  equals: "برابر",
  notEqual: "نامساوی",
  contains: "شامل",
  notContains: "شامل نباشد",
  startsWith: "شروع با",
  endsWith: "پایان با",
  lessThan: "کمتر از",
  greaterThan: "بیشتر از",
  lessThanOrEqual: "کمتر یا مساوی",
  greaterThanOrEqual: "بیشتر یا مساوی",
  inRange: "در بازه",
  andCondition: "و",
  orCondition: "یا",
  applyFilter: "اعمال",
  resetFilter: "بازنشانی",
  clearFilter: "پاک کردن",
  cancelFilter: "لغو",
  noRowsToShow: "رکوردی برای نمایش وجود ندارد",
  pinColumn: "سنجاق کردن ستون",
  autosizeThiscolumn: "اندازه خودکار این ستون",
  autosizeAllColumns: "اندازه خودکار همه ستون‌ها",
  resetColumns: "بازنشانی ستون‌ها",
  copy: "کپی",
  copyWithHeaders: "کپی با عنوان ستون‌ها",
  paste: "چسباندن",
  export: "خروجی",
  sortAscending: "مرتب‌سازی صعودی",
  sortDescending: "مرتب‌سازی نزولی",
  sortUnSort: "حذف مرتب‌سازی"
};

type PersistedGridState = {
  columnState?: ReturnType<GridApi["getColumnState"]>;
  filterModel?: ReturnType<GridApi["getFilterModel"]>;
};

function getRecordLabel(data: AdminGridRecord) {
  if ("title" in data) {
    return data.title;
  }

  return data.city || data.country || String(data.id);
}

function formatTagTitles(value?: string[]) {
  return Array.isArray(value) && value.length > 0 ? value.join("، ") : "-";
}

type AdminDataGridProps = {
  title: string;
  description: string;
  kind: GridKind;
  onChanged?: () => void;
  rows: AdminGridRecord[];
};

export function AdminDataGrid({ title, description, kind, onChanged, rows }: AdminDataGridProps) {
  const [mounted, setMounted] = useState(false);
  const resourcePath = kind;
  const gridStorageKey = `khoobrooz.admin.grid.${kind}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleApprove = useCallback((data: AdminGridRecord) => {
    if (kind !== "articles" && kind !== "news") {
      return;
    }

    const row = data as AdminContentRecord;
    saveAdminRecord(kind, "update", {
      ...row,
      approve: true
    })
      .then(() => {
        toast.success(`تایید محتوا: ${row.title}`);
        onChanged?.();
      })
      .catch((reason: unknown) => toast.error(reason instanceof Error ? reason.message : "تایید محتوا ناموفق بود."));
  }, [kind, onChanged]);

  const handleDelete = useCallback((data: AdminGridRecord) => {
    deleteAdminRecord(kind, data.id)
      .then(() => {
        toast.warning(`حذف منطقی: ${getRecordLabel(data)}`);
        onChanged?.();
      })
      .catch((reason: unknown) => toast.error(reason instanceof Error ? reason.message : "حذف منطقی ناموفق بود."));
  }, [kind, onChanged]);

  const saveGridState = useCallback((api: GridApi) => {
    const state: PersistedGridState = {
      columnState: api.getColumnState(),
      filterModel: api.getFilterModel()
    };

    window.sessionStorage.setItem(gridStorageKey, JSON.stringify(state));
  }, [gridStorageKey]);

  const restoreGridState = useCallback((event: GridReadyEvent) => {
    const savedState = window.sessionStorage.getItem(gridStorageKey);

    if (!savedState) {
      return;
    }

    try {
      const state = JSON.parse(savedState) as PersistedGridState;

      if (state.columnState?.length) {
        event.api.applyColumnState({ applyOrder: true, state: state.columnState });
      }

      if (state.filterModel) {
        event.api.setFilterModel(state.filterModel);
      }
    } catch {
      window.sessionStorage.removeItem(gridStorageKey);
    }
  }, [gridStorageKey]);

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
        valueFormatter: ({ value }) => formatPersianDateTime(value) || "-",
        width: 150
      },
      {
        headerName: "عملیات",
        field: "id",
        pinned: "left",
        width: kind === "articles" || kind === "news" ? 156 : 126,
        cellRenderer: ({ data }: { data: AdminGridRecord }) => (
          <div className="admin-grid-actions">
            <a aria-label="مشاهده" href={`/admin/${resourcePath}/view/${data.id}`}>
              <Eye size={15} />
            </a>
            <a aria-label="ویرایش" href={`/admin/${resourcePath}/edit/${data.id}`}>
              <Pencil size={15} />
            </a>
            {kind === "articles" || kind === "news" ? (
              <button aria-label="تایید" onClick={() => handleApprove(data)} type="button">
                <BadgeCheck size={15} />
              </button>
            ) : null}
            <button aria-label="حذف" onClick={() => handleDelete(data)} type="button">
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

    if (kind === "categories") {
      return [
        { headerName: "عنوان", field: "title", flex: 1.2, minWidth: 180 },
        { headerName: "والد", field: "parentTitle", width: 170, valueFormatter: ({ value }) => value || "دسته اصلی" },
        { headerName: "نوع", field: "type", width: 140 },
        { headerName: "آدرس انگلیسی", field: "slug", flex: 1, minWidth: 170, dir: "ltr" },
        { headerName: "ترتیب", field: "sortOrder", width: 96 },
        { headerName: "عنوان SEO", field: "seoTitle", flex: 1.2, minWidth: 210 },
        ...baseColumns
      ];
    }

    if (kind === "tags" || kind === "services" || kind === "pages") {
      return [
        { headerName: "عنوان", field: "title", flex: 1.3, minWidth: 190 },
        { headerName: "آدرس انگلیسی", field: "slug", flex: 1.2, minWidth: 180, dir: "ltr" },
        ...(kind === "services" || kind === "pages" ? [{ headerName: kind === "pages" ? "خلاصه صفحه" : "توضیح کارت", field: "summary", flex: 1.8, minWidth: 260 } as ColDef] : []),
        ...(kind === "services" || kind === "pages" ? [{
          headerName: "انتشار",
          field: "isPublished",
          width: 120,
          cellRenderer: ({ value }: { value: boolean }) => <PublishBadge value={value} />
        } as ColDef] : []),
        {
          headerName: "وضعیت",
          field: "accuracy",
          width: 128,
          cellRenderer: ({ value }: { value: 0 | 1 | 2 }) => <AccuracyBadge value={value} />
        },
        {
          headerName: "آخرین ویرایش",
          field: "modifiedAt",
          valueFormatter: ({ value }) => formatPersianDateTime(value) || "-",
          width: 150
        },
        baseColumns[3]
      ];
    }

    if (kind === "world-clocks") {
      return [
        { headerName: "کشور", field: "country", flex: 1, minWidth: 160 },
        { headerName: "شهر", field: "city", flex: 1, minWidth: 150 },
        { headerName: "قاره", field: "continent", width: 130 },
        { headerName: "Timezone", field: "timezone", flex: 1, minWidth: 180, dir: "ltr" },
        { headerName: "ترتیب", field: "sortOrder", width: 95 },
        ...baseColumns
      ];
    }

    return [
      { headerName: "عنوان", field: "title", flex: 1.5, minWidth: 230 },
      { headerName: "دسته", field: "category", width: 150 },
      {
        headerName: "تگ‌ها",
        field: "tagTitles",
        flex: 1,
        minWidth: 190,
        valueFormatter: ({ value }) => formatTagTitles(value),
        filterValueGetter: ({ data }) => formatTagTitles((data as AdminContentRecord | undefined)?.tagTitles)
      },
      { headerName: "اسلاگ", field: "slug", flex: 1, minWidth: 180, dir: "ltr" },
      { headerName: "عنوان SEO", field: "seoTitle", flex: 1.2, minWidth: 210 },
      {
        headerName: "تایید",
        field: "approve",
        width: 145,
        cellRenderer: ({ value }: { value: boolean }) => <BooleanBadge falseLabel="در انتظار تایید" trueLabel="تایید شده" value={value} />
      },
      { headerName: "زمان‌بندی", field: "scheduledAt", width: 150, valueFormatter: ({ value }) => formatPersianDateTime(value) || "-" },
      ...baseColumns
    ];
  }, [handleApprove, handleDelete, kind, resourcePath]);

  return (
    <section className="admin-grid-section" id={kind}>
      <div className="admin-section-heading">
        <div>
          <span>{kind === "menus" ? "Navigation" : kind === "categories" ? "Categories" : kind === "pages" ? "Pages" : kind === "tags" ? "Tags" : kind === "services" ? "Services" : kind === "world-clocks" ? "World Clock" : "Content"}</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <a href={`/admin/${resourcePath}/add`}>
          رکورد جدید
        </a>
      </div>

      <div className="admin-grid-wrap ag-theme-material">
        {mounted ? (
          <AgGridReact
            animateRows
            columnDefs={columnDefs}
            defaultColDef={{
              filterParams: {
                buttons: ["reset"],
                debounceMs: 250
              },
              resizable: true,
              sortable: true,
              filter: true,
              suppressHeaderMenuButton: true
            }}
            domLayout="normal"
            enableRtl
            localeText={persianGridLocale}
            onColumnMoved={({ api }) => saveGridState(api)}
            onColumnPinned={({ api }) => saveGridState(api)}
            onColumnResized={({ api, finished }) => {
              if (finished) {
                saveGridState(api);
              }
            }}
            onColumnVisible={({ api }) => saveGridState(api)}
            onFilterChanged={({ api }) => saveGridState(api)}
            onGridReady={restoreGridState}
            onSortChanged={({ api }) => saveGridState(api)}
            pagination
            paginationPageSize={15}
            paginationPageSizeSelector={[15, 25, 50, 100, 200]}
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
