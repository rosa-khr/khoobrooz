---
name: khoobrooz-menu
description: Use this skill when designing or revising the Khoobrooz website navigation, service menu, commercial document shop navigation, CTAs, and service-first user journeys for the Persian trade, import, export, and customs clearance brand.
---

# Khoobrooz Menu

## Brand Context

Khoobrooz is a formal Persian brand for trade services, import/export education, customs clearance, and selling important commercial files and documents.

The website must primarily feel like a service business website. Education, articles, glossary content, news, and downloadable documents support SEO acquisition and trust, but the main conversion path should guide users toward services, consultation, contact, or paid file purchase.

## Core Menu Priorities

1. Put services before education and shop content in the main navigation.
2. Keep خدمات as the strongest navigation group.
3. Make the route from article pages to service pages obvious through internal links and CTAs.
4. Prepare commerce paths for future Zarinpal integration, especially for paid digital files and document packs.
5. Keep labels formal, clear, and keyword-aligned.

## Implementation Location

Navigation data currently belongs in:

- `src/data/navigation.ts`

Route implementations belong in:

- `src/app/[locale]/...`

Do not create new menu/page files at the project root.

## Recommended Main Menu

Use a compact top-level menu. Only a few items should be visible as main nav items; supporting pages should live inside dropdowns.

1. خانه
2. خدمات
3. آموزش و دانشنامه
4. فایل‌ها و اسناد
5. خوبروز

The primary CTA should usually be one of:

- دریافت مشاوره
- درخواست تماس
- استعلام هزینه ترخیص
- خرید فایل

## Dropdown Structure

Current navigation implementation lives in `src/data/navigation.ts`.

Top-level: خدمات

- ترخیص کالا
- ثبت سفارش واردات
- واردات کالا
- واردات از چین و کارگو
- صادرات کالا

Top-level: آموزش و دانشنامه

- آموزش صادرات و واردات
- دانشنامه تجارت
- بخشنامه‌ها و اخبار

Top-level: فایل‌ها و اسناد

- Links directly to the commercial documents page.

Top-level: خوبروز

- درباره خوبروز
- تماس با ما
- سوالات متداول

## Services Menu

Recommended service pages by relative search demand and business importance:

| Priority | Search Demand | Page | Primary Keyword |
| --- | --- | --- | --- |
| 1 | Very high | ترخیص کالا | ترخیص کالا |
| 2 | Very high | ترخیص کالا از گمرک | ترخیص کالا از گمرک |
| 3 | High | ثبت سفارش واردات | ثبت سفارش واردات |
| 4 | High | واردات کالا | واردات کالا |
| 5 | High | واردات از چین | واردات از چین |
| 6 | High | کارگو چین | کارگو چین |
| 7 | Medium-high | حمل و نقل بین‌المللی | حمل و نقل بین المللی |
| 8 | Medium-high | مشاوره امور گمرکی | مشاوره امور گمرکی |
| 9 | Medium | صادرات کالا | صادرات کالا |
| 10 | Medium | مشاوره واردات و صادرات | مشاوره واردات و صادرات |

If the user asks to simplify the menu, keep these top-level service links:

- ترخیص کالا
- ثبت سفارش واردات
- واردات از چین
- کارگو چین
- حمل و نقل بین‌المللی
- مشاوره امور گمرکی
- صادرات کالا

## Commercial Documents Menu

Use this section for direct revenue through downloadable products and future Zarinpal payment.

Recommended categories:

- نمونه اسناد واردات
- نمونه اسناد صادرات
- قراردادهای تجاری
- چک‌لیست‌ها
- فایل‌های اکسل محاسبات
- مکاتبات تجاری انگلیسی

Recommended product pages:

- نمونه پروفرما اینویس
- نمونه قرارداد صادراتی
- نمونه قرارداد وارداتی
- نمونه پکینگ لیست
- نمونه اینویس تجاری
- چک‌لیست ترخیص کالا
- چک‌لیست واردات کالا
- اکسل محاسبه هزینه واردات
- اکسل محاسبه هزینه ترخیص
- نمونه مکاتبات تجاری انگلیسی

Each paid file should support title, short description, detailed description, price, file type, update date, preview/sample, purchase CTA, and post-payment download.

## Market Data Menu

Use a compact top-level market menu when adding practical trade tools.

Current top-level label:

- بازار

Current child page:

- قیمت ارزهای رایج: `/markets/currency-rates`

Rules:

- Keep this section practical and connected to import/export decisions.
- Do not expose unverified live prices.
- Always show source and update status for market data.
- Link currency data to services, calculators, and document products where useful.

## Conversion Rules

For service pages, prioritize:

- Consultation request
- Cost inquiry
- Phone or WhatsApp contact
- Related document purchase

For articles, prioritize:

- Link to the matching service page
- Link to relevant downloadable document
- FAQ-driven internal links

For product pages, prioritize:

- Purchase CTA
- Trust elements: secure payment, instant download, support/contact, and update/refund policy if available
- Related service CTA for users who need execution help

## Tone

Use Persian with a formal, trustworthy, and practical tone.

Avoid exaggerated claims, slang, unsupported promises, and copied competitor text.
