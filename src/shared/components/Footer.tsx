import { type Locale, localizedPath } from "@/core/lib/site";
import { getDictionary } from "@/data/i18n";
import { FooterBrand } from "@/shared/components/footer/FooterBrand";
import { FooterContactPanel } from "@/shared/components/footer/FooterContactPanel";
import { FooterCopyright } from "@/shared/components/footer/FooterCopyright";
import { FooterLinkColumn } from "@/shared/components/footer/FooterLinkColumn";
import { FooterMailBanner } from "@/shared/components/footer/FooterMailBanner";
import { loadFooterNavigation } from "@/shared/components/footer/footerNavigation";
import { SeaRoutePattern } from "@/shared/components/SeaRoutePattern";

export async function Footer({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear();
  const dictionary = getDictionary(locale);
  const nav = await loadFooterNavigation(locale);
  const serviceChildren = nav[1]?.children ?? [];
  const brandChildren = nav[5]?.children ?? [];

  return (
    <footer className="relative overflow-hidden bg-[#07172b] text-blue-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(244,178,62,0.09),transparent_30%),linear-gradient(180deg,rgba(7,23,43,0.98),rgba(6,19,37,0.99))]" aria-hidden="true" />
      <SeaRoutePattern className="z-0 text-[#d7e7f4] opacity-[0.18]" />
      <div className="absolute inset-0 bg-gradient-to-l from-[#07172b]/86 via-[#07172b]/64 to-[#061325]/96" aria-hidden="true" />

      <FooterMailBanner locale={locale} />

      <div className="container relative z-10 grid gap-8 py-9 lg:grid-cols-[1.15fr_0.7fr_0.85fr_1.2fr]">
        <FooterBrand brandName={dictionary.brand.name} intro={dictionary.footer.intro} />
        <FooterLinkColumn
          title={dictionary.footer.pages}
          links={[
            { label: nav[1]?.label, href: nav[1]?.href ?? localizedPath(locale, "/services") },
            { label: nav[2]?.label, href: nav[2]?.href ?? localizedPath(locale, "/knowledge") },
            { label: nav[3]?.label, href: nav[3]?.href ?? localizedPath(locale, "/documents") },
            { label: brandChildren[0]?.label, href: brandChildren[0]?.href ?? localizedPath(locale, "/about") },
            { label: brandChildren[1]?.label, href: brandChildren[1]?.href ?? localizedPath(locale, "/contact") }
          ]}
        />
        <FooterLinkColumn
          title={dictionary.footer.mainServices}
          links={[
            { label: serviceChildren[0]?.label, href: serviceChildren[0]?.href ?? localizedPath(locale, "/services/customs-clearance") },
            { label: serviceChildren[1]?.label, href: serviceChildren[1]?.href ?? localizedPath(locale, "/services/yuan-transfer") },
            { label: serviceChildren[2]?.label, href: serviceChildren[2]?.href ?? localizedPath(locale, "/services") },
            { label: nav[4]?.children?.[0]?.label, href: nav[4]?.children?.[0]?.href ?? localizedPath(locale, "/markets/currency-rates") }
          ]}
        />
        <FooterContactPanel title={dictionary.footer.contactSocial} />
      </div>
      <FooterCopyright year={year} rights={dictionary.footer.rights} />
    </footer>
  );
}
