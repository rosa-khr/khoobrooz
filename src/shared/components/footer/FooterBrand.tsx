import { MapPin } from "lucide-react";
import { contact } from "@/core/lib/site";
import { BrandLogoMark } from "@/shared/components/BrandLogo";

type FooterBrandProps = {
  brandName: string;
  intro: string;
};

export function FooterBrand({ brandName, intro }: FooterBrandProps) {
  return (
    <div className="min-w-0">
      <div className="mb-3 inline-flex items-center gap-2.5">
        <BrandLogoMark className="size-10" />
        <h2 className="text-xl font-black text-white">{brandName}</h2>
      </div>
      <p className="text-sm leading-7 text-blue-200">{intro}</p>
      <p className="mt-4 inline-flex items-start gap-2 text-sm leading-7 text-blue-200">
        <MapPin className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />
        <span>{contact.address}</span>
      </p>
    </div>
  );
}
