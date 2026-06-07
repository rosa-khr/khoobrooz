import type { Metadata } from "next";
import { Card } from "@/shared/components/Card";
import { PageHero } from "@/shared/components/PageHero";
import { Button } from "@/shared/components/Button";
import { contact, Locale, localizedPath } from "@/core/lib/site";

export const metadata: Metadata = {
  title: "ترخیص کالا | خدمات ترخیص کالا از گمرک با خوبروز",
  description: "خدمات ترخیص کالا در خوبروز شامل بررسی مدارک، مراحل ترخیص، عوامل موثر بر هزینه و مسیر تماس اختصاصی برای درخواست‌های ترخیص است."
};

export default async function CustomsClearancePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <main>
      <PageHero eyebrow="ترخیص کالا" title="ترخیص کالا از گمرک">
        <p>برای درخواست‌های ترخیص، مسیر تماس جداست تا کاربر سریع‌تر به بررسی تخصصی ترخیص وصل شود.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={contact.clearancePhoneUrl} variant="orange">تماس مخصوص ترخیص</Button>
          <Button href={localizedPath(locale, "/services")} variant="outline">بازگشت به خدمات</Button>
        </div>
      </PageHero>
      <section className="bg-white py-16 md:py-20">
        <div className="container grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card warm>
            <h2 className="mb-2 text-xl font-black text-primary">مسیر تماس ترخیص</h2>
            <p className="mb-5 text-muted">شماره ترخیص فقط برای صفحات و دکمه‌های مرتبط با ترخیص استفاده می‌شود.</p>
            <Button href={contact.clearancePhoneUrl} variant="orange">{contact.clearancePhone}</Button>
          </Card>
          <div className="grid gap-4">
            <Card><h2 className="mb-2 text-xl font-black text-primary">ترخیص کالا چیست؟</h2><p className="text-muted">ترخیص کالا مجموعه اقداماتی است که برای خروج قانونی کالا از گمرک انجام می‌شود؛ از کنترل مدارک تا اظهار، پرداخت‌ها و پیگیری مجوزها.</p></Card>
            <Card><h2 className="mb-2 text-xl font-black text-primary">مراحل پیشنهادی صفحه</h2><ul className="list-disc space-y-1 pr-5 text-muted"><li>بررسی کالا و مدارک</li><li>کنترل مجوزها و اظهارنامه</li><li>بررسی عوامل موثر بر هزینه</li><li>پیگیری مسیر ترخیص تا تحویل</li></ul></Card>
            <Card><h2 className="mb-2 text-xl font-black text-primary">محتوای تکمیلی صفحه</h2><p className="text-muted">این صفحه بعداً با بخش‌های مدارک لازم، هزینه ترخیص کالا، سوالات متداول و لینک به مقالات کلاستر کامل می‌شود.</p></Card>
          </div>
        </div>
      </section>
    </main>
  );
}
