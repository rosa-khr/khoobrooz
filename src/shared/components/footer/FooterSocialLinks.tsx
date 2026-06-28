import { footerSocialItems } from "@/shared/components/footer/footerData";

export function FooterSocialLinks() {
  return (
    <div className="mt-4 border-t border-white/10 pt-4">
      <h3 className="mb-2.5 text-xs font-bold text-blue-200">شبکه‌های اجتماعی</h3>
      <div className="grid grid-cols-2 gap-2">
        {footerSocialItems.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={item.label}
              title={`${item.label}: ${item.value}`}
              className="group flex min-h-9 items-center gap-2 rounded-[4px] border border-white/10 bg-white/[0.045] px-2.5 text-xs font-bold text-blue-100 transition hover:border-accent/70 hover:bg-accent hover:text-primary"
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
