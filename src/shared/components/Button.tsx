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
    "inline-flex min-h-[42px] items-center justify-center rounded-khoobrooz border px-4 py-2.5 font-extrabold transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
    {
      "border-transparent bg-accent text-primary shadow-[0_12px_26px_rgba(244,178,62,0.24)] hover:bg-[#ffd06a]": variant === "primary",
      "border-transparent bg-primary text-white hover:bg-[#12345c]": variant === "secondary",
      "border-transparent bg-orange text-white hover:bg-[#ea580c]": variant === "orange",
      "border-line bg-white text-primary hover:border-accent hover:bg-[#fff8e9]": variant === "outline"
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
