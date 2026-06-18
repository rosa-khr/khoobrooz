---
name: khoobrooz-currency-rates
description: Rules for adding and maintaining currency-rate content and widgets in the Khoobrooz website.
---

# Currency Rates Skill

Use this skill when building:

- Currency-rate pages
- Exchange-rate widgets
- Import/export cost calculators
- Market-data tables sourced from TGJU or another approved source

## Source Rules

- Preferred source: `https://www.tgju.org/currency`
- Do not invent currency prices.
- Do not hard-code live-looking rates unless they come from a recorded, dated snapshot.
- Show source and update status near the table.
- If the crawler is not connected, display a pending/ready state instead of fake values.

## Priority Currencies

Use these first because they matter most for Khoobrooz services:

- USD: دلار آمریکا
- EUR: یورو
- AED: درهم امارات
- GBP: پوند انگلیس
- CNY: یوان چین
- TRY: لیر ترکیه

## UI Rules

- Keep the table clean and scannable.
- Include trade use cases, not only currency names.
- Avoid noisy financial-dashboard styling.
- Link the data to services such as واردات، ترخیص کالا، واردات از چین، and فایل‌های محاسباتی.

## Automation Rules

- Use a scheduled updater or cached server snapshot.
- Do not scrape TGJU on every client page render.
- Keep previous known-good values when a fetch fails.
- Store `updatedAt`, `source`, and `fetchStatus`.
