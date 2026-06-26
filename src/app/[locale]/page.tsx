import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ClipboardCheck, FileSearch, FileText, Globe2, MessageSquareText, PhoneCall, Truck } from "lucide-react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { getDictionary } from "@/data/i18n";
import { contact, Locale, localizedPath } from "@/core/lib/site";
import tradePortHero from "@/assets/images/banner-library/trade-port-hero-dark-natural.jpg";
import { WorldTimeWidget } from "@/shared/components/WorldTimeWidget";
import { ProcessFlow } from "@/shared/components/ProcessFlow";
import { ServiceMarquee } from "@/shared/components/ServiceMarquee";
import { MarketRatesMarquee } from "@/shared/components/MarketRatesMarquee";
import clearanceContainerCloseup from "@/assets/images/banner-library/container-clearance-closeup.jpg";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return getDictionary(locale).home.metadata;
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dictionary = getDictionary(locale);
  const { home } = dictionary;

  return (
    <main className="overflow-hidden">
      <section
        className="hero-home relative min-h-[calc(100vh-126px)] overflow-hidden text-white"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(7, 23, 43, 0.12), rgba(7, 23, 43, 0.02)), url(${tradePortHero.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,19,37,0),rgba(6,19,37,0.08))]" aria-hidden="true" />
        <div className="container relative z-10 flex min-h-[620px] items-center justify-end py-12 md:py-16">
          <div className="hero-home-copy max-w-lg">
            <span className="inline-flex border-r-2 border-accent pr-3 text-xs font-bold text-[#ffe4a8] md:text-sm">
              {home.hero.eyebrow}
            </span>
            <h1 className="my-3 text-[26px] font-bold leading-[1.7] md:text-[34px]">
              {home.hero.title}
            </h1>
            <p className="mb-4 max-w-2xl text-[15px] leading-8 md:text-base">
              {home.hero.description}
            </p>
            <div className="hero-home-actions flex flex-wrap items-center gap-2.5">
              <Button href={contact.generalWhatsappUrl} className="w-[142px]">{home.hero.consult}</Button>
              <Button href={localizedPath(locale, "/services")} variant="outline" className="w-[142px]">{home.hero.services}</Button>
              <a
                href={contact.clearancePhoneUrl}
                className="hero-clearance-link inline-flex min-h-[38px] w-[294px] items-center justify-center gap-2 rounded-khoobrooz border px-3.5 py-2 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:text-sm"
              >
                <PhoneCall className="size-4" aria-hidden="true" />
                <span>{home.hero.customsConsult}</span>
                <span className="hero-clearance-number" dir="ltr">{contact.clearancePhone}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="services-route-section relative overflow-hidden bg-white py-14 md:py-16">
        <div className="container relative z-10">
          <div className="services-section-heading mb-6 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-black text-primary md:text-4xl">{home.services.title}</h2>
              <p className="mt-3 max-w-2xl text-muted">{home.services.description}</p>
            </div>
            <Button href={localizedPath(locale, "/services")} variant="outline">{home.services.all}</Button>
          </div>
          <ServiceMarquee locale={locale} ariaLabel={home.services.aria} />
        </div>
      </section>

      <MarketRatesMarquee locale={locale} rates={[]} />

      <WorldTimeWidget />

      <section className="process-section bg-background py-14 md:py-20">
        <div className="container relative z-10">
          <div className="process-panel mx-auto max-w-5xl reveal-on-scroll">
            <span className="text-sm font-black text-secondary">{home.process.eyebrow}</span>
            <h2 className="mt-2 text-3xl font-black text-primary md:text-4xl">{home.process.title}</h2>
            <p className="mt-4 max-w-2xl text-muted">{home.process.description}</p>
            <ProcessFlow content={dictionary.processFlow} />
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-16">
        <div className="container">
          <div
            className="clearance-note clearance-photo-card grid items-center gap-8 p-7 md:grid-cols-[0.92fr_1.08fr] reveal-on-scroll"
          >
            <Image
              src={clearanceContainerCloseup}
              alt=""
              fill
              className="clearance-photo-image object-cover"
              sizes="(min-width: 1024px) 1180px, 100vw"
              priority={false}
            />
            <div className="clearance-overlay-card">
              <div className="clearance-note-copy">
                <span className="text-sm font-black text-secondary">{home.clearance.eyebrow}</span>
                <h2 className="mb-2 text-2xl font-black text-primary">{home.clearance.title}</h2>
                <p className="text-muted">{home.clearance.description}</p>
                <div className="mt-5">
                  <Button href={contact.clearancePhoneUrl} variant="orange">{home.clearance.cta}</Button>
                </div>
              </div>
              <div className="clearance-switch" aria-label={home.clearance.aria}>
                <div className="clearance-switch-step">
                  <span className="clearance-switch-index">01</span>
                  <MessageSquareText className="size-5" aria-hidden="true" />
                  <strong>{home.clearance.request}</strong>
                  <small>{home.clearance.requestHint}</small>
                </div>
                <div className="clearance-switch-split" aria-hidden="true">
                  <span />
                </div>
                <div className="clearance-switch-options">
                  <div className="clearance-switch-option">
                    <PhoneCall className="size-5" aria-hidden="true" />
                    <strong>{home.clearance.general}</strong>
                    <span>{home.clearance.generalHint}</span>
                  </div>
                  <div className="clearance-switch-option is-active">
                    <Truck className="size-5" aria-hidden="true" />
                    <strong>{home.clearance.customs}</strong>
                    <span>{home.clearance.customsHint}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-reference-section bg-background py-14 md:py-16">
        <div className="container">
          <div className="content-reference-panel">
            <div className="content-reference-head">
              <div>
                <span className="text-sm font-black text-secondary">{home.content.eyebrow}</span>
                <h2 className="mt-2 text-3xl font-black text-primary md:text-4xl">{home.content.title}</h2>
                <p className="mt-3 max-w-2xl text-muted">{home.content.description}</p>
              </div>
              <div className="content-reference-actions">
                <Link href={localizedPath(locale, "/knowledge")} className="content-pill">{home.content.knowledge}</Link>
                <Link href={localizedPath(locale, "/education")} className="content-pill">{home.content.education}</Link>
                <Link href={localizedPath(locale, "/documents")} className="content-pill">{home.content.documents}</Link>
              </div>
            </div>

            <div className="content-reference-grid">
              <Link href={localizedPath(locale, "/education")} className="content-reference-feature">
                <Globe2 className="size-6" aria-hidden="true" />
                <strong>{home.content.featureTitle}</strong>
                <span>{home.content.featureDescription}</span>
              </Link>

              {dictionary.knowledgeItems.map((item) => (
                <Link key={item.title} href={localizedPath(locale, "/knowledge")} className="content-reference-card">
                  <FileSearch className="size-5" aria-hidden="true" />
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                </Link>
              ))}

              {dictionary.documentItems.map((item) => (
                <Link key={item.title} href={localizedPath(locale, "/documents")} className="content-reference-card">
                  <ClipboardCheck className="size-5" aria-hidden="true" />
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-16">
        <div className="container">
          <div className="trust-framework reveal-on-scroll">
            <div className="trust-framework-copy">
              <span className="text-sm font-black text-secondary">{home.trust.eyebrow}</span>
              <h2 className="mt-2 text-3xl font-black text-primary md:text-4xl">{home.trust.title}</h2>
              <p className="mt-4 max-w-xl text-muted">{home.trust.description}</p>
              <div className="trust-proof-line" aria-hidden="true">
                {home.trust.proof.map((item) => <span key={item}>{item}</span>)}
              </div>
            </div>
            <div className="trust-classic-grid" aria-label={home.trust.aria}>
              {home.trust.items.map((item, index) => {
                const Icon = [FileText, Truck, CheckCircle2, FileSearch][index] ?? FileText;

                return (
                  <div key={item.title} className="trust-classic-item">
                    <small>{String(index + 1).padStart(2, "0")}</small>
                    <Icon className="size-5" aria-hidden="true" />
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
