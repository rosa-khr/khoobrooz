import { Anchor, CheckCircle2, ClipboardCheck, FileText, LucideIcon, Route, Ship, Truck } from "lucide-react";
import clsx from "clsx";

type PatternVariant = "process" | "content" | "trust";

const iconSets: Record<PatternVariant, LucideIcon[]> = {
  process: [Route, Ship, Truck, Anchor],
  content: [FileText, ClipboardCheck, Route, Ship],
  trust: [CheckCircle2, ClipboardCheck, Anchor, Route]
};

export function SectionPattern({ variant, className }: { variant: PatternVariant; className?: string }) {
  const icons = iconSets[variant];

  return (
    <div className={clsx("section-icon-pattern", `section-icon-pattern-${variant}`, className)} aria-hidden="true">
      <svg className="section-icon-pattern-curves" viewBox="0 0 760 360" fill="none" preserveAspectRatio="none">
        <path d="M36 284C170 172 294 318 420 190C520 88 626 120 724 42" />
        <path d="M80 72C204 122 246 228 382 214C502 202 568 96 690 132" />
      </svg>
      {icons.map((Icon, index) => (
        <span key={`${variant}-${index}`} className={`section-icon-pattern-item section-icon-pattern-item-${index + 1}`}>
          <Icon className="size-6" />
        </span>
      ))}
    </div>
  );
}
