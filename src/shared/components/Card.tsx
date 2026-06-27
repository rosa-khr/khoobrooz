import { ReactNode } from "react";
import clsx from "clsx";

export function Card({
  children,
  warm = false,
  teal = false,
  interactive = false,
  className
}: {
  children: ReactNode;
  warm?: boolean;
  teal?: boolean;
  interactive?: boolean;
  className?: string;
}) {
  return (
    <article
      className={clsx(
        "rounded-khoobrooz border border-[#cfd7e2] bg-white p-6 shadow-[0_1px_0_rgba(11,31,58,0.04)]",
        {
          "border-[#d8c299] bg-[#fffaf0]": warm,
          "border-secondary/20 bg-[#f1f7f6]": teal,
          "transition duration-200 ease-out hover:-translate-y-0.5 hover:border-[#c98210]/50 hover:shadow-[0_12px_28px_rgba(11,31,58,0.09)] focus-within:-translate-y-0.5 focus-within:border-[#c98210]/50 focus-within:shadow-[0_12px_28px_rgba(11,31,58,0.09)]": interactive
        },
        className
      )}
    >
      {children}
    </article>
  );
}
