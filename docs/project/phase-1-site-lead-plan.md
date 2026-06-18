# Khoobrooz Phase 1 Site Lead Plan

## Decision Summary

Khoobrooz should start as a professional, custom, services-first website with SEO-ready architecture and multilingual readiness.

Primary technical direction:

- Next.js
- TypeScript
- Tailwind CSS
- SEO-first routing and metadata
- Multilingual-ready structure from the beginning
- No WordPress theme-based implementation

Current implementation structure:

```text
src/
  app/                 Next.js App Router routes
  core/lib/            site constants and helpers
  shared/components/   reusable UI components
  data/                navigation and content data
  assets/images/       project-owned image assets
  docs/project/        agents, skills, plans, and archived prototype
```

Only mandatory framework/config files should remain at the root. New code, assets, docs, and page work should be created inside `src`.

Primary business direction:

- Services are the center of the website.
- Articles, glossary, and knowledge-base pages bring organic traffic.
- Commercial files and documents support revenue and service conversion.
- Zarinpal integration is planned for a later commerce phase.

## Brand Palette

Use this palette unless the brand identity changes later:

- Primary: `#0B1F3A`
- Accent: `#C9A24A`
- Secondary: `#0F766E`
- Background: `#F7F8FA`
- Surface: `#FFFFFF`
- Text: `#1F2937`

Design direction:

- Formal
- Trustworthy
- Commercial
- Clear
- Service-first
- Not template-like
- Fully responsive
- Mobile-first

## Responsive And Typography Standards

The website must be fully responsive across:

- mobile
- tablet
- laptop
- desktop
- wide desktop

Use a mobile-first design and implementation approach. Menus, service cards, CTA buttons, article layouts, product grids, forms, and footer content must not overflow or break on small screens.

Preferred Persian font:

- Dana, if licensed and available for web use

Fallback stack:

- Dana
- IRANSans
- Vazirmatn
- system-ui
- sans-serif

If Dana cannot be used because of licensing or missing webfont files, use Vazirmatn or another high-readability standard Persian web font.

## Phase 1 Goal

Build the strategic foundation for the first public version of Khoobrooz.

The first version should be able to launch as a polished Persian website and later expand into English, Arabic, Russian, or Chinese without rebuilding the architecture.

## Phase 1 Required Pages

Highest priority pages:

- Home
- Services overview
- ترخیص کالا
- ثبت سفارش واردات
- واردات کالا
- واردات از چین
- کارگو چین
- حمل و نقل بین‌المللی
- مشاوره امور گمرکی
- صادرات کالا
- فایل‌ها و اسناد تجاری
- دانشنامه تجارت
- درباره خوبروز
- تماس با ما

Secondary pages for early SEO:

- ترخیص کالا از گمرک
- مراحل ترخیص کالا از گمرک
- هزینه ترخیص کالا از گمرک
- مدارک لازم برای ترخیص کالا
- مراحل واردات کالا
- مراحل واردات از چین
- پروفرما اینویس چیست؟
- پکینگ لیست چیست؟
- سامانه جامع تجارت چیست؟

## Navigation

Default menu order:

1. خانه
2. خدمات
3. آموزش صادرات و واردات
4. فایل‌ها و اسناد تجاری
5. دانشنامه تجارت
6. بخشنامه‌ها و اخبار
7. سوالات متداول
8. درباره خوبروز
9. تماس با ما

Primary CTA:

- دریافت مشاوره

Secondary CTAs:

- استعلام هزینه ترخیص
- درخواست تماس
- خرید فایل

## Contact And CTA Routing

Confirmed contact routing:

- Personal/general WhatsApp owned by Khoobrooz user: `09103060396`
- Personal/general WhatsApp international format: `+989103060396`
- Customs clearance partner CTA owned by Gمرکچی / Gchi: `09124174031`
- Customs clearance partner international format: `+989124174031`
- Country: Iran
- Country code: `0098` / `+98`

CTA rules:

- For customs clearance pages and clearance-specific mobile CTAs, use `09124174031`.
- For general website contact, social contact, and WhatsApp CTAs, use `09103060396`.
- Clearance services may be supported by a working partner, but public-facing copy should stay under the Khoobrooz brand unless the user approves naming the partner.
- Internally, remember that `09124174031` is the Gمرکچی / Gchi partner number, not the user's personal line.

## Service Priority

Use this order for homepage sections, menu emphasis, and initial page creation:

1. ترخیص کالا
2. ترخیص کالا از گمرک
3. ثبت سفارش واردات
4. واردات کالا
5. واردات از چین
6. کارگو چین
7. حمل و نقل بین‌المللی
8. مشاوره امور گمرکی
9. صادرات کالا
10. مشاوره واردات و صادرات

## User Journey

Organic article journey:

1. User lands on an article or glossary page from Google.
2. The page answers the question clearly.
3. The page links to the matching service page.
4. The page offers a consultation CTA or related document download.
5. The user moves to تماس، فرم مشاوره، واتساپ، or خرید فایل.

Service page journey:

1. User lands on a service page.
2. The first screen confirms the service and next action.
3. The page explains process, documents, costs, and risks.
4. The page builds trust without unsupported claims.
5. The page pushes toward consultation, cost inquiry, or contact.

Product/document journey:

1. User lands on a document product page.
2. The page explains what is included and who it is for.
3. The page shows price, format, sample/preview, and support note.
4. In phase 1, purchase can be shown as planned or disabled if payment is not ready.
5. In the commerce phase, the page connects to Zarinpal and secure download.

## Multilingual Foundation

Plan routes as if the final website may support:

- `/fa/...`
- `/en/...`
- `/ar/...`
- `/ru/...`
- `/zh/...`

Phase 1 can launch only in Persian, but implementation should not block future translation.

Required multilingual planning:

- language-aware routing
- RTL support for Persian and Arabic
- LTR support for English, Russian, and Chinese
- localized metadata
- `hreflang` support
- language-specific sitemap support
- language switcher placeholder or planned component

## Before UI Design

Confirm these details:

- Final list of services
- Most profitable or most important service
- Contact methods
- About Us facts
- Business address, if public
- WhatsApp/phone availability
- Initial language and future priority languages
- Whether files will be sold in phase 1 or phase 2
- Whether articles start as MDX files or need CMS planning immediately

## Before Frontend Implementation

Current decisions:

- Next.js app structure: `src/app/[locale]/...`
- Persian route structure: `/fa/...`
- Shared components: `src/shared/components`
- Core helpers: `src/core/lib`
- Content/navigation data: `src/data`
- Project images: `src/assets/images`
- Project docs and agents: `docs/project`

Still to decide:

- Detailed content source for future article bodies
- Initial schema types per page
- Product data model details for future commerce
- Form handling and backend approach

## Recommended Next Agents

1. Run `business-brand-agent` to complete business facts for About Us, Contact Us, footer, and trust sections.
2. Run `seo-content-agent` to turn the highest-priority service pages into SEO outlines.
3. Run `ui-ux-agent` to create the homepage and service page wireframes.
4. Run `frontend-agent` only after the first design and content structure are approved.
