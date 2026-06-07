import type { Metadata } from "next";
import { Card } from "@/shared/components/Card";
import { PageHero } from "@/shared/components/PageHero";

export const metadata: Metadata = {
  title: "آموزش صادرات و واردات | خوبروز",
  description: "آموزش صادرات و واردات در خوبروز برای آشنایی عملی با مسیر تجارت خارجی، اسناد، مذاکرات، ثبت سفارش و ترخیص کالا."
};

export default function EducationPage() {
  return (
    <main>
      <PageHero eyebrow="آموزش تجارت" title="آموزش صادرات و واردات">
        <p>آموزش‌ها برای جذب ورودی از گوگل و هدایت کاربر به خدمات، مشاوره یا فایل‌های تجاری طراحی می‌شوند.</p>
      </PageHero>
      <section className="bg-white py-16 md:py-20"><div className="container grid gap-4 md:grid-cols-3"><Card><h2 className="mb-2 text-xl font-black text-primary">آموزش واردات</h2><p className="text-muted">مراحل واردات کالا، ثبت سفارش، حمل و ترخیص.</p></Card><Card><h2 className="mb-2 text-xl font-black text-primary">آموزش صادرات</h2><p className="text-muted">انتخاب بازار هدف، مذاکره، قرارداد و اسناد صادراتی.</p></Card><Card><h2 className="mb-2 text-xl font-black text-primary">آموزش اسناد تجاری</h2><p className="text-muted">پروفرما، پکینگ لیست، اینویس و قراردادها.</p></Card></div></section>
    </main>
  );
}
