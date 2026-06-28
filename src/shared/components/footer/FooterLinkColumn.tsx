import Link from "next/link";

type FooterLink = {
  label?: string;
  href: string;
};

type FooterLinkColumnProps = {
  title: string;
  links: FooterLink[];
};

export function FooterLinkColumn({ title, links }: FooterLinkColumnProps) {
  return (
    <nav className="min-w-0" aria-label={title}>
      <h2 className="mb-3 font-black text-white">{title}</h2>
      <ul className="grid gap-2 text-sm text-blue-200">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link className="transition hover:text-white" href={link.href}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
