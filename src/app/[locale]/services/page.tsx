import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/shared/components/Card";
import { PageHero } from "@/shared/components/PageHero";
import { Button } from "@/shared/components/Button";
import { services } from "@/data/content";
import { Locale, localizedPath } from "@/core/lib/site";

export const metadata: Metadata = {
  title: "خدمات بازرگانی خوبروز | ترخیص، واردات، صادرات و کارگو",
  description: "صفحه خدمات خوبروز شامل ترخیص کالا، ثبت سفارش واردات، واردات کالا، واردات از چین، کارگو چین، صادرات و مشاوره امور گمرکی است."
};

export default async function ServicesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <main>
      <PageHero eyebrow="خدمات بازرگانی" title="خدمات بازرگانی خوبروز">
        <p>هر خدمت صفحه مستقل و قابل توسعه دارد تا مسیر مشاوره و تبدیل کاربر واضح باشد.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={localizedPath(locale, "/contact")}>درخواست مشاوره</Button>
          <Button href={localizedPath(locale, "/services/customs-clearance")} variant="orange">ترخیص کالا</Button>
        </div>
      </PageHero>
      <section className="bg-white py-16 md:py-20">
        <div className="container grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title} warm={service.featured}>
              <h2 className="mb-2 text-xl font-black text-primary">{service.title}</h2>
              <p className="mb-4 text-muted">{service.description}</p>
              {service.href && <Link className="font-extrabold text-secondary" href={localizedPath(locale, service.href)}>مشاهده</Link>}
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
