import type { Metadata } from "next";
import { Card } from "@/shared/components/Card";
import { PageHero } from "@/shared/components/PageHero";
import { contact } from "@/core/lib/site";
import { Locale } from "@/core/lib/site";
import { Button } from "@/shared/components/Button";
import { SocialLinks } from "@/shared/components/SocialLinks";
import { getDictionary } from "@/data/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const page = getDictionary(locale).pages.contact;
  return { title: page.title, description: page.description };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const page = getDictionary(locale).pages.contact;

  return (
    <main>
      <PageHero eyebrow={page.eyebrow} title={page.heading}>
        <p>{page.body}</p>
      </PageHero>
      <section className="bg-white py-16 md:py-20">
        <div className="container grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <h2 className="mb-4 text-xl font-black text-primary">{page.methods}</h2>
            <div className="grid gap-3">
              <a className="flex justify-between rounded-khoobrooz bg-background p-4" href={contact.generalWhatsappUrl}><strong>{page.generalWhatsapp}</strong><span>{contact.generalWhatsapp}</span></a>
              <a className="flex justify-between rounded-khoobrooz bg-background p-4" href={contact.clearancePhoneUrl}><strong>{page.customsLine}</strong><span>{contact.clearancePhone}</span></a>
            </div>
            <div className="mt-5 rounded-khoobrooz bg-primary p-4">
              <h3 className="mb-3 text-sm font-black text-white">{page.social}</h3>
              <SocialLinks />
            </div>
          </Card>
          <form className="rounded-khoobrooz border border-line bg-white p-6">
            <h2 className="mb-4 text-xl font-black text-primary">{page.formTitle}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-extrabold text-primary">{page.name}<input className="rounded-khoobrooz border border-line p-3" /></label>
              <label className="grid gap-2 text-sm font-extrabold text-primary">{page.phone}<input className="rounded-khoobrooz border border-line p-3" inputMode="tel" /></label>
              <label className="grid gap-2 text-sm font-extrabold text-primary md:col-span-2">{page.type}<select className="rounded-khoobrooz border border-line p-3">{page.options.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className="grid gap-2 text-sm font-extrabold text-primary md:col-span-2">{page.details}<textarea className="min-h-32 rounded-khoobrooz border border-line p-3" /></label>
            </div>
            <Button href={contact.generalWhatsappUrl} variant="secondary" className="mt-5">{page.submit}</Button>
          </form>
        </div>
      </section>
    </main>
  );
}
