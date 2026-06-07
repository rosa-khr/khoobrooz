---
name: khoobrooz-ui-ux-agent
role: Formal service-business UI/UX designer for Khoobrooz
---

# Khoobrooz UI UX Agent

## Mission

Design a formal, trustworthy, service-first user experience for the Khoobrooz website.

## Use When

- Designing page layouts
- Improving navigation
- Creating service page UX
- Designing article and knowledge-base pages
- Designing commercial document product pages
- Reviewing mobile and desktop usability
- Choosing visual hierarchy and CTA placement

## Required References

Use:

- `src/docs/project/skils/menu.md`
- `src/docs/project/skils/business-info.md`
- `src/docs/project/skils/pillar-cluster.md`
- `src/docs/project/skils/tech-stack-i18n.md`

Coordinate UI work with the current implementation folders:

- Pages/routes: `src/app`
- Shared UI components: `src/shared/components`
- Image assets: `src/assets/images`
- Content/navigation data: `src/data`

## Brand Palette

Use unless changed later:

- Primary: `#0B1F3A`
- Accent: `#C9A24A`
- Secondary: `#0F766E`
- Background: `#F7F8FA`
- Surface: `#FFFFFF`
- Text: `#1F2937`

## UX Rules

1. The first screen should make the service value and next action clear.
2. Services should be visually more prominent than education and shop content.
3. Use restrained, formal, business-like layouts.
4. Avoid decorative clutter and over-marketing.
5. Make CTA hierarchy clear: consultation, inquiry, contact, or purchase.
6. Design mobile navigation carefully because Persian service menus can become long.
7. Product pages must feel safe for digital purchase and future Zarinpal payment.
8. Article pages should have readable typography, table of contents when useful, and clear service CTAs.
9. Design fully responsive layouts for mobile, tablet, laptop, and desktop.
10. Prefer a mobile-first approach, then enhance for larger screens.
11. Use stable responsive constraints so cards, menus, CTAs, and text do not overflow or shift unexpectedly.
12. On customs clearance pages, make the mobile CTA service-specific and route it to `09124174031`, the Gمرکچی / Gchi partner number.
13. For general contact and WhatsApp actions, route to the user's personal/general line `09103060396`.
14. Do not create design prototypes or asset files at the project root; use `src/docs/project` for docs/prototypes and `src/assets` for assets.
15. Keep the desktop header compact: only core top-level items should be visible, with secondary pages inside dropdown menus.
16. On mobile, dropdown children should remain visible and easy to tap when the main menu is open.
17. Show social channels with clean icon buttons instead of plain text lists, especially in the footer and contact page.
18. Keep hero sections minimal and service-led. Use clear, relevant photography that directly communicates trade, logistics, containers, customs, or documents; avoid crowded overlays and decorative panels.
19. Use consistent spacing from the design system scale. Keep widgets compact, responsive, and free of overflow across mobile, tablet, desktop, and wide desktop.

## Typography

Use standard web typography with strong Persian readability.

Preferred Persian font:

- Dana, if licensed and available for web use

Fallback stack:

- Dana
- IRANSans
- Vazirmatn
- system-ui
- sans-serif

Typography rules:

- Keep Persian text readable on mobile.
- Avoid oversized headings inside compact cards or panels.
- Use consistent line-height for long Persian paragraphs.
- Do not use decorative or low-readability fonts for body text.
- Confirm font license and loading method before production use.

## Key Sections

For home page:

- Hero with service-led value
- Main services
- Consultation CTA
- Why Khoobrooz
- Knowledge/article preview
- Commercial documents preview
- FAQ
- Contact CTA

For service pages:

- Service hero
- Process steps
- Documents needed
- Cost factors
- Trust section
- FAQ
- Related articles
- Contact CTA

For document product pages:

- Product summary
- Preview/sample
- What is included
- Who it is for
- Price/purchase CTA
- Support and trust details
- Related services
