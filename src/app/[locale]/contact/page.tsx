import type { Metadata } from "next";
import { Card } from "@/shared/components/Card";
import { PageHero } from "@/shared/components/PageHero";
import { contact } from "@/core/lib/site";
import { Button } from "@/shared/components/Button";
import { SocialLinks } from "@/shared/components/SocialLinks";

export const metadata: Metadata = {
  title: "تماس با خوبروز | مشاوره تجارت خارجی و ترخیص کالا",
  description: "برای مشاوره خدمات بازرگانی، واردات، صادرات، فایل‌های تجاری و ترخیص کالا با خوبروز تماس بگیرید."
};

export default function ContactPage() {
  return (
    <main>
      <PageHero eyebrow="تماس با خوبروز" title="تماس با خوبروز">
        <p>برای تماس عمومی از واتساپ شخصی خوبروز و برای درخواست‌های ترخیص از شماره اختصاصی ترخیص استفاده کنید.</p>
      </PageHero>
      <section className="bg-white py-16 md:py-20">
        <div className="container grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <h2 className="mb-4 text-xl font-black text-primary">مسیرهای تماس</h2>
            <div className="grid gap-3">
              <a className="flex justify-between rounded-khoobrooz bg-background p-4" href={contact.generalWhatsappUrl}><strong>واتساپ عمومی</strong><span>{contact.generalWhatsapp}</span></a>
              <a className="flex justify-between rounded-khoobrooz bg-background p-4" href={contact.clearancePhoneUrl}><strong>تماس مخصوص ترخیص</strong><span>{contact.clearancePhone}</span></a>
            </div>
            <div className="mt-5 rounded-khoobrooz bg-primary p-4">
              <h3 className="mb-3 text-sm font-black text-white">شبکه‌های اجتماعی خوبروز</h3>
              <SocialLinks />
            </div>
          </Card>
          <form className="rounded-khoobrooz border border-line bg-white p-6">
            <h2 className="mb-4 text-xl font-black text-primary">درخواست مشاوره</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-extrabold text-primary">نام و نام خانوادگی<input className="rounded-khoobrooz border border-line p-3" /></label>
              <label className="grid gap-2 text-sm font-extrabold text-primary">شماره تماس<input className="rounded-khoobrooz border border-line p-3" inputMode="tel" /></label>
              <label className="grid gap-2 text-sm font-extrabold text-primary md:col-span-2">نوع درخواست<select className="rounded-khoobrooz border border-line p-3"><option>ترخیص کالا</option><option>واردات کالا</option><option>صادرات کالا</option><option>خرید فایل</option><option>آموزش</option></select></label>
              <label className="grid gap-2 text-sm font-extrabold text-primary md:col-span-2">توضیحات<textarea className="min-h-32 rounded-khoobrooz border border-line p-3" /></label>
            </div>
            <Button href={contact.generalWhatsappUrl} variant="secondary" className="mt-5">ارسال در واتساپ</Button>
          </form>
        </div>
      </section>
    </main>
  );
}
