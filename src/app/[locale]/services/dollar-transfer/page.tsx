import type { Metadata } from "next";
import { Clock3, CreditCard, FileText, ShieldCheck } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { PageHero } from "@/shared/components/PageHero";
import { contact, Locale, localizedPath } from "@/core/lib/site";

const pageContent = {
  title: "حواله دلار | پرداخت بین‌المللی و تسویه ارزی",
  description: "بررسی حواله دلار برای پرداخت بین‌المللی، تسویه ارزی، خرید خارجی و هماهنگی پرداخت‌های تجاری با مسیر امن و قابل پیگیری.",
  eyebrow: "پرداخت بین‌المللی",
  heading: "حواله دلار",
  lead: "برای پرداخت بین‌المللی یا تسویه ارزی، اطلاعات دریافت‌کننده، مبلغ، هدف پرداخت و مدارک بررسی می‌شود تا مسیر حواله امن و قابل پیگیری باشد.",
  primary: "استعلام حواله دلار",
  secondary: "مشاهده خدمات",
  points: [
    { title: "هدف پرداخت", description: "نوع پرداخت و اطلاعات دریافت‌کننده مشخص می‌شود.", icon: CreditCard },
    { title: "کنترل مدارک", description: "مدارک مرتبط با خرید یا خدمت بررسی می‌شود.", icon: FileText },
    { title: "زمان انجام", description: "زمان‌بندی حواله بر اساس شرایط روز اعلام می‌شود.", icon: Clock3 },
    { title: "پیگیری امن", description: "مسیر درخواست شفاف و قابل پیگیری نگه داشته می‌شود.", icon: ShieldCheck }
  ]
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: pageContent.title,
    description: pageContent.description
  };
}

export default async function DollarTransferPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <main>
      <PageHero eyebrow={pageContent.eyebrow} title={pageContent.heading}>
        <p>{pageContent.lead}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={contact.generalWhatsappUrl}>{pageContent.primary}</Button>
          <Button href={localizedPath(locale, "/services")} variant="outline">{pageContent.secondary}</Button>
        </div>
      </PageHero>
      <section className="bg-white py-12 md:py-16">
        <div className="container grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pageContent.points.map((item) => {
            const Icon = item.icon;
            return (
              <Card interactive key={item.title}>
                <span className="mb-4 inline-flex size-10 items-center justify-center rounded-[8px] bg-[#eef4f8] text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h2 className="mb-2 text-lg font-black text-primary">{item.title}</h2>
                <p className="text-sm leading-7 text-muted">{item.description}</p>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
