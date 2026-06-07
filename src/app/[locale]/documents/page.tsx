import type { Metadata } from "next";
import { Card } from "@/shared/components/Card";
import { PageHero } from "@/shared/components/PageHero";
import { documentItems } from "@/data/content";

export const metadata: Metadata = {
  title: "فایل‌ها و اسناد تجاری | خوبروز",
  description: "فروش فایل‌ها و اسناد تجاری خوبروز شامل نمونه پروفرما، پکینگ لیست، قرارداد صادراتی، چک‌لیست ترخیص و فایل‌های اکسل محاسباتی."
};

export default function DocumentsPage() {
  return (
    <main>
      <PageHero eyebrow="اسناد تجاری" title="فایل‌ها و اسناد تجاری">
        <p>این بخش در فاز بعدی برای فروش فایل دیجیتال و اتصال به زرین‌پال آماده می‌شود.</p>
      </PageHero>
      <section className="bg-white py-16 md:py-20"><div className="container grid gap-4 md:grid-cols-3">{documentItems.map((item, index) => <Card key={item.title} teal={index === 0}><h2 className="mb-2 text-xl font-black text-primary">{item.title}</h2><p className="text-muted">{item.description}</p></Card>)}</div></section>
    </main>
  );
}
