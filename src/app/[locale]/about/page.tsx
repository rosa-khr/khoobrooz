import type { Metadata } from "next";
import { Card } from "@/shared/components/Card";
import { PageHero } from "@/shared/components/PageHero";
import { Locale } from "@/core/lib/site";
import { getDictionary } from "@/data/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const page = getDictionary(locale).pages.about;
  return { title: page.title, description: page.description };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const page = getDictionary(locale).pages.about;

  return (
    <main>
      <PageHero eyebrow={page.eyebrow} title={page.heading}>
        <p>{page.body}</p>
      </PageHero>
      <section className="bg-white py-16 md:py-20"><div className="container grid gap-5 lg:grid-cols-[0.9fr_1.1fr]"><Card warm><h2 className="mb-2 text-xl font-black text-primary">{page.brandPosition}</h2><p className="text-muted">{page.brandBody}</p></Card><Card><h2 className="mb-2 text-xl font-black text-primary">{page.valuesTitle}</h2><ul className="list-disc space-y-1 pr-5 text-muted">{page.values.map((item) => <li key={item}>{item}</li>)}</ul></Card></div></section>
    </main>
  );
}
