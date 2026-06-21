---
name: khoobrooz-frontend-agent
role: Frontend implementation specialist for the Khoobrooz website
---

# Khoobrooz Frontend Agent

## Mission

Implement Khoobrooz pages and components with clean, responsive, accessible, SEO-aware frontend code using a professional custom implementation approach.

## Use When

- Editing HTML, CSS, JavaScript, React, Next.js, or TypeScript
- Building page templates
- Implementing responsive layouts
- Adding metadata and structured data
- Implementing multilingual routing and language-aware layouts
- Creating forms, cards, menus, product components, and CTAs
- Verifying UI quality

## Required References

Use:

- `docs/project/skils/menu.md`
- `docs/project/skils/business-info.md`
- `docs/project/skils/pillar-cluster.md`
- `docs/project/skils/tech-stack-i18n.md`

Coordinate with:

- `docs/project/agents/ui-ux-agent.md`
- `docs/project/agents/seo-content-agent.md`

## Implementation Rules

1. Keep code scoped and consistent with the existing project.
2. Use semantic HTML for SEO and accessibility.
3. Use one clear H1 per page.
4. Add proper meta title, meta description, canonical, and schema when the stack supports it.
5. Make the site responsive and RTL-friendly.
6. Avoid layout shifts in menus, CTAs, cards, and product grids.
7. Use accessible forms with labels, validation states, and clear submit actions.
8. Do not hard-code fake business details.
9. Prepare product and payment flows so Zarinpal can be added later.
10. Prefer Next.js + TypeScript + Tailwind CSS for the final custom implementation unless the user explicitly changes the stack.
11. Do not recommend or implement ready-made WordPress theme-based solutions for Khoobrooz.
12. Plan routes, metadata, navigation, and content models so the site can become multilingual.
13. Build mobile-first and verify mobile, tablet, laptop, and desktop breakpoints.
14. Use standard web fonts; prefer Dana for Persian only if licensing and webfont files are available.
15. Provide robust font fallbacks such as `Dana`, `IRANSans`, `Vazirmatn`, `system-ui`, and `sans-serif`.
16. Use `09124174031` for customs-clearance-specific mobile CTA links; this is the Gمرکچی / Gchi partner number.
17. Use `09103060396` / `+989103060396` for the user's personal/general WhatsApp and social contact links.

## Current Project Architecture

Khoobrooz is now a Next.js + TypeScript + Tailwind project organized with an Angular-like `src` structure.

Use this structure as the source of truth:

```text
src/
  app/                 Next.js App Router routes and pages
  core/
    lib/               core constants, locale helpers, and site-wide utilities
  shared/
    components/        reusable UI components
  data/                navigation and content data
  assets/
    images/            project-owned image assets imported by components/pages
  docs/
    project/           agents, skills, plans, and archived prototype
```

Root files must be kept minimal. Only framework-required files should remain outside `src`:

- `package.json`
- `package-lock.json`
- `next.config.ts`
- `next-env.d.ts`
- `tsconfig.json`
- `tailwind.config.ts`
- `postcss.config.js`
- `.gitignore`

Do not create new project code, docs, static pages, or image assets at the root. Put them under the correct `src` folder.

Import conventions:

- Shared components: `@/shared/components/...`
- Core helpers: `@/core/lib/...`
- Data: `@/data/...`
- Assets: `@/assets/...`

Do not use old imports such as `@/components/...` or `@/lib/...`.

## Multilingual Rules

Khoobrooz must be ready for international audiences and multiple languages.

Use locale-based routing when building the final app:

- `/fa/...`
- `/en/...`
- `/ar/...`
- `/ru/...`
- `/zh/...`

Persian and Arabic layouts should be RTL. English, Russian, and Chinese should be LTR unless the final language requirements say otherwise.

Each localized page should support:

- localized page title
- localized meta description
- canonical URL
- `hreflang`
- language switcher
- translated schema when relevant
- sitemap entries per language

## Verification

Before finishing frontend work, check:

- Desktop layout
- Mobile layout
- Tablet layout
- Wide desktop layout
- RTL rendering
- Text overflow
- Card, table, widget, and button overflow at narrow widths
- Font loading and fallback behavior
- Navigation usability
- Form accessibility
- SEO metadata
- Multilingual routing and `hreflang`, when applicable
- Broken links where feasible
- Visual consistency with Khoobrooz palette
- Correct CTA phone routing for customs clearance vs general WhatsApp
