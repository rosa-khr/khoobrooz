import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/shared/components/Card";
import { PageHero } from "@/shared/components/PageHero";
import { Locale, localizedPath } from "@/core/lib/site";

export const metadata: Metadata = {
  title: "سوالات متداول تجارت خارجی | خوبروز",
  description: "پاسخ سوالات متداول درباره ترخیص کالا، واردات، صادرات، ثبت سفارش، کارگو چین، آموزش و فایل‌های تجاری خوبروز."
};

export default async function FaqPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <main>
      <PageHero eyebrow="سوالات متداول" title="سوالات متداول">
        <p>پاسخ‌ها باید کاربر را به صفحه خدمات، مقاله مرتبط یا مسیر تماس درست هدایت کنند.</p>
      </PageHero>
      <section className="bg-white py-16 md:py-20"><div className="container grid gap-4"><Card><h2 className="mb-2 text-xl font-black text-primary">برای ترخیص کالا از کجا شروع کنم؟</h2><p className="mb-4 text-muted">ابتدا نوع کالا، مدارک و گمرک مورد نظر باید بررسی شود. برای درخواست‌های ترخیص از مسیر تماس اختصاصی ترخیص استفاده کنید.</p><Link className="font-extrabold text-secondary" href={localizedPath(locale, "/services/customs-clearance")}>صفحه ترخیص کالا</Link></Card><Card><h2 className="mb-2 text-xl font-black text-primary">فروش فایل‌ها چه زمانی فعال می‌شود؟</h2><p className="text-muted">در فاز بعدی، فایل‌ها با صفحه محصول و اتصال به زرین‌پال آماده می‌شوند.</p></Card></div></section>
    </main>
  );
}
