import Link from "next/link";
import { AnchorHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "orange" | "outline";
};

export function Button({ children, href, variant = "primary", className, ...props }: ButtonProps) {
  const isExternal = href.startsWith("http") || href.startsWith("tel:");
  const classes = clsx(
    "inline-flex min-h-[42px] items-center justify-center rounded-khoobrooz border px-4 py-2.5 font-extrabold transition hover:-translate-y-0.5",
    {
      "border-transparent bg-accent text-primary shadow-[0_12px_26px_rgba(244,178,62,0.24)]": variant === "primary",
      "border-transparent bg-primary text-white": variant === "secondary",
      "border-transparent bg-orange text-white": variant === "orange",
      "border-line bg-white text-primary": variant === "outline"
    },
    className
  );

  if (isExternal) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}
