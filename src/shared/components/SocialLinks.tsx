import { Instagram, Linkedin, Mail, MessageCircle, MessageSquareText, Phone, Send } from "lucide-react";
import { contact } from "@/core/lib/site";

const socialLinks = [
  {
    label: "واتساپ خوبروز",
    href: contact.generalWhatsappUrl,
    icon: MessageCircle
  },
  {
    label: "تلگرام خوبروز",
    href: contact.telegramUrl,
    icon: Send
  },
  {
    label: "بله خوبروز",
    href: contact.baleUrl,
    icon: MessageSquareText
  },
  {
    label: "اینستاگرام خوبروز",
    href: contact.instagramUrl,
    icon: Instagram
  },
  {
    label: "لینکدین خوبروز",
    href: contact.linkedinUrl,
    icon: Linkedin
  },
  {
    label: "ایمیل خوبروز",
    href: contact.emailUrl,
    icon: Mail
  },
  {
    label: "تماس با خوبروز",
    href: contact.generalPhoneUrl,
    icon: Phone
  }
];

export function SocialLinks({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {socialLinks.map((item) => {
        const Icon = item.icon;
        const isExternal = item.href.startsWith("http");

        return (
          <a
            key={item.label}
            href={item.href}
            aria-label={item.label}
            title={item.label}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer" : undefined}
            className={
              tone === "light"
                ? "grid size-9 place-items-center rounded-khoobrooz border border-line bg-white text-primary transition hover:-translate-y-0.5 hover:border-accent hover:bg-accent"
                : "grid size-10 place-items-center rounded-khoobrooz border border-white/15 bg-white/10 text-white transition hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-primary"
            }
          >
            <Icon className="size-5" aria-hidden="true" />
          </a>
        );
      })}
    </div>
  );
}
