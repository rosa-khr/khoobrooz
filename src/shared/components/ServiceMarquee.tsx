"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Boxes, ClipboardCheck, Container, FileText, Globe2, Handshake, PackageCheck, Ship, Truck } from "lucide-react";
import { Locale, localizedPath } from "@/core/lib/site";
import { Card } from "@/shared/components/Card";

const serviceIcons = [Container, ClipboardCheck, Boxes, Globe2, Ship, Handshake, FileText, PackageCheck];

type ServiceCardItem = {
  title: string;
  description: string;
  href?: string;
  eyebrow?: string;
  cta?: string;
  featured?: boolean;
};

type ServicesResponse = {
  responseStatus: 0 | 1;
  response: {
    items: Array<{
      id: number;
      title: string;
      slug: string;
      summary?: string;
      description?: string;
      cta?: string;
      href?: string;
      isPublished?: boolean;
      accuracy: 0 | 1 | 2;
    }>;
    total: number;
  };
};

export function ServiceMarquee({ locale, ariaLabel }: { locale: Locale; ariaLabel: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const isDragging = useRef(false);
  const hasMoved = useRef(false);
  const isPaused = useRef(false);
  const isVisible = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [dynamicServices, setDynamicServices] = useState<ServiceCardItem[]>([]);

  useEffect(() => {
    let mounted = true;

    fetch("/api/services", { cache: "no-store" })
      .then((response) => response.json() as Promise<ServicesResponse>)
      .then((payload) => {
        if (!mounted || payload.responseStatus !== 1 || payload.response.items.length === 0) {
          return;
        }

        setDynamicServices(payload.response.items
          .filter((item) => item.accuracy === 1 && item.isPublished !== false)
          .map((item) => ({
            title: item.title,
            description: item.summary || item.description || "",
            href: item.href || `/services/${item.slug}`,
            eyebrow: "خدمات بازرگانی",
            cta: item.cta || "مشاهده خدمت"
          })));
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let animationFrame = 0;
    let previousTime = performance.now();
    let hasPositioned = false;
    const speed = 0.03;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
      },
      { threshold: 0.08 }
    );

    observer.observe(scroller);
    isVisible.current = true;

    const animate = (time: number) => {
      const trackWidth = scroller.scrollWidth / 2;

      if (!hasPositioned && trackWidth > 0) {
        scroller.scrollLeft = trackWidth;
        hasPositioned = true;
      }

      if (isVisible.current && !document.hidden && !isPaused.current && !isDragging.current) {
        const delta = Math.min(time - previousTime, 64);
        scroller.scrollLeft -= delta * speed;

        if (scroller.scrollLeft <= 0 && trackWidth > 0) {
          scroller.scrollLeft += trackWidth;
        }
      }

      previousTime = time;
      animationFrame = window.requestAnimationFrame(animate);
    };

    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, [dynamicServices.length]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    isDragging.current = true;
    hasMoved.current = false;
    setDragging(true);
    dragStartX.current = event.clientX;
    dragStartScroll.current = scroller.scrollLeft;
    scroller.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    if (!scroller || !isDragging.current) {
      return;
    }

    const delta = event.clientX - dragStartX.current;
    if (Math.abs(delta) > 6) {
      hasMoved.current = true;
    }

    scroller.scrollLeft = dragStartScroll.current - delta;
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    isDragging.current = false;
    setDragging(false);

    if (scroller?.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId);
    }
  };

  const renderServiceCard = (service: ServiceCardItem, index: number, clone = false) => {
    const Icon = serviceIcons[index] ?? PackageCheck;

    return (
      <Card key={`${service.title}-${clone ? "clone" : "main"}`} warm={service.featured} teal={index === 6} interactive={!clone} className="service-marquee-card group">
        <div className="mb-5 flex items-start justify-between gap-4">
          <span className="service-card-icon">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          {service.eyebrow && <span className="service-card-eyebrow">{service.eyebrow}</span>}
        </div>
        <h3 className="mb-2 text-lg font-black text-primary transition duration-200 group-hover:text-[#102a4c]">{service.title}</h3>
        <p className="mb-4 text-sm leading-7 text-muted">{service.description}</p>
        {service.href && !clone ? (
          <Link className="inline-flex items-center gap-1.5 text-sm font-extrabold text-secondary outline-none transition duration-200 group-hover:gap-2 group-hover:text-primary focus-visible:ring-2 focus-visible:ring-accent" href={localizedPath(locale, service.href)}>
            {service.cta}
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-secondary">
            {service.cta}
            <ArrowLeft className="size-4" aria-hidden="true" />
          </span>
        )}
      </Card>
    );
  };

  if (dynamicServices.length === 0) {
    return null;
  }

  return (
    <div
      ref={scrollerRef}
      data-dynamic-content
      className={`service-marquee reveal-on-scroll ${dragging ? "is-dragging" : ""}`}
      aria-label={ariaLabel}
      dir="ltr"
      onFocusCapture={() => {
        isPaused.current = true;
      }}
      onBlurCapture={() => {
        isPaused.current = false;
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={(event) => {
        if (hasMoved.current) {
          event.preventDefault();
          event.stopPropagation();
          hasMoved.current = false;
        }
      }}
    >
      <div className="service-marquee-track">
        {dynamicServices.map((service, index) => renderServiceCard(service, index))}
        <div className="contents" aria-hidden="true">
          {dynamicServices.map((service, index) => renderServiceCard(service, index, true))}
        </div>
      </div>
    </div>
  );
}
