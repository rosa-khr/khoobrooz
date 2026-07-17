"use client";

import { useEffect, useState } from "react";
import type { MarketRate, MarketRateGroup } from "@/core/lib/marketRatesSchema";
import { marketRateGroupDescriptions, marketRateGroupLabels } from "@/core/lib/marketRatesSchema";
import { getMarketRatesWithCache, subscribeToMarketRates } from "@/core/lib/marketRateClientCache";
import { marketRatesCacheTtlMs } from "@/core/lib/marketRateConfig";

const groups: MarketRateGroup[] = ["market", "commercialTransfer", "metal", "coin"];

function formatMarketDateTime(value: string) {
  if (!value || value === "نامشخص") {
    return value;
  }

  const normalized = value.replace(",", "").trim();
  const isoLike = normalized.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);

  if (!isoLike) {
    return value;
  }

  const [, year, month, day, hour, minute, second = "0"] = isoLike;
  const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);
}

export function MarketRatesBoard({
  initialRates,
  initialFetchedAt,
  initialHasError = false
}: {
  initialRates: MarketRate[];
  initialFetchedAt: string;
  initialHasError?: boolean;
}) {
  const [rates, setRates] = useState(initialRates);
  const [fetchedAt, setFetchedAt] = useState(initialFetchedAt);
  const [hasError, setHasError] = useState(initialHasError);

  useEffect(() => {
    let mounted = true;

    const applyMarketRates = (payload: { rates: MarketRate[]; fetchedAt: string }) => {
      if (!mounted) {
        return;
      }

      setRates(payload.rates);
      setFetchedAt(payload.fetchedAt);
      setHasError(false);
    };

    const unsubscribe = subscribeToMarketRates(applyMarketRates, {
      onError: () => {
        if (mounted) {
          setHasError(true);
        }
      }
    });

    const refreshMarketRates = async () => {
      try {
        applyMarketRates(await getMarketRatesWithCache({ force: true }));
      } catch {
        if (mounted) {
          setHasError(true);
        }
      }
    };

    refreshMarketRates();
    const timer = window.setInterval(refreshMarketRates, marketRatesCacheTtlMs);

    return () => {
      mounted = false;
      unsubscribe();
      window.clearInterval(timer);
    };
  }, []);

  return (
    <>
      <div className="relative mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-black text-primary">جدول ارزهای رایج</h2>
          <p className="mt-2 max-w-2xl text-muted">زمان بروزرسانی به وقت ایران: {formatMarketDateTime(fetchedAt)}</p>
        </div>
      </div>

      {hasError && rates.length === 0 ? (
        <div className="rounded-khoobrooz border border-[#ead1a4] bg-[#fff8eb] p-5 text-sm font-bold text-[#7a4a00]">
          دریافت نرخ‌ها در حال حاضر ممکن نیست. لطفا کمی بعد دوباره بررسی کنید.
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <RateTable
              key={group}
              group={group}
              title={marketRateGroupLabels[group]}
              rates={rates.filter((rate) => rate.group === group)}
            />
          ))}
          {hasError && rates.length > 0 && (
            <p className="text-xs font-bold text-muted">بروزرسانی نرخ‌ها ناموفق بود؛ آخرین داده دریافت‌شده نمایش داده می‌شود.</p>
          )}
        </div>
      )}
    </>
  );
}

function RateTable({ group, title, rates }: { group: MarketRateGroup; title: string; rates: MarketRate[] }) {
  return (
    <section data-dynamic-content className="overflow-hidden rounded-khoobrooz border border-line bg-white/92 shadow-soft backdrop-blur">
      <div className="flex flex-col justify-between gap-2 border-b border-line bg-[#f6f8fb] px-3 py-2.5 md:flex-row md:items-center">
        <div>
          <h2 className="text-base font-black text-primary">{title}</h2>
          <p className="mt-1 text-[11px] font-bold leading-5 text-muted">{marketRateGroupDescriptions[group]}</p>
        </div>
        <span className="text-xs font-bold text-muted">{rates.length} مورد</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full border-collapse text-right text-sm">
          <thead className="text-xs text-primary">
            <tr>
              <th className="whitespace-nowrap px-3 py-3 font-black">عنوان</th>
              <th className="whitespace-nowrap px-3 py-3 font-black">قیمت</th>
              <th className="whitespace-nowrap px-3 py-3 font-black">بیشترین</th>
              <th className="whitespace-nowrap px-3 py-3 font-black">کمترین</th>
              <th className="whitespace-nowrap px-3 py-3 font-black">تغییر</th>
              <th className="whitespace-nowrap px-3 py-3 font-black">زمان</th>
            </tr>
          </thead>
          <tbody>
            {rates.length === 0 ? (
              <tr className="border-t border-line">
                <td className="px-3 py-3 text-sm font-bold text-muted" colSpan={6}>
                  داده‌ای برای این گروه نرخ در آخرین دریافت موجود نیست.
                </td>
              </tr>
            ) : rates.map((rate) => (
              <tr key={rate.key} className="border-t border-line">
                <td className="min-w-[150px] whitespace-nowrap px-3 py-3">
                  <span className="inline font-extrabold text-primary">{rate.title}</span>
                  <span className="me-2 inline text-xs font-black text-muted" dir="ltr">{rate.symbol}</span>
                </td>
                <td className="whitespace-nowrap px-3 py-3 font-extrabold text-primary">
                  <span dir="ltr">{rate.price}</span>
                  <span className="mr-1 text-xs text-muted">{rate.unit}</span>
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-xs font-bold text-muted" dir="ltr">{rate.high}</td>
                <td className="whitespace-nowrap px-3 py-3 text-xs font-bold text-muted" dir="ltr">{rate.low}</td>
                <td className="whitespace-nowrap px-3 py-3">
                  <RateChange rate={rate} />
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-xs text-muted">{formatMarketDateTime(rate.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RateChange({ rate }: { rate: MarketRate }) {
  const color =
    rate.direction === "high"
      ? "bg-[#ecf8f1] text-[#167245]"
      : rate.direction === "low"
        ? "bg-[#fff1ed] text-[#a43e21]"
        : "bg-background text-muted";

  const label = rate.changePercent === null ? rate.change : `${rate.change} / ${rate.changePercent}%`;

  return (
    <span className={`inline-flex min-w-[92px] justify-center rounded-khoobrooz px-2.5 py-1 text-xs font-black ${color}`} dir="ltr">
      {label}
    </span>
  );
}
