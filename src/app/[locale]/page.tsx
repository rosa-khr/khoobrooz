import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { services } from "@/data/content";
import { contact, Locale, localizedPath } from "@/core/lib/site";
import heroContainerShip from "@/assets/images/hero-container-ship-v2.png";
import { WorldTimeWidget } from "@/shared/components/WorldTimeWidget";

export const metadata: Metadata = {
  title: "خوبروز | خدمات بازرگانی، ترخیص کالا و آموزش صادرات و واردات",
  description: "خوبروز ارائه‌دهنده خدمات بازرگانی، ترخیص کالا، ثبت سفارش واردات، واردات از چین، صادرات، آموزش تجارت خارجی و فایل‌های کاربردی تجاری است."
};

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <main>
      <section
        className="relative overflow-hidden text-white"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(7, 23, 43, 0.98), rgba(7, 23, 43, 0.78), rgba(7, 23, 43, 0.16)), url(${heroContainerShip.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center right"
        }}
      >
        <div className="container flex min-h-[680px] items-center py-16 md:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-khoobrooz border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-extrabold text-[#ffe4a8] backdrop-blur">
              خدمات رسمی تجارت خارجی و ترخیص کالا
            </span>
            <h1 className="my-5 text-4xl font-black leading-tight md:text-6xl">
              خوبروز، همراه تخصصی مسیر واردات، صادرات و ترخیص کالا
            </h1>
            <p className="mb-7 max-w-2xl text-lg text-blue-100">
              از ثبت سفارش و واردات از چین تا ترخیص کالا و آماده‌سازی اسناد تجاری؛ خوبروز مسیر تجارت خارجی را شفاف‌تر، دقیق‌تر و قابل پیگیری‌تر می‌کند.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href={contact.generalWhatsappUrl}>دریافت مشاوره</Button>
              <Button href={localizedPath(locale, "/services")} variant="outline">مشاهده خدمات</Button>
              <Button href={contact.clearancePhoneUrl} variant="orange">استعلام ترخیص</Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-2 text-sm font-bold text-blue-100">
              <span className="rounded-khoobrooz border border-white/15 bg-white/10 px-3 py-2 backdrop-blur">ثبت سفارش</span>
              <span className="rounded-khoobrooz border border-white/15 bg-white/10 px-3 py-2 backdrop-blur">واردات از چین</span>
              <span className="rounded-khoobrooz border border-white/15 bg-white/10 px-3 py-2 backdrop-blur">ترخیص کالا</span>
              <span className="rounded-khoobrooz border border-white/15 bg-white/10 px-3 py-2 backdrop-blur">اسناد تجاری</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-16">
        <div className="container">
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-black text-primary md:text-4xl">خدمات اصلی</h2>
              <p className="mt-3 max-w-2xl text-muted">هر خدمت صفحه مستقل خود را دارد تا تجربه کاربر و ساختار جذب ورودی از گوگل قابل توسعه باشد.</p>
            </div>
            <Button href={localizedPath(locale, "/services")} variant="outline">همه خدمات</Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {services.slice(0, 3).map((service) => (
              <Card key={service.title} warm={service.featured}>
                <h3 className="mb-2 text-xl font-black text-primary">{service.title}</h3>
                <p className="mb-4 text-muted">{service.description}</p>
                {service.href ? (
                  <Link className="font-extrabold text-secondary" href={localizedPath(locale, service.href)}>مشاهده صفحه</Link>
                ) : (
                  <Link className="font-extrabold text-secondary" href={localizedPath(locale, "/services")}>مشاهده خدمات</Link>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white pb-16">
        <div className="container">
          <div className="grid items-center gap-6 rounded-khoobrooz bg-gradient-to-l from-primary to-[#12345c] p-7 text-white md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="mb-2 text-2xl font-black">برای ترخیص کالا نیاز به بررسی سریع دارید؟</h2>
              <p className="text-blue-100">برای صفحه‌ها و مسیرهای تماس مرتبط با ترخیص، تماس به شماره اختصاصی ترخیص متصل می‌شود.</p>
            </div>
            <Button href={contact.clearancePhoneUrl}>تماس برای ترخیص</Button>
          </div>
        </div>
      </section>

      <WorldTimeWidget />

      <section className="bg-background py-16 md:py-20">
        <div className="container grid gap-4 md:grid-cols-3">
          <Link href={localizedPath(locale, "/knowledge")}><Card><h3 className="mb-2 text-xl font-black text-primary">دانشنامه تجارت</h3><p className="text-muted">اصطلاحات و مقالات کاربردی واردات، صادرات و گمرک.</p></Card></Link>
          <Link href={localizedPath(locale, "/education")}><Card><h3 className="mb-2 text-xl font-black text-primary">آموزش صادرات و واردات</h3><p className="text-muted">محتواهای آموزشی برای شروع و رشد تجارت خارجی.</p></Card></Link>
          <Link href={localizedPath(locale, "/documents")}><Card teal><h3 className="mb-2 text-xl font-black text-primary">فایل‌ها و اسناد تجاری</h3><p className="text-muted">نمونه اسناد، قراردادها، چک‌لیست‌ها و فایل‌های محاسباتی.</p></Card></Link>
        </div>
      </section>
    </main>
  );
}
