import { ReactNode } from "react";
import clsx from "clsx";

export function Card({ children, warm = false, teal = false }: { children: ReactNode; warm?: boolean; teal?: boolean }) {
  return (
    <article
      className={clsx("rounded-khoobrooz border border-line bg-white p-6", {
        "bg-gradient-to-b from-white to-[#fff1e8]": warm,
        "border-secondary/20 bg-[#e8f5f3]": teal
      })}
    >
      {children}
    </article>
  );
}
