import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { commonCurrencyRows, currencyRateSource } from "@/data/market";
import { PageHero } from "@/shared/components/PageHero";
import { Button } from "@/shared/components/Button";
import { contact } from "@/core/lib/site";
import { WorldMapPattern } from "@/shared/components/WorldMapPattern";

export const metadata: Metadata = {
  title: "قیمت ارزهای رایج تجارت خارجی | خوبروز",
  description: "جدول ارزهای رایج برای واردات، صادرات، ترخیص کالا و محاسبات تجارت خارجی با منبع پیشنهادی TGJU."
};

export default function CurrencyRatesPage() {
  return (
    <main>
      <PageHero eyebrow="بازار ارز" title="قیمت ارزهای رایج تجارت خارجی">
        <p>این بخش برای نمایش دلار، یورو، درهم، پوند، یوان و سایر ارزهای پرکاربرد تجارت طراحی شده و برای اتصال به آپدیت‌کننده TGJU آماده است.</p>
      </PageHero>

      <section className="relative overflow-hidden bg-white py-16 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(244,178,62,0.16),transparent_34%),linear-gradient(180deg,#ffffff,rgba(255,255,255,0.9))]" aria-hidden="true" />
        <WorldMapPattern className="z-0 text-primary opacity-[0.2]" />
        <div className="absolute inset-0 bg-white/68" aria-hidden="true" />
        <div className="container relative z-10">
          <div className="relative mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-2xl font-black text-primary">جدول ارزهای رایج</h2>
              <p className="mt-2 max-w-2xl text-muted">برای جلوگیری از نمایش نرخ نادرست، عددها بعد از اتصال ایجنت نرخ ارز و اعتبارسنجی منبع وارد می‌شوند.</p>
            </div>
            <Link
              href={currencyRateSource.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-extrabold text-secondary"
            >
              منبع TGJU
              <ExternalLink className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="relative overflow-hidden rounded-khoobrooz border border-line bg-white/90 shadow-soft backdrop-blur">
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full border-collapse text-right">
                <thead className="bg-background text-sm text-primary">
                  <tr>
                    <th className="p-4 font-black">نماد</th>
                    <th className="p-4 font-black">ارز</th>
                    <th className="p-4 font-black">کاربرد در تجارت</th>
                    <th className="p-4 font-black">نرخ</th>
                    <th className="p-4 font-black">وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  {commonCurrencyRows.map((currency) => (
                    <tr key={currency.symbol} className="border-t border-line">
                      <td className="p-4 font-black text-primary">{currency.symbol}</td>
                      <td className="p-4">{currency.title}</td>
                      <td className="p-4 text-muted">{currency.useCase}</td>
                      <td className="p-4 font-extrabold text-primary">پس از اتصال کرالر</td>
                      <td className="p-4">
                        <span className="rounded-khoobrooz bg-[#fff7e6] px-3 py-1 text-xs font-black text-[#9a5b00]">
                          آماده اتصال
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="relative mt-6 grid gap-4 rounded-khoobrooz border border-line bg-white/85 p-5 backdrop-blur md:grid-cols-[1fr_auto] md:items-center">
            <p className="text-muted">
              آخرین وضعیت: {currencyRateSource.updatedAt}. این جدول باید با زمان آپدیت، منبع و خطای احتمالی کرالر همراه باشد.
            </p>
            <Button href={contact.generalWhatsappUrl} variant="secondary">مشاوره محاسبه هزینه واردات</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
