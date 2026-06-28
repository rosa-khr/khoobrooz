type FooterCopyrightProps = {
  year: number;
  rights: string;
};

export function FooterCopyright({ year, rights }: FooterCopyrightProps) {
  return (
    <div className="relative z-10 border-t border-white/10 bg-[#061325]/92">
      <div className="container flex min-h-12 flex-col items-center justify-between gap-2 py-3 text-center text-xs text-blue-200 md:flex-row">
        <span dir="ltr">© {year} Khoobrooz Trade. All rights reserved.</span>
        <span>{rights}</span>
      </div>
    </div>
  );
}
