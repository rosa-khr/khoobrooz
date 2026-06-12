import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/shared/components/Card";
import { PageHero } from "@/shared/components/PageHero";
import { Button } from "@/shared/components/Button";
import { Locale, localizedPath } from "@/core/lib/site";
import { getDictionary } from "@/data/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const page = getDictionary(locale).pages.services;
  return { title: page.title, description: page.description };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dictionary = getDictionary(locale);
  const page = dictionary.pages.services;

  return (
    <main>
      <PageHero eyebrow={page.eyebrow} title={page.heading}>
        <p>{page.body}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={localizedPath(locale, "/contact")}>{page.consult}</Button>
          <Button href={localizedPath(locale, "/services/customs-clearance")} variant="orange">{page.customs}</Button>
        </div>
      </PageHero>
      <section className="bg-white py-16 md:py-20">
        <div className="container grid gap-4 md:grid-cols-3">
          {dictionary.services.map((service) => (
            <Card key={service.title} warm={service.featured}>
              <h2 className="mb-2 text-xl font-black text-primary">{service.title}</h2>
              <p className="mb-4 text-muted">{service.description}</p>
              {service.href && <Link className="font-extrabold text-secondary" href={localizedPath(locale, service.href)}>{page.view}</Link>}
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
