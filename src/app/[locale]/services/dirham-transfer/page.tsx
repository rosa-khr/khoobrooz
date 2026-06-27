import type { Metadata } from "next";
import { Clock3, CreditCard, FileText, Landmark } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { PageHero } from "@/shared/components/PageHero";
import { contact, Locale, localizedPath } from "@/core/lib/site";

const pageContent = {
  title: "حواله درهم دبی | پرداخت درهم و تسویه تجاری امارات",
  description: "بررسی حواله درهم امارات برای پرداخت درهم، حواله درهم دبی، خرید از امارات، تسویه تجاری و هماهنگی پرداخت‌های مرتبط با واردات.",
  eyebrow: "پرداخت تجاری امارات",
  heading: "حواله درهم امارات",
  lead: "برای پرداخت درهم، خرید از دبی یا تسویه تجاری امارات، اطلاعات دریافت‌کننده، مبلغ و مدارک بررسی می‌شود تا مسیر قابل انجام روشن باشد.",
  primary: "مشاوره حواله درهم",
  secondary: "مشاهده خدمات",
  points: [
    { title: "بررسی مقصد پرداخت", description: "اطلاعات دریافت‌کننده و هدف پرداخت قبل از اقدام کنترل می‌شود.", icon: Landmark },
    { title: "هماهنگی زمان", description: "زمان انجام حواله بر اساس مبلغ، مقصد و شرایط روز بررسی می‌شود.", icon: Clock3 },
    { title: "کنترل مدارک", description: "فاکتور، پروفرما یا مستندات سفارش برای کاهش خطا بررسی می‌شود.", icon: FileText },
    { title: "پیگیری پرداخت", description: "وضعیت درخواست و اطلاعات لازم به شکل روشن اعلام می‌شود.", icon: CreditCard }
  ]
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: pageContent.title,
    description: pageContent.description
  };
}

export default async function DirhamTransferPage({ params }: { params: Promise<{ locale: Locale }> }) {
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
