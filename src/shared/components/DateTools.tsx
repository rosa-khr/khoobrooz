"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

type CalendarMode = "day" | "week" | "month";

function formatCalendarDate(date: Date, locale: string, calendar: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(`${locale}-u-ca-${calendar}`, options).format(date);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function sameDay(first: Date, second: Date) {
  return first.toDateString() === second.toDateString();
}

function getPersianPart(date: Date, type: Intl.DateTimeFormatPartTypes) {
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "numeric",
    day: "numeric"
  })
    .formatToParts(date)
    .find((part) => part.type === type)?.value;
}

function samePersianMonth(first: Date, second: Date) {
  return getPersianPart(first, "year") === getPersianPart(second, "year") && getPersianPart(first, "month") === getPersianPart(second, "month");
}

function getPersianMonthDays(anchor: Date) {
  const days = Array.from({ length: 81 }, (_, index) => addDays(anchor, index - 40)).filter((day) => samePersianMonth(day, anchor));
  const unique = new Map(days.map((day) => [day.toDateString(), day]));

  return Array.from(unique.values()).sort((first, second) => first.getTime() - second.getTime());
}

function getSaturdayBasedWeekday(date: Date) {
  return (date.getDay() + 1) % 7;
}

function getMonthGridDays(monthDays: Date[], monthOffset: number) {
  const firstDay = monthDays[0];
  const lastDay = monthDays[monthDays.length - 1];
  const leadingDays = firstDay ? Array.from({ length: monthOffset }, (_, index) => addDays(firstDay, index - monthOffset)) : [];
  const trailingCount = Math.max(0, 42 - leadingDays.length - monthDays.length);
  const trailingDays = lastDay ? Array.from({ length: trailingCount }, (_, index) => addDays(lastDay, index + 1)) : [];

  return [
    ...leadingDays.map((date) => ({ date, inMonth: false })),
    ...monthDays.map((date) => ({ date, inMonth: true })),
    ...trailingDays.map((date) => ({ date, inMonth: false }))
  ];
}

export function getDateSet(date: Date) {
  return {
    persian: formatCalendarDate(date, "fa-IR", "persian", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    gregorian: formatCalendarDate(date, "en-US", "gregory", { day: "2-digit", month: "short", year: "numeric" }),
    hijri: formatCalendarDate(date, "ar-SA", "islamic", { day: "numeric", month: "long", year: "numeric" })
  };
}

export function HeaderDateWidget({ now }: { now: Date }) {
  const dates = getDateSet(now);
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tehran",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(now);

  return (
    <div className="flex min-w-0 items-center gap-2 text-xs text-blue-100">
      <span className="shrink-0 text-[#ffe4a8]">تهران</span>
      <span className="shrink-0 font-mono text-sm font-black text-accent" dir="ltr">{time}</span>
      <span className="h-3 w-px shrink-0 bg-white/20" aria-hidden="true" />
      <span className="min-w-0 truncate">{dates.persian}</span>
      <span className="shrink-0 rounded-[4px] bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-[#ffe4a8]" dir="ltr">{dates.gregorian}</span>
      <span className="hidden min-w-0 truncate rounded-[4px] bg-white/10 px-1.5 py-0.5 text-[10px] text-blue-100 lg:inline">{dates.hijri}</span>
    </div>
  );
}

export function TradeCalendar() {
  const [mode, setMode] = useState<CalendarMode>("day");
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState(() => new Date());
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(cursor, index - 3)), [cursor]);
  const monthDays = useMemo(() => getPersianMonthDays(cursor), [cursor]);
  const monthOffset = monthDays[0] ? getSaturdayBasedWeekday(monthDays[0]) : 0;
  const monthGridDays = useMemo(() => getMonthGridDays(monthDays, monthOffset), [monthDays, monthOffset]);
  const selectedDates = getDateSet(selected);
  const monthTitle = formatCalendarDate(cursor, "fa-IR", "persian", { month: "long", year: "numeric" });
  const selectedDayNumber = formatCalendarDate(selected, "fa-IR", "persian", { day: "numeric" });
  const selectedWeekday = formatCalendarDate(selected, "fa-IR", "persian", { weekday: "long" });
  const modeStep = mode === "month" ? 32 : mode === "week" ? 7 : 1;

  const moveCursor = (step: number) => {
    setCursor((value) => {
      const next = addDays(value, step);
      setSelected(next);
      return next;
    });
  };

  const selectedSummary = (
    <div className="grid gap-3 rounded-[4px] border border-white/10 bg-[#061325]/44 p-3 md:grid-cols-[112px_1fr] md:items-center">
      <div className="rounded-[4px] border border-accent/35 bg-accent/95 px-3 py-2.5 text-center text-primary shadow-[0_12px_26px_rgba(244,178,62,0.16)]">
        <span className="block text-xs font-black">{selectedWeekday}</span>
        <strong className="block text-5xl font-black leading-none">{selectedDayNumber}</strong>
      </div>
      <div className="grid gap-2 text-xs text-blue-100">
        <span className="text-sm font-black text-white">{selectedDates.persian}</span>
        <div className="grid gap-2 sm:grid-cols-2">
          <span className="inline-flex min-w-0 items-center justify-between gap-3 rounded-[4px] bg-white/[0.07] px-2.5 py-1.5">
            <span>میلادی</span>
            <span className="font-mono text-[#ffe4a8]" dir="ltr">{selectedDates.gregorian}</span>
          </span>
          <span className="inline-flex min-w-0 items-center justify-between gap-3 rounded-[4px] bg-white/[0.07] px-2.5 py-1.5">
            <span>قمری</span>
            <span className="truncate text-[#ffe4a8]">{selectedDates.hijri}</span>
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="rounded-khoobrooz border border-white/15 bg-white/10 p-3 backdrop-blur">
      <div className="mb-3 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="min-w-0">
          <h3 className="inline-flex items-center gap-2 font-black text-white">
            <CalendarDays className="size-4 text-accent" aria-hidden="true" />
            تقویم تجارت
          </h3>
          <p className="mt-0.5 truncate text-xs text-blue-200">انتخاب سریع روز برای هماهنگی تماس، حمل و پیگیری مدارک</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex overflow-hidden rounded-[4px] border border-white/15 bg-[#061325]/38">
            {[
              { id: "day", label: "روزانه" },
              { id: "week", label: "هفتگی" },
              { id: "month", label: "ماهانه" }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                className={`px-3 py-2 text-xs font-black transition ${
                  mode === item.id ? "bg-accent text-primary" : "text-blue-100 hover:bg-white/10"
                }`}
                onClick={() => setMode(item.id as CalendarMode)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex w-fit items-center overflow-hidden rounded-[4px] border border-white/15 bg-[#061325]/38">
            <button
              type="button"
              className="grid size-8 place-items-center text-white transition hover:bg-white/10"
              aria-label="قبلی"
              onClick={() => moveCursor(-modeStep)}
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="border-x border-white/15 bg-accent px-3 py-2 text-xs font-black text-primary"
              onClick={() => {
                const today = new Date();
                setCursor(today);
                setSelected(today);
              }}
            >
              امروز
            </button>
            <button
              type="button"
              className="grid size-8 place-items-center text-white transition hover:bg-white/10"
              aria-label="بعدی"
              onClick={() => moveCursor(modeStep)}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {selectedSummary}

      {mode === "week" && (
        <div className="mt-3 -mx-1 overflow-x-auto px-1 pb-1">
          <div className="grid min-w-[720px] grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const active = sameDay(day, selected);
              const weekday = formatCalendarDate(day, "fa-IR", "persian", { weekday: "short" });
              const monthDay = formatCalendarDate(day, "fa-IR", "persian", { day: "numeric" });
              const month = formatCalendarDate(day, "fa-IR", "persian", { month: "short" });

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  className={`grid min-h-[72px] rounded-[4px] border p-2 text-start transition ${
                    active
                      ? "border-accent bg-accent text-primary shadow-[0_10px_24px_rgba(244,178,62,0.18)]"
                      : "border-white/15 bg-[#061325]/44 text-white hover:border-accent/60 hover:bg-white/10"
                  }`}
                  onClick={() => setSelected(day)}
                >
                  <span className="text-xs font-bold opacity-80">{weekday}</span>
                    <span className="text-xl font-black leading-none">{monthDay}</span>
                  <span className="text-[11px] opacity-75">{month}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {mode === "month" && (
        <div className="mt-3 rounded-[4px] border border-white/10 bg-[#061325]/32 p-3">
          <div className="mb-3 flex items-center justify-between gap-3 px-1">
            <strong className="text-sm text-white">{monthTitle}</strong>
            <span className="rounded-[4px] bg-white/10 px-2 py-1 text-[11px] font-black text-blue-100">تقویم شمسی</span>
          </div>
          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-black text-blue-200">
            {["شنبه", "یک", "دو", "سه", "چهار", "پنج", "جمعه"].map((day) => (
              <span key={day} className="truncate rounded-[3px] bg-white/[0.07] px-1 py-1">{day}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {monthGridDays.map(({ date, inMonth }) => {
              const active = sameDay(date, selected);
              const isToday = sameDay(date, new Date());
              const monthDay = formatCalendarDate(date, "fa-IR", "persian", { day: "numeric" });
              const gregorianDay = formatCalendarDate(date, "en-US", "gregory", { day: "numeric" });

              return (
                <button
                  key={`${date.toISOString()}-${inMonth ? "in" : "out"}`}
                  type="button"
                  className={`grid min-h-12 rounded-[4px] border px-1.5 py-1 text-start transition sm:min-h-[54px] ${
                    active
                      ? "border-accent bg-accent text-primary shadow-[0_10px_22px_rgba(244,178,62,0.16)]"
                      : isToday
                        ? "border-accent/70 bg-white/[0.12] text-accent"
                        : inMonth
                          ? "border-white/10 bg-[#061325]/44 text-white hover:border-accent/50 hover:bg-white/10"
                          : "border-white/5 bg-white/[0.025] text-blue-200/45"
                  }`}
                  onClick={() => {
                    setSelected(date);
                    setCursor(date);
                  }}
                >
                  <span className="text-sm font-black leading-none sm:text-base">{monthDay}</span>
                  <span className="mt-auto font-mono text-[10px] opacity-60" dir="ltr">{gregorianDay}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
