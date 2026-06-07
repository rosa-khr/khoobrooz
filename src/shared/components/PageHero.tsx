import Image from "next/image";
import { ReactNode } from "react";
import heroContainerShip from "@/assets/images/hero-container-ship-v2.png";

export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-[#07172b] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(244,178,62,0.18),transparent_30%),linear-gradient(110deg,rgba(7,23,43,0.98),rgba(10,33,56,0.92)_48%,rgba(16,47,85,0.82))]" aria-hidden="true" />
      <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(circle,rgba(255,255,255,0.42)_1px,transparent_1px)] [background-size:18px_18px]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" aria-hidden="true" />
      <div className="absolute left-0 top-0 hidden h-full w-[48%] md:block" aria-hidden="true">
        <Image
          src={heroContainerShip}
          alt=""
          fill
          priority={false}
          sizes="48vw"
          className="object-cover opacity-35 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07172b]/10 via-[#07172b]/58 to-[#07172b]" />
      </div>
      <div className="container relative z-10 py-14 md:py-20">
        <div className="max-w-4xl">
          <span className="inline-flex rounded-[4px] border border-accent/50 bg-white/10 px-3 py-1.5 text-sm font-extrabold text-[#ffe4a8] backdrop-blur">
            {eyebrow}
          </span>
          <h1 className="my-5 text-4xl font-black leading-tight md:text-6xl">{title}</h1>
          <div className="max-w-3xl text-lg leading-8 text-blue-100">{children}</div>
        </div>
      </div>
    </section>
  );
}
