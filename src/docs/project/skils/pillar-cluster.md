---
name: khoobrooz-pillar-cluster
description: Use this skill when planning Khoobrooz SEO architecture, pillar pages, cluster pages, keyword priorities, internal linking, article topics, knowledge-base structure, and service-led organic acquisition for import, export, customs clearance, and trade education.
---

# Khoobrooz Pillar Cluster

## SEO Principle

Khoobrooz should use articles, glossary pages, FAQ pages, and regulatory updates to attract organic traffic, but services must remain the commercial center of the website.

Build one dedicated landing page for every important service keyword. Blog, knowledge-base, glossary, FAQ, and document pages must internally link back to service pages.

## Implementation Location

Current route implementation belongs in:

- `src/app/[locale]/...`

Shared content/navigation data belongs in:

- `src/data`

Project docs and planning artifacts belong in:

- `src/docs/project`

Do not create SEO pages, article drafts, or data files at the project root.

## Keyword Priority Guide

Use this relative priority for page creation and internal linking. Exact search volume should be verified with current SEO tools when available.

Very high:

- ترخیص کالا
- ترخیص کالا از گمرک
- واردات کالا
- واردات از چین

High:

- ثبت سفارش واردات
- ثبت سفارش کالا
- کارگو چین
- هزینه ترخیص کالا
- مراحل ترخیص کالا
- ترخیص کار گمرک

Medium-high:

- حمل و نقل بین المللی
- مشاوره امور گمرکی
- اظهارنامه گمرکی
- پروفرما اینویس
- کارت بازرگانی
- سامانه جامع تجارت

Medium:

- صادرات کالا
- آموزش صادرات
- صادرات خرد
- صادرات چمدانی
- قرارداد صادراتی
- پکینگ لیست
- بارنامه

Lower but useful for topical authority:

- اصطلاحات گمرکی
- کوتاژ
- ارزش گمرکی
- کالای متروکه
- بیمه کالاهای صادراتی

## Pillar 1: ترخیص کالا

Intent: high commercial intent. This is the strongest service pillar and should have the clearest consultation CTA.

Main page:

- ترخیص کالا

Cluster pages:

- ترخیص کالا از گمرک
- مراحل ترخیص کالا از گمرک
- هزینه ترخیص کالا از گمرک
- ترخیص کار گمرک کیست؟
- مدارک لازم برای ترخیص کالا
- اظهارنامه گمرکی چیست؟
- حقوق گمرکی چیست؟
- کالای متروکه چیست؟
- ترخیص کالا از گمرک امام خمینی
- ترخیص کالا از گمرک بندرعباس
- ترخیص کالاهای خاص، if relevant: پزشکی، آرایشی، قطعات، ماشین‌آلات

Internal links:

- Every cluster page must link to the ترخیص کالا service page.
- Service page must link to FAQ, related articles, and consultation/contact.

## Pillar 2: ثبت سفارش و واردات

Intent: high commercial and educational intent. Good for capturing people before they reach customs clearance.

Main pages:

- ثبت سفارش واردات
- واردات کالا

Cluster pages:

- ثبت سفارش کالا در سامانه جامع تجارت
- مراحل ثبت سفارش واردات
- مدارک لازم برای ثبت سفارش کالا
- واردات کالا چیست؟
- مراحل واردات کالا
- هزینه واردات کالا
- مجوزهای واردات کالا
- کارت بازرگانی برای واردات
- واردات رسمی کالا
- واردات کالا برای شرکت‌ها

Internal links:

- Registration and import articles must link to ثبت سفارش واردات, واردات کالا, and ترخیص کالا.

## Pillar 3: واردات از چین و کارگو

Intent: high commercial intent with strong long-tail demand. This pillar should be prominent because many users search by origin country.

Main pages:

- واردات از چین
- کارگو چین

Cluster pages:

- مراحل واردات از چین
- خرید کالا از چین
- ارسال بار از چین به ایران
- کارگو چیست؟
- هزینه کارگو چین
- حمل دریایی از چین
- حمل هوایی از چین
- انتخاب بندر مبدا در چین
- منبع‌یابی کالا در چین
- بازرسی کالا در چین

Internal links:

- China-related articles should link to واردات از چین, کارگو چین, حمل و نقل بین‌المللی, ثبت سفارش واردات, and ترخیص کالا.

## Pillar 4: صادرات کالا

Intent: mixed educational and commercial intent. This pillar supports authority and can feed education products, consultation, and document sales.

Main page:

- صادرات کالا

Cluster pages:

- آموزش صادرات
- مراحل صادرات کالا
- صادرات خرد چیست؟
- صادرات چمدانی چیست؟
- مدارک لازم برای صادرات
- انتخاب بازار هدف صادراتی
- بازاریابی صادراتی
- مذاکره با خریدار خارجی
- روش‌های پرداخت بین‌المللی
- قرارداد صادراتی
- بیمه کالاهای صادراتی

Internal links:

- Export education content should link to صادرات کالا, مشاوره واردات و صادرات, فایل‌ها و اسناد تجاری, and relevant paid templates.

## Pillar 5: اسناد و فایل‌های تجاری

Intent: transactional and educational. This section supports direct revenue through downloadable products.

Main page:

- فایل‌ها و اسناد تجاری

Product or category pages:

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

Internal links:

- Product pages should link to related service pages.
- Educational articles should link to matching paid or free documents when relevant.

## Pillar 6: دانشنامه و اصطلاحات گمرکی

Intent: informational. Use this to capture broad organic searches and build topical authority.

Main page:

- دانشنامه تجارت

Cluster pages:

- اصطلاحات گمرکی
- اصطلاحات واردات
- اصطلاحات صادرات
- پروفرما اینویس چیست؟
- پکینگ لیست چیست؟
- بارنامه چیست؟
- HS Code چیست؟
- تعرفه گمرکی چیست؟
- ارزش گمرکی چیست؟
- EPL چیست؟
- سامانه جامع تجارت چیست؟
- کوتاژ چیست؟

Internal links:

- Every glossary page should link to at least one service page and one commercial document page when relevant.

## Pillar 7: بخشنامه‌ها و اخبار گمرکی

Intent: freshness, authority, and repeat visits. This section should not replace evergreen service pages.

Main pages:

- بخشنامه‌های گمرکی
- اخبار تجارت و گمرک

Cluster examples:

- جدیدترین بخشنامه‌های گمرکی
- اخبار ثبت سفارش
- اخبار بانک مرکزی مرتبط با واردات و صادرات
- اخبار وزارت صمت
- تغییرات قوانین صادرات و واردات
- نرخ ارز گمرکی, if reliable source integration is available

Important:

- Time-sensitive content must include exact dates.
- When writing or updating regulatory content, verify current information from official sources where possible.

## Page Template Rules

For every service page, include:

- One clear H1 using the primary keyword.
- Short official intro focused on the user's problem.
- Who the service is for.
- Step-by-step process.
- Required documents.
- Common costs or cost factors, without making unsupported exact claims.
- Why Khoobrooz.
- FAQ section.
- CTA for consultation or cost inquiry.
- Internal links to related articles, documents, and services.
- SEO title, meta description, canonical URL, and structured data when implementation supports it.

For every article or knowledge-base page, include:

- One search-focused H1.
- Clear answer in the first screen.
- Practical sections using H2/H3.
- Links to relevant service pages.
- Links to relevant paid or free documents.
- FAQ section when useful.
- Updated date for regulatory or price-sensitive topics.
