"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import { worldClockItems } from "@/data/market";
import { TradeCalendar } from "@/shared/components/DateTools";
import { WorldMapPattern } from "@/shared/components/WorldMapPattern";
import { SevenSegmentTime } from "@/shared/components/SevenSegmentTime";

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

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="bg-white py-8 md:py-10">
      <div className="container">
        <div className="relative overflow-hidden rounded-khoobrooz border border-line bg-[#0a2138] p-5 text-white shadow-soft md:p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(244,178,62,0.13),transparent_34%),linear-gradient(90deg,rgba(10,33,56,0.96),rgba(12,45,70,0.84),rgba(8,26,44,0.95))]" aria-hidden="true" />
          <WorldMapPattern className="z-0 text-[#d7e7f4] opacity-[0.36]" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#0a2138]/78 via-[#0a2138]/18 to-[#07172b]/88" aria-hidden="true" />

          <div className="relative z-10 grid gap-3">
            <div className="flex flex-col justify-between gap-2 lg:flex-row lg:items-end">
              <div className="min-w-0">
                <h2 className="inline-flex items-center gap-2 text-xl font-black text-white md:text-2xl">
                  <Clock3 className="size-4 text-accent" aria-hidden="true" />
                  ساعت بازارهای مهم تجارت بین‌المللی
                </h2>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {worldClockItems.map((item) => (
                <div key={item.timeZone} className="min-w-0 rounded-khoobrooz border border-white/15 bg-white/10 p-2.5 backdrop-blur">
                  <div className="flex justify-end">
                    <SevenSegmentTime value={formatDigitalTime(now, item.timeZone)} className="justify-self-end" />
                  </div>
                  <h3 className="mt-1.5 truncate text-sm font-black text-white">{item.city}</h3>
                  <div className="mt-1.5 flex items-center justify-between gap-2 border-t border-white/10 pt-1.5 text-xs">
                    <span className="text-blue-200">{item.country}</span>
                    <span className="inline-flex items-center gap-1 rounded-[4px] bg-white/10 px-1.5 py-0.5 font-mono font-black text-accent">
                      <span className="text-[12px] leading-none" aria-hidden="true">{item.flag}</span>
                      {item.code}
                    </span>
                  </div>
                  <p className="mt-1.5 truncate text-xs text-blue-100">{item.market}</p>
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
