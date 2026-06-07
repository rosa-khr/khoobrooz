import type { Metadata } from "next";
import { Card } from "@/shared/components/Card";
import { PageHero } from "@/shared/components/PageHero";

export const metadata: Metadata = {
  title: "درباره خوبروز | همراه تخصصی تجارت خارجی",
  description: "خوبروز برند خدمات بازرگانی، آموزش صادرات و واردات، ترخیص کالا و فروش فایل‌ها و اسناد تجاری است."
};

export default function AboutPage() {
  return (
    <main>
      <PageHero eyebrow="درباره خوبروز" title="درباره خوبروز">
        <p>خوبروز به افراد و کسب‌وکارها کمک می‌کند مسیر تجارت خارجی، واردات، صادرات، ترخیص و اسناد تجاری را شفاف‌تر و اجرایی‌تر ببینند.</p>
      </PageHero>
      <section className="bg-white py-16 md:py-20"><div className="container grid gap-5 lg:grid-cols-[0.9fr_1.1fr]"><Card warm><h2 className="mb-2 text-xl font-black text-primary">جایگاه برند</h2><p className="text-muted">خوبروز فقط آکادمی یا فروشگاه فایل نیست؛ مرکز سایت خدمات بازرگانی و مشاوره عملی است.</p></Card><Card><h2 className="mb-2 text-xl font-black text-primary">ارزش‌ها</h2><ul className="list-disc space-y-1 pr-5 text-muted"><li>شفافیت در مسیر و مدارک</li><li>دقت در محتوای تخصصی</li><li>پرهیز از ادعاهای اغراق‌آمیز</li><li>هدایت کاربر به اقدام درست</li></ul></Card></div></section>
    </main>
  );
}
