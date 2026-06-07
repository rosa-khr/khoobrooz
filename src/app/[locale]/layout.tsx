import type { Metadata } from "next";
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { FloatingCta } from "@/shared/components/FloatingCta";
import { Footer } from "@/shared/components/Footer";
import { Header } from "@/shared/components/Header";
import { isLocale, Locale } from "@/core/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://khoobrooz.ir"),
  title: {
    default: "خوبروز | خدمات بازرگانی و ترخیص کالا",
    template: "%s | خوبروز"
  },
  description: "خوبروز ارائه‌دهنده خدمات بازرگانی، ترخیص کالا، واردات، صادرات، آموزش تجارت خارجی و فایل‌های کاربردی تجاری است."
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <>
      <Header locale={locale as Locale} />
      {children}
      <Footer locale={locale as Locale} />
      <FloatingCta />
    </>
  );
}
