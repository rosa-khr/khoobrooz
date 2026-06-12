import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/shared/components/Card";
import { PageHero } from "@/shared/components/PageHero";
import { Locale, localizedPath } from "@/core/lib/site";
import { getDictionary } from "@/data/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const page = getDictionary(locale).pages.faq;
  return { title: page.title, description: page.description };
}

export default async function FaqPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const page = getDictionary(locale).pages.faq;

  return (
    <main>
      <PageHero eyebrow={page.eyebrow} title={page.heading}>
        <p>{page.body}</p>
      </PageHero>
      <section className="bg-white py-16 md:py-20"><div className="container grid gap-4"><Card><h2 className="mb-2 text-xl font-black text-primary">{page.q1}</h2><p className="mb-4 text-muted">{page.a1}</p><Link className="font-extrabold text-secondary" href={localizedPath(locale, "/services/customs-clearance")}>{page.link}</Link></Card><Card><h2 className="mb-2 text-xl font-black text-primary">{page.q2}</h2><p className="text-muted">{page.a2}</p></Card></div></section>
    </main>
  );
}
