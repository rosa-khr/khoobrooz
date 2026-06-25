import type { Metadata } from "next";
import { PageHero } from "@/shared/components/PageHero";
import { WorldMapPattern } from "@/shared/components/WorldMapPattern";
import { MarketRatesBoard } from "@/shared/components/MarketRatesBoard";

export const metadata: Metadata = {
  title: "قیمت ارزهای رایج تجارت خارجی | خوبروز",
  description: "جدول ارز بازار، طلا و سکه برای واردات، صادرات، ترخیص کالا و محاسبات تجارت خارجی."
};

export default function CurrencyRatesPage() {
  return (
    <main>
      <PageHero eyebrow="بازار ارز" title="قیمت ارزهای رایج تجارت خارجی">
        <p>ارز بازار، طلا و سکه.</p>
      </PageHero>

      <section className="relative overflow-hidden bg-white py-16 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(244,178,62,0.16),transparent_34%),linear-gradient(180deg,#ffffff,rgba(255,255,255,0.9))]" aria-hidden="true" />
        <WorldMapPattern className="z-0 text-primary opacity-[0.2]" />
        <div className="absolute inset-0 bg-white/68" aria-hidden="true" />
        <div className="container relative z-10">
          <MarketRatesBoard initialRates={[]} initialFetchedAt="نامشخص" />
        </div>
      </section>
    </main>
  );
}
