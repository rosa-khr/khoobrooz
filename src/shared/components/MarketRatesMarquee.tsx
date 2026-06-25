"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { MarketRate } from "@/core/lib/tgju";
import { Locale, localizedPath } from "@/core/lib/site";
import { getCachedMarketRates, getMarketRatesWithCache } from "@/core/lib/marketRateClientCache";
import { marketRatesCacheTtlMs } from "@/core/lib/marketRateConfig";

const homeMarketRateItems = [
  { key: "bourse", title: "بورس" },
  { key: "ons", title: "انس طلا" },
  { key: "mesghal", title: "مثقال طلا" },
  { key: "geram18", title: "طلا" },
  { key: "sekee", title: "سکه" },
  { key: "price_dollar_rl", title: "دلار" },
  { key: "price_eur", title: "یورو" },
  { key: "oil_brent", title: "نفت برنت" },
  { key: "crypto-bitcoin", title: "بیت‌کوین" }
];

function selectHomeMarketRates(rates: MarketRate[]) {
  return homeMarketRateItems
    .map((item) => {
      const rate = rates.find((marketRate) => marketRate.key === item.key);

      return rate ? { ...rate, title: item.title } : undefined;
    })
    .filter((rate): rate is MarketRate => Boolean(rate));
}

export function MarketRatesMarquee({
  locale,
  rates
}: {
  locale: Locale;
  rates: MarketRate[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const isDragging = useRef(false);
  const isPaused = useRef(false);
  const isVisible = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [currentRates, setCurrentRates] = useState(rates);
  const [refreshError, setRefreshError] = useState(false);

  useEffect(() => {
    setCurrentRates(rates);
  }, [rates]);

  useEffect(() => {
    let mounted = true;

    const refreshMarketRates = async () => {
      try {
        const payload = await getMarketRatesWithCache();

        if (!mounted) {
          return;
        }

        setCurrentRates(selectHomeMarketRates(payload.rates));
        setRefreshError(false);
      } catch {
        if (mounted) {
          setRefreshError(true);
        }
      }
    };

    const cached = getCachedMarketRates();

    if (cached) {
      setCurrentRates(selectHomeMarketRates(cached.rates));
      setRefreshError(false);
    }

    refreshMarketRates();
    const timer = window.setInterval(refreshMarketRates, marketRatesCacheTtlMs);

    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
      },
      { threshold: 0.08 }
    );

    observer.observe(scroller);

    const timer = window.setInterval(() => {
      if (isVisible.current && !document.hidden && !isPaused.current && !isDragging.current) {
        scroller.scrollLeft += 1;

        if (scroller.scrollLeft >= scroller.scrollWidth / 2) {
          scroller.scrollLeft -= scroller.scrollWidth / 2;
        }
      }
    }, 70);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    isDragging.current = true;
    setDragging(true);
    dragStartX.current = event.clientX;
    dragStartScroll.current = scroller.scrollLeft;
    scroller.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    if (!scroller || !isDragging.current) {
      return;
    }

    scroller.scrollLeft = dragStartScroll.current - (event.clientX - dragStartX.current);
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    isDragging.current = false;
    setDragging(false);

    if (scroller?.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <section className="border-y border-[#ead9b8] bg-[#fffaf0] py-2 text-primary">
      <div className="container">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="shrink-0 text-xs font-extrabold text-primary">
              برد بازار
            </h2>
          </div>
          <Link href={localizedPath(locale, "/markets/currency-rates")} className="inline-flex shrink-0 items-center gap-1 text-[10px] font-extrabold text-secondary">
            جدول کامل
            <ArrowLeft className="size-3" aria-hidden="true" />
          </Link>
        </div>
        {currentRates.length === 0 ? (
          <div className="rounded-[5px] border border-line bg-background px-3 py-1.5 text-xs font-bold text-muted">
            دریافت نرخ‌ها در حال حاضر ممکن نیست.
          </div>
        ) : (
          <div
            ref={scrollerRef}
            className={`overflow-x-auto overflow-y-hidden [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
            dir="ltr"
            onMouseEnter={() => {
              isPaused.current = true;
            }}
            onMouseLeave={() => {
              isPaused.current = false;
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <div className="flex w-max gap-2">
              {[...currentRates, ...currentRates].map((rate, index) => (
                <article key={`${rate.key}-${index}`} className="flex h-8 w-[260px] flex-none items-center gap-2 rounded-[5px] border border-[#ead9b8] bg-white px-2.5 text-right shadow-[inset_3px_0_0_#f4b23e,0_4px_10px_rgba(11,31,58,0.035)]" dir="rtl">
                  <strong className="min-w-0 flex-1 whitespace-nowrap text-[11px] font-extrabold text-primary">{rate.title}</strong>
                  <span className="rounded-[4px] bg-[#fff4dc] px-1.5 text-[10px] font-bold text-[#9a5d08]" dir="ltr">{rate.symbol}</span>
                  <span className="shrink-0 text-xs font-extrabold leading-none text-primary" dir="ltr">{rate.price}</span>
                  <span className="shrink-0 text-[10px] font-semibold text-muted">{rate.unit}</span>
                  {rate.changePercent !== null && (
                    <span className={`shrink-0 text-[10px] font-black ${rate.direction === "high" ? "text-[#167245]" : rate.direction === "low" ? "text-[#a43e21]" : "text-muted"}`} dir="ltr">
                      {rate.changePercent}%
                    </span>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}
        {refreshError && currentRates.length > 0 && (
          <p className="mt-1 text-[10px] font-bold text-muted">بروزرسانی نرخ‌ها ناموفق بود.</p>
        )}
      </div>
    </section>
  );
}
