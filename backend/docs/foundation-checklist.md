# چک‌لیست Backend Foundation

این چک‌لیست قبل از شروع CRUDها باید تکمیل شود.

## مرحله ۱: Laravel Base

- نصب Laravel داخل `backend/`
- حفظ `backend/docs/`
- تنظیم `.env.example`
- تنظیم `APP_TIMEZONE=Asia/Tehran`
- تنظیم `APP_URL`

## مرحله ۲: ساختار لایه‌ها

- `Actions`
- `DTOs`
- `Services`
- `Repositories`
- `Support`
- `Http/Requests`
- `Http/Resources`
- `Policies`
- `Jobs`

## مرحله ۳: Auth و Access

- نصب و تنظیم `Laravel Sanctum`
- migration برای `users`
- migration برای `roles`
- migration برای `permissions`
- migration برای pivotهای دسترسی
- seed نقش admin اولیه

## مرحله ۴: Accuracy و Audit

- تعریف constant یا enum برای `accuracy`
- ساخت helper/trait برای logical delete
- ساخت migration macro یا pattern برای ستون‌های audit
- نوشتن test برای حذف منطقی

## مرحله ۵: MySQL

- تنظیم connection
- بررسی driver `pdo_mysql`
- تست migrate
- تست rollback

## مرحله ۶: تست و CI

- `php artisan test`
- `php artisan migrate --pretend`
- اضافه شدن تست Backend به GitHub Actions

## خروجی قابل قبول

این فاز وقتی تمام است که:

- Laravel بالا بیاید.
- تست پایه پاس شود.
- migrationهای پایه قابل اجرا باشند.
- ساختار لایه‌ها آماده باشد.
- داکیومنت این مرحله به‌روز باشد.
