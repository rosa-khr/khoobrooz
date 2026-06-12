"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Boxes, ClipboardCheck, Container, FileText, Globe2, Handshake, PackageCheck, Ship, Truck } from "lucide-react";
import { Locale, localizedPath } from "@/core/lib/site";
import { Dictionary } from "@/data/i18n";
import { Card } from "@/shared/components/Card";

const serviceIcons = [Container, ClipboardCheck, Boxes, Globe2, Ship, Handshake, FileText, PackageCheck];

export function ServiceMarquee({ locale, services, ariaLabel }: { locale: Locale; services: Dictionary["services"]; ariaLabel: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const isDragging = useRef(false);
  const hasMoved = useRef(false);
  const isPaused = useRef(false);
  const isVisible = useRef(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const step = 1;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
      },
      { threshold: 0.08 }
    );

    observer.observe(scroller);

    const timer = window.setInterval(() => {
      if (isVisible.current && !document.hidden && !isPaused.current && !isDragging.current) {
        scroller.scrollLeft += step;

        if (scroller.scrollLeft >= scroller.scrollWidth / 2) {
          scroller.scrollLeft -= scroller.scrollWidth / 2;
        }
      }
    }, 80);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, []);

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

  const renderServiceCard = (service: (typeof services)[number], index: number, clone = false) => {
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

  return (
    <div
      ref={scrollerRef}
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
        {services.map((service, index) => renderServiceCard(service, index))}
        <div className="contents" aria-hidden="true">
          {services.map((service, index) => renderServiceCard(service, index, true))}
        </div>
      </div>
    </div>
  );
}
