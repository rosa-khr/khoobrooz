import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/shared/components/Card";
import { PageHero } from "@/shared/components/PageHero";
import { Button } from "@/shared/components/Button";
import { Locale, localizedPath } from "@/core/lib/site";
import { getDictionary } from "@/data/i18n";

type ServiceListItem = {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  description?: string;
  cta?: string;
  href?: string;
  accuracy: 0 | 1 | 2;
  isPublished?: boolean | 0 | 1;
};

type ServicesResponse = {
  responseStatus: 0 | 1;
  response: {
    items: ServiceListItem[];
    total: number;
  };
};

const backendApiBaseUrl = process.env.BACKEND_API_URL?.replace(/\/api\/v1$/, "") ?? "http://localhost:8000";

async function loadServices() {
  try {
    const response = await fetch(`${backendApiBaseUrl}/api/v1/services`, {
      cache: "no-store"
    });
    const payload = (await response.json()) as ServicesResponse;

    if (!response.ok || payload.responseStatus !== 1) {
      return [];
    }

    return payload.response.items.filter((service) => service.accuracy === 1 && service.isPublished !== false && service.isPublished !== 0);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const page = getDictionary(locale).pages.services;
  return { title: page.title, description: page.description };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dictionary = getDictionary(locale);
  const page = dictionary.pages.services;
  const services = await loadServices();

  return (
    <main data-dynamic-content>
      <PageHero eyebrow={page.eyebrow} title={page.heading}>
        <p>{page.body}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={localizedPath(locale, "/contact")}>{page.consult}</Button>
          <Button href={localizedPath(locale, "/services/customs-clearance")} variant="orange">{page.customs}</Button>
        </div>
      </PageHero>
      <section className="bg-white py-16 md:py-20">
        <div className="container grid gap-4 md:grid-cols-3">
          {services.length === 0 ? (
            <Card>
              <h2 className="mb-2 text-xl font-black text-primary">خدمتی برای نمایش ثبت نشده است</h2>
              <p className="text-muted">بعد از ثبت خدمات در پنل مدیریت، این بخش به صورت داینامیک تکمیل می‌شود.</p>
            </Card>
          ) : services.map((service, index) => (
            <Card key={service.id} warm={index === 0}>
              <h2 className="mb-2 text-xl font-black text-primary">{service.title}</h2>
              <p className="mb-4 text-muted">{service.summary || service.description}</p>
              <Link className="font-extrabold text-secondary" href={localizedPath(locale, service.href || `/services/${service.slug}`)}>{service.cta || page.view}</Link>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
