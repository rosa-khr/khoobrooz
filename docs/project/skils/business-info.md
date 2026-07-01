---
name: khoobrooz-business-info
description: Use this skill when collecting, organizing, or applying Khoobrooz business identity, brand positioning, company details, service claims, about-us content, contact-us content, trust signals, team information, and public-facing business profile details.
---

# Khoobrooz Business Info

## Purpose

Use this file as the source of truth for Khoobrooz business identity and public-facing company information.

This information should support:

- صفحه درباره خوبروز
- صفحه تماس با ما
- hero and intro copy
- service page trust sections
- footer business details
- consultation and contact CTAs
- structured data such as Organization, LocalBusiness, ContactPoint, and Service when implementation supports it

## Brand Identity

- Persian brand name: خوبروز
- English brand name: Khoobrooz
- Business type: شرکت خدمات بازرگانی، آموزش صادرات و واردات، ترخیص کالا، و فروش فایل‌ها و اسناد تجاری
- Primary website role: services-first business website
- Secondary roles: education, SEO knowledge base, digital document shop
- Tone: formal, credible, practical, transparent
- Technical direction: professional custom website, preferably Next.js + TypeScript + Tailwind CSS
- WordPress direction: avoid WordPress theme-based implementation unless the user explicitly changes the decision
- International direction: plan the website for multilingual growth from the beginning

## Brand Palette

Use this palette unless the user changes the brand identity later:

- Primary: `#0B1F3A`
- Accent: `#C9A24A`
- Secondary: `#0F766E`
- Background: `#F7F8FA`
- Surface: `#FFFFFF`
- Text: `#1F2937`

The visual identity should feel formal, trustworthy, commercial, clear, and professionally custom. Avoid a ready-made template feeling.

## Responsive And Typography Direction

Khoobrooz must be fully responsive across mobile, tablet, laptop, desktop, and wide desktop screens.

Preferred Persian font:

- Dana, if licensed and available for web use

Fallback fonts:

- Dana
- IRANSans
- Vazirmatn
- system-ui
- sans-serif

Use readable, professional typography. Avoid decorative fonts and oversized text in compact UI sections.

## Positioning

Khoobrooz should be positioned as a practical and trustworthy trade partner for people and businesses that need guidance or execution support in import, export, customs clearance, and commercial documentation.

Do not present Khoobrooz only as an academy or only as a shop. Services are the center; education and files support trust, SEO, and revenue.

## Public Contact And Routing Details

Confirmed by user:

- Country: Iran
- Country code: `0098` / `+98`
- General/mobile WhatsApp owned by Khoobrooz user: `09103060306`
- General/mobile WhatsApp international format: `+989103060306`
- Customs clearance CTA temporarily uses the same Khoobrooz user mobile until a separate clearance line is confirmed: `09103060306`
- Customs clearance international format: `+989103060306`
- Office address: `تهران، بلوار آفریقا (جردن)، بالاتر از خیابان اسفندیار، خیابان انصاری (صداقت)، پلاک 1`
- Telegram ID: `khoobrooz_trade`
- Bale ID: `khoobrooz_trade`

CTA routing rules:

- For ترخیص کالا, ترخیص کالا از گمرک, هزینه ترخیص, مدارک ترخیص, and any customs-clearance-specific CTA, use `09103060306`.
- For general WhatsApp/social contact, use `09103060306`.
- Mobile CTA for customs clearance should be clearly service-specific.
- If a page is not specifically about customs clearance, use the general contact/WhatsApp unless the user later defines another service-specific number.

Clearance note:

- Clearance CTAs currently route to the Khoobrooz user mobile until a separate clearance line is confirmed.
- Do not mention any operational partner publicly unless the user explicitly approves public disclosure.
- Do not make false claims about ownership, licenses, or guarantees.

## Business Details To Collect

Fill these later when the user provides details:

- Legal or public business name:
- Founder or manager name:
- Years of experience:
- Main city:
- Office address:
- Service coverage cities or customs offices:
- Phone:
- Mobile:
- General/mobile WhatsApp: `09103060306`
- Email: `info@khoobrooz.com`
- Telegram: `khoobrooz_trade`
- Bale: `khoobrooz_trade`
- Instagram: `khoobrooz.ir`
- LinkedIn: `khoobrooz.trade`
- Working hours:
- Enamad status:
- Zarinpal status:
- Other licenses or trust badges:
- Initial language:
- Future target languages:
- Current customs clearance CTA number: `09103060306`

## Social Identity

Final public social naming:

- Display name: خوبروز | Khoobrooz
- Website/email domain: `khoobrooz.com`
- Email: `info@khoobrooz.com`
- Instagram username: `khoobrooz.ir`
- Telegram username: `khoobrooz_trade`
- Bale username: `khoobrooz_trade`
- LinkedIn identity: `khoobrooz.trade`

Social naming rules:

- Avoid `khoobroooztrade.co` because the extra `o` can look like a typo and reduce trust.
- Keep Telegram and Bale short: `khoobrooz`.
- Keep Instagram domain-style: `khoobrooz.ir`.
- Keep LinkedIn identity international and compact: `khoobrooz.trade`.

Best overall recommendation:

- Email/domain identity: `khoobrooz.com`.
- Social identity: Instagram `khoobrooz.ir`, Telegram/Bale `khoobrooz`, LinkedIn `khoobrooz.trade`.

## Core Services

Current planned services:

- ترخیص کالا
- ترخیص کالا از گمرک
- ثبت سفارش واردات
- واردات کالا
- واردات از چین
- کارگو چین
- حمل و نقل بین‌المللی
- مشاوره امور گمرکی
- صادرات کالا
- مشاوره واردات و صادرات

When the user provides final services, update this list and keep it aligned with `menu.md` and `pillar-cluster.md`.

## International Website Inputs

Collect these before implementing multilingual pages:

- Primary launch language:
- Required future languages:
- Whether each language needs the full site or selected pages:
- Preferred URL structure:
- Translated brand name rules:
- Language switcher placement:
- Countries or markets to prioritize:
- Services that should be localized differently by market:

Default technical assumption:

- Use locale-based routing such as `/fa`, `/en`, `/ar`, `/ru`, and `/zh`.
- Persian and Arabic should use RTL layout.
- English, Russian, and Chinese should use LTR layout unless the final language plan says otherwise.

## About Us Content Inputs

Collect and organize these before writing the About Us page:

- Khoobrooz story:
- Why the brand was created:
- Target audience:
- Main promise:
- Practical advantages:
- Experience and expertise:
- Team or founder background:
- Service process:
- Values:
- Customer types:
- Geographic coverage:
- Proof points:

About Us page should answer:

- خوبروز چه کاری انجام می‌دهد؟
- به چه کسانی کمک می‌کند؟
- چرا می‌شود به خوبروز اعتماد کرد؟
- مسیر همکاری با خوبروز چگونه است؟
- کاربر بعد از خواندن صفحه باید چه اقدامی انجام دهد؟

## Contact Us Content Inputs

Collect and organize these before writing the Contact Us page:

- Primary contact method: general WhatsApp `09103060306`
- Secondary contact method: customs clearance CTA `09103060306`
- Consultation form fields:
- Office address: `تهران، بلوار آفریقا (جردن)، بالاتر از خیابان اسفندیار، خیابان انصاری (صداقت)، پلاک 1`
- Map/link if available:
- Mobile: `0910 306 0306`
- Telegram and Bale ID: `khoobrooz_trade`
- WhatsApp CTA text: ارتباط در واتساپ
- Working hours:
- Response time promise, only if true:
- Department labels, if needed:

Recommended contact form fields:

- نام و نام خانوادگی
- شماره تماس
- نوع درخواست
- توضیحات

Optional fields:

- نام شرکت
- نوع کالا
- کشور مبدا یا مقصد
- گمرک مورد نظر
- فایل پیوست

## Trust Signals

Use only true and user-approved trust signals.

Potential trust elements:

- سابقه فعالیت
- نمونه مشتریان
- پرونده‌های موفق بدون ذکر اطلاعات محرمانه
- مجوزها
- اینماد
- درگاه زرین‌پال
- آدرس دفتر
- شماره تماس ثابت
- شبکه‌های اجتماعی فعال
- محتوای تخصصی و به‌روز
- شفافیت در مراحل و مدارک مورد نیاز

Avoid unsupported claims such as:

- تضمین قطعی ترخیص
- کمترین هزینه بازار
- سریع‌ترین ترخیص ایران
- نتیجه حقوقی یا گمرکی قطعی

## Copywriting Rules

When writing business, about, or contact content:

- Use Persian.
- Keep the tone formal and clear.
- Prioritize trust, clarity, and practical next steps.
- Write for service conversion, not personal storytelling alone.
- Avoid exaggerated marketing language.
- Use exact contact details only after the user provides them.
- Do not invent licenses, addresses, experience years, clients, or legal claims.
- For customs clearance CTAs, use the approved customs clearance number while keeping the public-facing brand as Khoobrooz.
- Do not mention any operational partner unless the user explicitly approves public disclosure.
- Social channels should be displayed with recognizable icons where possible. Keep labels available through accessible names, titles, or nearby context.

## Related Files

Use these files together when needed:

- `menu.md` for navigation and service-first structure.
- `pillar-cluster.md` for SEO architecture and page planning.
- `sources.md` for approved research and inspiration sources.
- `tech-stack-i18n.md` for framework, custom build, and multilingual rules.

## Implementation Location Rules

Current project docs live under:

- `docs/project`

If business information is converted into implementation data, place it under:

- `src/data`

Do not create business, about, contact, or content files at the project root.
