import type { Metadata } from "next";
import { Card } from "@/shared/components/Card";
import { PageHero } from "@/shared/components/PageHero";
import { Button } from "@/shared/components/Button";
import { contact, Locale, localizedPath } from "@/core/lib/site";
import { getDictionary } from "@/data/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const page = getDictionary(locale).pages.customs;
  return { title: page.title, description: page.description };
}

export default async function CustomsClearancePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const page = getDictionary(locale).pages.customs;

  return (
    <main>
      <PageHero eyebrow={page.eyebrow} title={page.heading}>
        <p>{page.body}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={contact.clearancePhoneUrl} variant="orange">{page.primary}</Button>
          <Button href={localizedPath(locale, "/services")} variant="outline">{page.back}</Button>
        </div>
      </PageHero>
      <section className="bg-white py-16 md:py-20">
        <div className="container grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card warm>
            <h2 className="mb-2 text-xl font-black text-primary">{page.cardTitle}</h2>
            <p className="mb-5 text-muted">{page.cardBody}</p>
            <Button href={contact.clearancePhoneUrl} variant="orange">{contact.clearancePhone}</Button>
          </Card>
          <div className="grid gap-4">
            {page.info.map((item) => (
              <Card key={item.title}><h2 className="mb-2 text-xl font-black text-primary">{item.title}</h2><p className="text-muted">{item.description}</p></Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
