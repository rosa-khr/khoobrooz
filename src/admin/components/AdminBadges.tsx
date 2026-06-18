"use client";

import { Check, Clock3, X } from "lucide-react";
import type { Accuracy } from "@/admin/data/adminMockData";

export function AccuracyBadge({ value }: { value: Accuracy }) {
  const config = {
    0: { label: "در انتظار", className: "admin-badge admin-badge-warning" },
    1: { label: "فعال", className: "admin-badge admin-badge-success" },
    2: { label: "حذف منطقی", className: "admin-badge admin-badge-danger" }
  } satisfies Record<Accuracy, { label: string; className: string }>;

  return <span className={config[value].className}>{config[value].label}</span>;
}

export function BooleanBadge({ value, trueLabel = "تایید", falseLabel = "نیازمند بررسی" }: { value: boolean; trueLabel?: string; falseLabel?: string }) {
  return (
    <span className={value ? "admin-badge admin-badge-success" : "admin-badge admin-badge-muted"}>
      {value ? <Check size={13} /> : <Clock3 size={13} />}
      {value ? trueLabel : falseLabel}
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
