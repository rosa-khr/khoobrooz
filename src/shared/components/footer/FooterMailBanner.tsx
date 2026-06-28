import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { type Locale, localizedPath } from "@/core/lib/site";

export function FooterMailBanner({ locale }: { locale: Locale }) {
  return (
    <div className="relative z-10 border-y border-white/10 bg-white/[0.035]">
      <div className="container py-4">
        <div className="footer-mail-banner flex min-h-24 items-center justify-between gap-5 overflow-hidden rounded-[6px] border border-white/10 bg-[#102640] px-4 py-3 sm:px-6">
          <div className="footer-mail-banner__content flex min-w-0 items-center gap-4">
            <div className="footer-mail-envelope relative grid h-[82px] w-[58px] shrink-0 place-items-center overflow-hidden border border-[#cdbf9f] bg-[#eee5d3] text-primary shadow-[0_9px_20px_rgba(0,0,0,0.16)]">
              <Mail className="mb-4 size-7" strokeWidth={1.5} aria-hidden="true" />
              <span className="absolute inset-x-1.5 bottom-1.5 border border-[#b7a681] bg-white px-1 py-1 text-center font-sans text-[7px] font-bold leading-tight text-[#172a42]">
                KHOOBROOZ
                <span className="block text-[6px] font-medium">TRADE DESK</span>
              </span>
            </div>
            <div className="min-w-0">
              <span className="mb-1 block text-xs font-black text-accent">ارتباط با واحد بازرگانی</span>
              <p className="text-sm leading-7 text-blue-100">موضوع درخواست و شماره تماس خود را برای بررسی ارسال کنید.</p>
            </div>
          </div>
          <Link
            href={localizedPath(locale, "/contact")}
            className="footer-mail-banner__action inline-flex min-h-10 shrink-0 items-center gap-2 rounded-[4px] border border-accent/70 px-3.5 text-xs font-black text-accent transition hover:bg-accent hover:text-primary"
          >
            ارسال پیام
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
