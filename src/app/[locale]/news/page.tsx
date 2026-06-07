import type { Metadata } from "next";
import { Card } from "@/shared/components/Card";
import { PageHero } from "@/shared/components/PageHero";

export const metadata: Metadata = {
  title: "بخشنامه‌ها و اخبار گمرکی | خوبروز",
  description: "بخشنامه‌ها و اخبار تجارت و گمرک در خوبروز با تمرکز بر قوانین واردات، صادرات، ثبت سفارش و ترخیص کالا."
};

export default function NewsPage() {
  return (
    <main>
      <PageHero eyebrow="اخبار تجارت" title="بخشنامه‌ها و اخبار گمرکی">
        <p>این بخش برای محتوای زمان‌دار است و باید هنگام انتشار با تاریخ دقیق و منابع معتبر به‌روزرسانی شود.</p>
      </PageHero>
      <section className="bg-white py-16 md:py-20"><div className="container grid gap-4 md:grid-cols-3"><Card><h2 className="mb-2 text-xl font-black text-primary">بخشنامه‌های گمرکی</h2><p className="text-muted">نیازمند بررسی تاریخ و منبع رسمی.</p></Card><Card><h2 className="mb-2 text-xl font-black text-primary">اخبار ثبت سفارش</h2><p className="text-muted">اتصال محتوایی به خدمات ثبت سفارش واردات.</p></Card><Card><h2 className="mb-2 text-xl font-black text-primary">تغییرات قوانین واردات و صادرات</h2><p className="text-muted">محتوای زمان‌دار با هشدار نیاز به اعتبارسنجی.</p></Card></div></section>
    </main>
  );
}
