"use client";

import { Check, X } from "lucide-react";
import type { Accuracy } from "@/admin/data/adminMockData";

export function AccuracyBadge({ value }: { value: Accuracy }) {
  const config = {
    0: { label: "در انتظار تایید", className: "admin-badge admin-badge-warning" },
    1: { label: "تایید شده", className: "admin-badge admin-badge-success" },
    2: { label: "حذف شده", className: "admin-badge admin-badge-danger" }
  } satisfies Record<Accuracy, { label: string; className: string }>;

  return <span className={config[value].className}>{config[value].label}</span>;
}

export function BooleanBadge({ value, trueLabel = "تایید", falseLabel = "نیازمند بررسی" }: { value: boolean; trueLabel?: string; falseLabel?: string }) {
  return (
    <span
      aria-label={value ? trueLabel : falseLabel}
      className={value ? "admin-icon-badge admin-icon-badge-success" : "admin-icon-badge admin-icon-badge-danger"}
      title={value ? trueLabel : falseLabel}
    >
      {value ? <Check size={14} /> : <X size={14} />}
    </span>
  );
}

export function PublishBadge({ value }: { value: boolean }) {
  return (
    <span className={value ? "admin-badge admin-badge-info" : "admin-badge admin-badge-muted"}>
      {value ? <Check size={13} /> : <X size={13} />}
      {value ? "منتشر شده" : "پیش‌نویس"}
    </span>
  );
}
