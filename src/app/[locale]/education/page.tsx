import type { Metadata } from "next";
import { Card } from "@/shared/components/Card";
import { PageHero } from "@/shared/components/PageHero";
import { Locale } from "@/core/lib/site";
import { getDictionary } from "@/data/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const page = getDictionary(locale).pages.education;
  return { title: page.title, description: page.description };
}

export default async function EducationPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const page = getDictionary(locale).pages.education;

  return (
    <main>
      <PageHero eyebrow={page.eyebrow} title={page.heading}>
        <p>{page.body}</p>
      </PageHero>
      <section className="bg-white py-16 md:py-20"><div className="container grid gap-4 md:grid-cols-3">{page.cards.map((item) => <Card key={item.title}><h2 className="mb-2 text-xl font-black text-primary">{item.title}</h2><p className="text-muted">{item.description}</p></Card>)}</div></section>
    </main>
  );
}
