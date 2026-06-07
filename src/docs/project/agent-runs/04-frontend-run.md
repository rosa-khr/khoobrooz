# 04 Frontend Agent Run

## Output Goal

Prepare the implementation plan for building Khoobrooz as a custom, SEO-first, multilingual-ready frontend.

## Recommended Stack

- Next.js
- TypeScript
- Tailwind CSS
- App Router
- MDX or structured content files for initial content
- Future backend/API support for forms, Zarinpal, and secure downloads

## Responsive And Font Requirements

The implementation must be fully responsive for:

- mobile
- tablet
- laptop
- desktop
- wide desktop

Use mobile-first Tailwind breakpoints. Verify that navigation, cards, CTA buttons, forms, article pages, product grids, and footer content remain readable and stable.

Preferred Persian font:

- Dana, if licensed and available for web use

Fallback stack:

- Dana
- IRANSans
- Vazirmatn
- system-ui
- sans-serif

If Dana webfont files are not available, use Vazirmatn or another standard Persian web font.

## Initial App Structure

Current route model:

```text
src/
  app/
    [locale]/
      page.tsx
      services/
        page.tsx
        customs-clearance/
          page.tsx
      knowledge/
        page.tsx
      documents/
        page.tsx
      education/
        page.tsx
      news/
        page.tsx
      faq/
        page.tsx
      about/
        page.tsx
      contact/
        page.tsx
```

Current shared folders:

```text
src/
  core/
    lib/
  shared/
    components/
  data/
  assets/
    images/
  docs/
    project/
```

Root should only contain required framework/config files. Do not add new source files at root.

## Frontend Requirements

1. Use semantic HTML.
2. Support RTL for Persian and Arabic.
3. Keep multilingual route structure ready from the start.
4. Add SEO metadata per page.
5. Add canonical and `hreflang` support.
6. Generate sitemap entries per locale.
7. Keep navigation data-driven.
8. Keep service, article, and document data structured.
9. Prepare forms for future backend/API handling.
10. Prepare product pages for future Zarinpal checkout.
11. Verify responsive behavior at mobile, tablet, laptop, desktop, and wide desktop widths.
12. Verify font loading and fallback behavior.
13. Route customs-clearance-specific phone CTAs to `09124174031`, the Gمرکچی / Gchi partner number.
14. Route the user's personal/general WhatsApp and social contact CTAs to `09103060396` or `+989103060396`.

## Initial Components

Build these first:

- SiteHeader
- MobileNav
- LanguageSwitcher
- HeroSection
- ServiceGrid
- CTASection
- TrustSection
- ArticlePreviewGrid
- DocumentProductGrid
- FAQSection
- SiteFooter
- ConsultationForm

## Content Models

Service content model:

- id
- locale
- slug
- title
- metaTitle
- metaDescription
- summary
- priority
- sections
- faqs
- relatedArticles
- relatedDocuments
- cta

Article content model:

- id
- locale
- slug
- title
- metaTitle
- metaDescription
- updatedAt
- primaryKeyword
- relatedServices
- relatedDocuments
- body
- faqs

Document product model:

- id
- locale
- slug
- title
- price
- fileType
- summary
- description
- preview
- includedItems
- relatedServices
- purchaseStatus

## Phase 1 Implementation Boundary

Do not implement real Zarinpal payment until required credentials and backend flow are confirmed.

For phase 1:

- Build service and content structure.
- Build static or semi-static product pages.
- Keep purchase buttons as planned CTA or request/contact flow if payment is not ready.

## Next Action

Continue building inside the existing `src` architecture. Next priorities are improving the homepage UI, expanding service page content, and adding SEO schema/metadata helpers.
