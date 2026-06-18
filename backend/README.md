# Backend

این فولدر برای پیاده‌سازی `Laravel Backend` پروژه خوبروز است.

## مسئولیت‌ها

- `REST API` عمومی برای Frontend
- `Admin API`
- `Admin Panel` با سبک `Metronic`
- مدیریت `Auth`, `Role`, `Permission`
- مدیریت `Menus`, `Pages`, `Articles`, `News`, `Tags`, `Services`
- مدیریت `Market Rates`, `World Clock`, `Countries`, `Social Links`
- مدیریت `Cart`, `Order`, `Payment` در فاز فروش فایل/خدمات

## ساختار هدف

بعد از scaffold شدن Laravel، ساختار لایه‌ها باید این مدل را رعایت کند:

```text
backend/app/
  Http/
    Controllers/
    Requests/
    Resources/
  Models/
  Services/
  Repositories/
  Actions/
  DTOs/
  Jobs/
  Policies/
  Support/
```

## قوانین

- هیچ business logic سنگینی داخل `Controller` نوشته نمی‌شود.
- همه فرم‌ها باید `FormRequest` و `Validation` داشته باشند.
- همه خروجی‌های API باید با `Resource` یکدست شوند.
- هر `Crawler`, `External API Client`, `Job` و `Scheduler` باید تست و داکیومنت داشته باشد.
- حذف رکوردها logical است و با `accuracy = TRASHED` انجام می‌شود.

## وضعیت فعلی

این فولدر شامل اسکلت اولیه `Laravel-compatible` است:

- `Models`
- `Services`
- `Routes`
- `Migrations`
- `Seeders`
- `Schema Contract Test`

در محیط فعلی local، نصب ابزارهای زیر به خاطر محدودیت شبکه/نسخه macOS کامل نشد:

```text
php
composer
```

برای scaffold واقعی Laravel باید PHP و Composer نصب شود یا محیط Docker/VPS آماده باشد. تا آن زمان، قرارداد دیتابیس با تست سبک Node کنترل می‌شود:

```bash
npm run test:backend-contracts
```

## مستندات اجرایی

```text
backend/docs/
```

مهم‌ترین فایل‌ها:

- `backend/docs/laravel-scaffold.md`
- `backend/docs/foundation-checklist.md`
- `backend/docs/database-contracts.md`
- `backend/docs/testing-standard.md`
