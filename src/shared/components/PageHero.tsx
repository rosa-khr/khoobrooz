import { ReactNode } from "react";

export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-[#07172b] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(7,23,43,0.98),rgba(10,33,56,0.94)_58%,rgba(15,46,82,0.9)),radial-gradient(circle_at_18%_22%,rgba(244,178,62,0.14),transparent_28%)]" aria-hidden="true" />
      <div className="absolute inset-0 opacity-[0.1] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:44px_44px]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" aria-hidden="true" />
      <div className="container relative z-10 py-12 md:py-16">
        <div className="max-w-3xl">
          <span className="inline-flex border-r-2 border-accent pr-3 text-sm font-extrabold text-[#ffe4a8]">
            {eyebrow}
          </span>
          <h1 className="my-4 text-3xl font-black leading-tight md:text-5xl">{title}</h1>
          <div className="max-w-2xl text-base leading-8 text-blue-100 md:text-lg">{children}</div>
        </div>
      </div>
    </section>
  );
}
