import { footerContactItems } from "@/shared/components/footer/footerData";

export function FooterContactList() {
  return (
    <ul className="grid gap-2.5">
      {footerContactItems.map((item) => {
        const Icon = item.icon;

        return (
          <li key={item.label}>
            <a
              href={item.href}
              className="group flex min-w-0 items-center gap-3 border-b border-white/[0.07] pb-2.5 text-blue-100 transition last:border-b-0 hover:text-white"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-[4px] border border-white/10 bg-white/[0.06] text-accent transition group-hover:border-accent/60 group-hover:bg-accent group-hover:text-primary">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-bold text-blue-300">{item.label}</span>
                <span className="footer-contact-value block truncate text-sm font-bold" dir="ltr">
                  {item.value}
                </span>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
