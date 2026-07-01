"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import { TradeCalendar } from "@/shared/components/DateTools";
import { WorldMapPattern } from "@/shared/components/WorldMapPattern";
import { SevenSegmentTime } from "@/shared/components/SevenSegmentTime";

type WorldClockItem = {
  id: number;
  city: string;
  country: string;
  countryCode?: string | null;
  flag?: string | null;
  timezone: string;
  marketLabel?: string | null;
};

type WorldClocksResponse = {
  responseStatus: 0 | 1;
  response: {
    items: WorldClockItem[];
    total: number;
  };
};

function formatDigitalTime(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).formatToParts(date);
  const getPart = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "00";

  return `${getPart("hour")}:${getPart("minute")}:${getPart("second")}`;
}

export function WorldTimeWidget() {
  const [now, setNow] = useState(() => new Date());
  const [worldClockItems, setWorldClockItems] = useState<WorldClockItem[]>([]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;

    fetch("/api/world-clocks", { cache: "no-store" })
      .then((response) => response.json() as Promise<WorldClocksResponse>)
      .then((payload) => {
        if (mounted && payload.responseStatus === 1) {
          setWorldClockItems(payload.response.items);
        }
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  if (worldClockItems.length === 0) {
    return null;
  }

  return (
    <section data-dynamic-content className="bg-white py-6 md:py-8">
      <div className="container">
        <div className="relative overflow-hidden rounded-khoobrooz border border-white/15 bg-[#07182b] p-4 text-white shadow-[0_18px_46px_rgba(7,24,43,0.13)] md:p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(210,132,34,0.13),transparent_30%),radial-gradient(circle_at_82%_78%,rgba(15,118,110,0.1),transparent_34%),linear-gradient(90deg,rgba(7,24,43,0.98),rgba(10,34,55,0.9),rgba(6,20,36,0.98))]" aria-hidden="true" />
          <WorldMapPattern className="z-0 text-[#eef3f7] opacity-[0.4]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,20,36,0.66),rgba(6,20,36,0.18),rgba(6,20,36,0.64))]" aria-hidden="true" />

          <div className="relative z-10 grid gap-3">
            <div className="flex flex-col justify-between gap-2 lg:flex-row lg:items-end">
              <div className="min-w-0">
                <h2 className="inline-flex items-center gap-2 text-xl font-black text-white md:text-2xl">
                  <Clock3 className="size-4 text-[#d99a3c]" aria-hidden="true" />
                  ساعت بازارهای مهم تجارت بین‌المللی
                </h2>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
              {worldClockItems.map((item) => (
                <div key={`${item.id}-${item.timezone}`} className="min-w-0 rounded-khoobrooz border border-white/[0.075] bg-[#0b243a]/62 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025),0_6px_16px_rgba(3,12,24,0.06)] backdrop-blur-[2px]">
                  <div className="flex justify-end">
                    <SevenSegmentTime value={formatDigitalTime(now, item.timezone)} className="justify-self-end" />
                  </div>
                  <h3 className="mt-1.5 truncate text-sm font-black text-white">{item.city}</h3>
                  <div className="mt-1.5 flex items-center justify-between gap-2 border-t border-white/10 pt-1.5 text-xs">
                    <span className="text-slate-300">{item.country}</span>
                    <span className="inline-flex items-center gap-1 rounded-[4px] bg-white/10 px-1.5 py-0.5 font-mono font-black text-[#d99a3c]">
                      <span className="text-[12px] leading-none" aria-hidden="true">{item.flag ?? item.countryCode}</span>
                      {item.countryCode}
                    </span>
                  </div>
                  <p className="mt-1.5 truncate text-xs text-slate-300">{item.marketLabel}</p>
                </div>
              ))}
            </div>

            <div className="pt-1">
              <TradeCalendar />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
