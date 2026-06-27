"use client";

import { useEffect, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { Button } from "@/shared/components/Button";
import { type Locale, localizedPath } from "@/core/lib/site";
import dirhamRemittance from "@/assets/images/banner-library/remittance-dirham-banknotes.png";
import dollarRemittance from "@/assets/images/banner-library/remittance-dollar-banknotes.png";
import euroRemittance from "@/assets/images/banner-library/remittance-euro-banknotes.png";
import liraRemittance from "@/assets/images/banner-library/remittance-lira-banknotes.png";
import yuanRemittance from "@/assets/images/banner-library/remittance-yuan-banknotes.png";

type RemittanceSlide = {
  accent: string;
  background: StaticImageData;
  cta: string;
  description: string;
  href: string;
  keywords: string[];
  title: string;
};

const slides: RemittanceSlide[] = [
  {
    accent: "yuan",
    background: yuanRemittance,
    cta: "استعلام حواله یوآن",
    description: "علی‌پی، ارز دانشجویی و پرداخت امن به تامین‌کننده چینی.",
    href: "/services/yuan-transfer",
    keywords: ["حواله یوان چین", "علی‌پی", "پرداخت تامین‌کننده"],
    title: "حواله یوآن چین"
  },
  {
    accent: "dirham",
    background: dirhamRemittance,
    cta: "استعلام حواله درهم",
    description: "پرداخت امن درهم برای خرید از دبی و تسویه‌های تجاری امارات.",
    href: "/services/dirham-transfer",
    keywords: ["حواله درهم دبی", "پرداخت درهم", "تسویه تجاری"],
    title: "حواله درهم امارات"
  },
  {
    accent: "lira",
    background: liraRemittance,
    cta: "استعلام حواله لیر",
    description: "پرداخت امن لیر برای خرید از ترکیه، تجارت و تسویه سفارش.",
    href: "/services/lira-transfer",
    keywords: ["حواله لیر ترکیه", "پرداخت به ترکیه", "خرید از ترکیه"],
    title: "حواله لیر ترکیه"
  },
  {
    accent: "dollar",
    background: dollarRemittance,
    cta: "استعلام حواله دلار",
    description: "بررسی امن مسیر حواله دلار برای پرداخت و تسویه بین‌المللی.",
    href: "/services/dollar-transfer",
    keywords: ["حواله دلار", "پرداخت بین‌المللی", "تسویه ارزی"],
    title: "حواله دلار"
  },
  {
    accent: "euro",
    background: euroRemittance,
    cta: "استعلام حواله یورو",
    description: "پرداخت امن یورو برای خرید از اروپا و تسویه تجاری.",
    href: "/services/euro-transfer",
    keywords: ["حواله یورو", "پرداخت اروپا", "تسویه تجاری اروپا"],
    title: "حواله یورو"
  }
];

export default function RemittanceSliderClient({ locale }: { locale: Locale }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="remittance-section bg-white py-8 md:py-10">
      <div className="container">
        <div className="remittance-heading reveal-on-scroll">
          <span>پرداخت‌های ارزی</span>
          <h2>تسهیل حواله‌های ارزی</h2>
        </div>
        <div className={`remittance-slider remittance-slider-${activeSlide.accent} reveal-on-scroll`}>
          <Image
            key={`${activeSlide.title}-image`}
            alt=""
            className="remittance-slider-image"
            fill
            priority={false}
            sizes="(min-width: 1024px) 1180px, 100vw"
            src={activeSlide.background}
          />
          <div className="remittance-slider-overlay" aria-hidden="true" />

          <div className="remittance-slider-content">
            <div className="remittance-slider-panel" key={`${activeSlide.title}-panel`}>
              <h2>{activeSlide.title}</h2>
              <p>{activeSlide.description}</p>
              <div className="remittance-slider-keywords" aria-label="کلیدواژه‌های خدمات حواله">
                {activeSlide.keywords.map((keyword) => (
                  <span key={keyword}>{keyword}</span>
                ))}
              </div>
              <Button
                className={`remittance-slider-button remittance-slider-button-${activeSlide.accent}`}
                href={localizedPath(locale, activeSlide.href)}
                variant="secondary"
              >
                {activeSlide.cta}
              </Button>
            </div>
          </div>

          <div className="remittance-slider-dots" aria-label="انتخاب اسلاید حواله">
            {slides.map((slide, index) => (
              <button
                aria-label={slide.title}
                aria-pressed={index === activeIndex}
                className={index === activeIndex ? "active" : ""}
                key={slide.title}
                onClick={() => setActiveIndex(index)}
                type="button"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
