import type { Metadata } from "next";
import { CircleCheck, Clock3, Coins, FileText, Landmark, ShieldCheck } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { PageHero } from "@/shared/components/PageHero";
import { contact, Locale, localizedPath } from "@/core/lib/site";

const pageContent = {
  title: "حواله یوآن چین | پرداخت RMB برای واردات و خرید خارجی",
  description: "خدمات حواله یوآن چین برای پرداخت به تامین‌کننده، خرید کالا و هماهنگی پرداخت‌های وارداتی با بررسی مبلغ، مقصد، زمان‌بندی و مدارک معامله.",
  eyebrow: "پرداخت تجاری چین",
  heading: "حواله یوآن چین",
  lead: "برای خرید از چین، زمان پرداخت و شفاف بودن مسیر انتقال پول مهم است. در خوبروز، درخواست حواله یوآن بر اساس مبلغ، اطلاعات دریافت‌کننده، نوع معامله و زمان موردنیاز بررسی می‌شود.",
  primary: "درخواست بررسی حواله",
  secondary: "مشاهده خدمات",
  points: [
    {
      title: "بررسی مسیر پرداخت",
      description: "اطلاعات فروشنده، مبلغ، مقصد و هدف پرداخت قبل از اقدام بررسی می‌شود.",
      icon: Landmark
    },
    {
      title: "هماهنگی زمان‌بندی",
      description: "برای پرداخت‌های فوری، امکان انجام در بازه موردنظر جداگانه بررسی می‌شود.",
      icon: Clock3
    },
    {
      title: "شفافیت مدارک",
      description: "فاکتور، پروفرما یا اطلاعات خرید برای کاهش خطای پرداخت کنترل می‌شود.",
      icon: FileText
    },
    {
      title: "پیگیری قابل فهم",
      description: "مسیر درخواست، اطلاعات لازم و وضعیت هماهنگی به شکل روشن اعلام می‌شود.",
      icon: ShieldCheck
    }
  ],
  process: [
    "ثبت مبلغ و اطلاعات دریافت‌کننده",
    "بررسی مدارک خرید یا سفارش",
    "اعلام مسیر قابل انجام و زمان تقریبی",
    "هماهنگی پرداخت و پیگیری نتیجه"
  ]
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: pageContent.title,
    description: pageContent.description
  };
}

export default async function YuanTransferPage({ params }: { params: Promise<{ locale: Locale }> }) {
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
        <div className="container grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
          <Card warm className="relative overflow-hidden">
            <div className="absolute -left-8 -top-8 size-32 rounded-full bg-accent/10" aria-hidden="true" />
            <div className="relative">
              <span className="mb-4 inline-flex size-11 items-center justify-center rounded-[8px] bg-primary text-accent">
                <Coins className="size-6" aria-hidden="true" />
              </span>
              <h2 className="mb-3 text-2xl font-black text-primary">برای پرداخت به تامین‌کننده چینی</h2>
              <p className="text-sm leading-8 text-muted">
                حواله یوآن زمانی کاربرد دارد که خرید، نمونه‌گیری، تسویه سفارش یا پرداخت مرحله‌ای با طرف چینی دارید. قبل از هر اقدام، اطلاعات پرداخت و محدودیت‌های مسیر بررسی می‌شود.
              </p>
              <div className="mt-6 rounded-[8px] border border-[#e3cf9f] bg-white/70 p-4">
                <strong className="block text-sm font-black text-primary">نیاز به پرداخت سریع دارید؟</strong>
                <p className="mt-2 text-sm leading-7 text-muted">
                  زمان‌های فوری مثل پرداخت ۲۴ ساعته ابتدا بر اساس مبلغ، مقصد و شرایط روز بررسی می‌شوند.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
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
        </div>
      </section>

      <section className="bg-background py-12 md:py-16">
        <div className="container">
          <div className="grid gap-5 rounded-khoobrooz border border-line bg-white p-5 md:p-7 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="text-sm font-black text-secondary">فرایند بررسی حواله</span>
              <h2 className="mt-2 text-2xl font-black text-primary">مسیر پرداخت شفاف و قابل پیگیری</h2>
              <p className="mt-3 text-sm leading-8 text-muted">
                هدف این بخش، ساده‌سازی تصمیم پرداخت است؛ بدون وعده قطعی درباره زمان یا هزینه، اما با مسیر روشن برای بررسی و هماهنگی.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {pageContent.process.map((step, index) => (
                <div className="flex items-center gap-3 rounded-[8px] border border-[#d8e0e9] bg-[#fbfcfd] p-3" key={step}>
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-[6px] bg-primary text-xs font-black text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-extrabold text-primary">{step}</span>
                  {index === pageContent.process.length - 1 ? <CircleCheck className="mr-auto size-4 text-secondary" aria-hidden="true" /> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
