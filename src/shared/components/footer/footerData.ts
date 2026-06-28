import {
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  MessagesSquare,
  Phone,
  Printer,
  Send,
  Smartphone,
  type LucideIcon
} from "lucide-react";
import { contact } from "@/core/lib/site";

export type FooterContactItem = {
  label: string;
  value: string;
  href: string;
  icon: LucideIcon;
};

export type FooterSocialItem = {
  label: string;
  value: string;
  href: string;
  icon: LucideIcon;
};

export const footerContactItems: FooterContactItem[] = [
  { label: "تلفن دفتر", value: contact.officePhone, href: contact.officePhoneUrl, icon: Phone },
  { label: "تلفن همراه", value: contact.clearancePhone, href: contact.clearancePhoneUrl, icon: Smartphone },
  { label: "فکس", value: contact.fax, href: contact.faxUrl, icon: Printer },
  { label: "ایمیل", value: contact.email, href: contact.emailUrl, icon: Mail }
];

export const footerSocialItems: FooterSocialItem[] = [
  { label: "تلگرام", value: contact.telegramName, href: contact.telegramUrl, icon: Send },
  { label: "واتساپ", value: contact.generalWhatsapp, href: contact.generalWhatsappUrl, icon: MessageCircle },
  { label: "بله", value: contact.baleName, href: contact.baleUrl, icon: MessagesSquare },
  { label: "اینستاگرام", value: contact.instagramName, href: contact.instagramUrl, icon: Instagram },
  { label: "لینکدین", value: contact.linkedinName, href: contact.linkedinUrl, icon: Linkedin }
];
