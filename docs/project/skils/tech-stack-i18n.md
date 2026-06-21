---
name: khoobrooz-tech-stack-i18n
description: Use this skill when choosing or applying Khoobrooz technical stack, framework decisions, professional custom implementation standards, multilingual architecture, international SEO, and future scalability requirements.
---

# Khoobrooz Tech Stack And Internationalization

## Technical Direction

Khoobrooz should be built as a professional custom website, not as a WordPress theme-based site.

Preferred stack:

- Next.js
- TypeScript
- Tailwind CSS
- SEO-first architecture
- MDX or a clean CMS/content system for articles in the first content phase
- API Routes, Server Actions, or a backend service for forms, Zarinpal, and digital product flows

## Current Source Architecture

The project should stay organized around a clean Angular-like `src` structure:

```text
src/
  app/                 Next.js routes and pages
  core/
    lib/               core constants and helpers
  shared/
    components/        shared UI components
  data/                navigation and content data
  assets/
    images/            project-owned images
  docs/
    project/           agents, skills, plans, and archived static prototype
```

Only framework-required files should remain at the project root:

- `package.json`
- `package-lock.json`
- `next.config.ts`
- `next-env.d.ts`
- `tsconfig.json`
- `tailwind.config.ts`
- `postcss.config.js`
- `.gitignore`

Do not place new source code, images, docs, or static prototype pages at the project root.

Use these import conventions:

- `@/shared/components/...`
- `@/core/lib/...`
- `@/data/...`
- `@/assets/...`

## Responsive And Typography Standards

Khoobrooz must be fully responsive across mobile, tablet, laptop, desktop, and wide desktop screens.

Implementation should be mobile-first, with stable responsive constraints for:

- header and mobile navigation
- services menu
- CTA buttons
- service cards
- article layouts
- product grids
- forms
- footer

Preferred Persian font:

- Dana, if licensed and available for web use

Fallback stack:

- Dana
- IRANSans
- Vazirmatn
- system-ui
- sans-serif

Before production use, confirm font licensing and webfont files. If Dana is not available, use a high-readability Persian web font such as Vazirmatn.

## Why Not WordPress

Avoid WordPress as the primary implementation path unless the user explicitly changes direction.

Reasons:

- The user dislikes the visual quality and repeated feel of common WordPress templates.
- Khoobrooz needs a polished, custom, formal, service-business identity.
- The project needs precise control over UI, SEO structure, performance, multilingual routing, and future payment/download flows.

Do not recommend ready-made WordPress themes for Khoobrooz.

## Why Next.js

Next.js is preferred because Khoobrooz needs:

- strong SEO for services, articles, knowledge base, and pillar-cluster content
- dedicated pages for every service and keyword cluster
- high-quality metadata, schema, sitemap, and canonical handling
- future Zarinpal payment integration
- digital file sales and secure download flows
- multilingual routing and international SEO
- custom, professional UI without template limitations

## Multilingual Requirement

Khoobrooz must be planned as an international and multilingual website from the beginning.

Initial language:

- Persian / Farsi: `fa`

Future possible languages:

- English: `en`
- Arabic: `ar`
- Russian: `ru`
- Chinese: `zh`

Final target languages should be confirmed by the user before implementation.

## Multilingual Architecture Rules

Use locale-based routing:

- `/fa/...`
- `/en/...`
- `/ar/...`
- `/ru/...`
- `/zh/...`

For Persian and Arabic:

- Use RTL layout.
- Keep typography and spacing tested for long Persian/Arabic labels.

For English, Russian, and Chinese:

- Use LTR layout where appropriate, except language-specific cases.

Every translated page should have:

- localized slug where possible
- localized title and meta description
- `hreflang` alternates
- canonical URL
- translated structured data when relevant
- language switcher

## Content Translation Rules

Do not machine-translate important business, legal, customs, or commercial claims without review.

For each translated page:

- Preserve meaning, not word-for-word phrasing.
- Adapt examples and CTAs to the target audience.
- Keep service promises conservative and factual.
- Verify regulatory or country-specific content for the target language/market.

## International SEO Rules

For multilingual pages:

- Keep one clear URL per language.
- Add `hreflang` for all available translations.
- Avoid duplicate content across languages without proper metadata.
- Create language-specific sitemap entries.
- Use translated schema fields when possible.
- Keep service pages and article clusters aligned across languages, but allow local market adaptation.

## Future CMS Considerations

Start simple if needed:

- MDX for early articles and pages
- structured content files for services, products, and navigation

Upgrade later if content operations grow:

- Sanity
- Strapi
- Directus
- custom admin panel

Avoid choosing a CMS that makes the design feel template-based or weakens SEO control.
