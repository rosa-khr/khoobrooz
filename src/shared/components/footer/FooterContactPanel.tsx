import { FooterContactList } from "@/shared/components/footer/FooterContactList";
import { FooterSocialLinks } from "@/shared/components/footer/FooterSocialLinks";

type FooterContactPanelProps = {
  title: string;
};

export function FooterContactPanel({ title }: FooterContactPanelProps) {
  return (
    <section className="min-w-0" aria-labelledby="footer-contact-title">
      <h2 id="footer-contact-title" className="mb-3 font-black text-white">
        {title}
      </h2>
      <FooterContactList />
      <FooterSocialLinks />
    </section>
  );
}
