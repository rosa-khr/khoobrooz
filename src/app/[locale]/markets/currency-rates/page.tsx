import type { Metadata } from "next";
import { PageHero } from "@/shared/components/PageHero";
import { Button } from "@/shared/components/Button";
import { contact } from "@/core/lib/site";
import { WorldMapPattern } from "@/shared/components/WorldMapPattern";
import { fetchTgjuMarketRates, MarketRate, MarketRateGroup, marketRateGroupDescriptions, marketRateGroupLabels } from "@/core/lib/tgju";

export const metadata: Metadata = {
  title: "قیمت ارزهای رایج تجارت خارجی | خوبروز",
  description: "جدول نرخ رسمی، حواله تجاری، ارز بازار، طلا و سکه برای واردات، صادرات، ترخیص کالا و محاسبات تجارت خارجی."
};

export const revalidate = 21600;

const groups: MarketRateGroup[] = ["official", "commercialTransfer", "commodityTransfer", "market", "metal", "coin"];

export default async function CurrencyRatesPage() {
  const market = await getMarketRates();

  return (
    <main>
      <PageHero eyebrow="بازار ارز" title="قیمت ارزهای رایج تجارت خارجی">
        <p>نرخ رسمی، حواله تجاری، ارز بازار، طلا و سکه.</p>
      </PageHero>

      <section className="relative overflow-hidden bg-white py-16 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(244,178,62,0.16),transparent_34%),linear-gradient(180deg,#ffffff,rgba(255,255,255,0.9))]" aria-hidden="true" />
        <WorldMapPattern className="z-0 text-primary opacity-[0.2]" />
        <div className="absolute inset-0 bg-white/68" aria-hidden="true" />
        <div className="container relative z-10">
          <div className="relative mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-2xl font-black text-primary">جدول ارزهای رایج</h2>
              <p className="mt-2 max-w-2xl text-muted">
                آخرین دریافت به وقت ایران: {market.fetchedAt}
              </p>
            </div>
            <span className="text-sm font-extrabold text-muted">منبع داده: مرکز مبادله، بازار و بانک مرکزی</span>
          </div>

          {market.hasError ? (
            <div className="rounded-khoobrooz border border-[#ead1a4] bg-[#fff8eb] p-5 text-sm font-bold text-[#7a4a00]">
              دریافت نرخ‌ها در حال حاضر ممکن نیست. لطفاً کمی بعد دوباره بررسی کنید.
            </div>
          ) : (
            <div className="space-y-6">
              {groups.map((group) => (
                <RateTable
                  key={group}
                  title={marketRateGroupLabels[group]}
                  description={marketRateGroupDescriptions[group]}
                  rates={market.rates.filter((rate) => rate.group === group)}
                />
              ))}
            </div>
          )}

          <div className="relative mt-6 grid gap-4 rounded-khoobrooz border border-line bg-white/85 p-5 backdrop-blur md:grid-cols-[1fr_auto] md:items-center">
            <p className="text-muted">
              برای محاسبات رسمی گمرکی، نرخ نهایی باید با مقررات و منبع رسمی همان روز کنترل شود.
            </p>
            <Button href={contact.generalWhatsappUrl} variant="secondary">مشاوره محاسبه هزینه واردات</Button>
          </div>
        </div>
      </section>
    </main>
  );
}

async function getMarketRates() {
  try {
    return {
      ...(await fetchTgjuMarketRates()),
      hasError: false
    };
  } catch {
    return {
      rates: [],
      fetchedAt: "نامشخص",
      sourceName: "TGJU",
      hasError: true
    };
  }
}

function RateTable({ title, description, rates }: { title: string; description: string; rates: MarketRate[] }) {
  return (
    <section className="overflow-hidden rounded-khoobrooz border border-line bg-white/92 shadow-soft backdrop-blur">
      <div className="flex flex-col justify-between gap-2 border-b border-line bg-[#f6f8fb] px-4 py-3 md:flex-row md:items-center">
        <div>
          <h2 className="text-lg font-black text-primary">{title}</h2>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>
        <span className="text-xs font-bold text-muted">{rates.length} مورد</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[860px] w-full border-collapse text-right">
          <thead className="text-sm text-primary">
            <tr>
              <th className="p-4 font-black">نماد</th>
              <th className="p-4 font-black">عنوان</th>
              <th className="p-4 font-black">قیمت</th>
              <th className="p-4 font-black">بیشترین</th>
              <th className="p-4 font-black">کمترین</th>
              <th className="p-4 font-black">تغییر</th>
              <th className="p-4 font-black">زمان منبع</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((rate) => (
              <tr key={rate.key} className="border-t border-line">
                <td className="p-4 font-black text-primary" dir="ltr">{rate.symbol}</td>
                <td className="p-4">{rate.title}</td>
                <td className="p-4 font-extrabold text-primary">
                  <span dir="ltr">{rate.price}</span>
                  <span className="mr-1 text-xs text-muted">{rate.unit}</span>
                </td>
                <td className="p-4 text-muted" dir="ltr">{rate.high}</td>
                <td className="p-4 text-muted" dir="ltr">{rate.low}</td>
                <td className="p-4">
                  <RateChange rate={rate} />
                </td>
                <td className="p-4 text-sm text-muted" dir="ltr">{rate.updatedAt}</td>
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
    <span className={`inline-flex min-w-[96px] justify-center rounded-khoobrooz px-3 py-1 text-xs font-black ${color}`} dir="ltr">
      {label}
    </span>
  );
}
