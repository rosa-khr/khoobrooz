import type { Metadata } from "next";
import { Card } from "@/shared/components/Card";
import { PageHero } from "@/shared/components/PageHero";
import { knowledgeItems } from "@/data/content";

export const metadata: Metadata = {
  title: "دانشنامه تجارت | اصطلاحات واردات، صادرات و گمرک",
  description: "دانشنامه تجارت خوبروز شامل اصطلاحات گمرکی، واردات، صادرات، پروفرما، پکینگ لیست، بارنامه، HS Code و سامانه جامع تجارت."
};

export default function KnowledgePage() {
  return (
    <main>
      <PageHero eyebrow="دانشنامه تجارت" title="دانشنامه تجارت">
        <p>محتوای دانشنامه برای جذب جستجوهای اطلاعاتی و لینک دادن به صفحات خدمات و فایل‌های تجاری ساخته می‌شود.</p>
      </PageHero>
      <section className="bg-white py-16 md:py-20"><div className="container grid gap-4 md:grid-cols-3">{knowledgeItems.map((item) => <Card key={item.title}><h2 className="mb-2 text-xl font-black text-primary">{item.title}</h2><p className="text-muted">{item.description}</p></Card>)}</div></section>
    </main>
  );
}
