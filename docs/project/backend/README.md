# مستند Backend

این سند مرز و مسئولیت‌های `Backend` پروژه خوبروز را مشخص می‌کند.

## وضعیت فعلی

Backend هنوز پیاده‌سازی نشده است. فولدر `backend/` برای شروع Laravel آماده شده و در فاز بعدی scaffold می‌شود.

## Stack هدف

- `Laravel`
- `MySQL 8.4`
- `Laravel Sanctum`
- `Redis`
- `Laravel Scheduler`
- `Queue Worker`
- `REST API`

## مسئولیت‌ها

- مدیریت Auth
- مدیریت Role و Permission
- مدیریت CRUDهای ادمین
- مدیریت workflow تایید و انتشار محتوا
- مدیریت نرخ ارز و sync داده
- مدیریت countries و dropdownها
- مدیریت social links
- مدیریت cart/order/payment در فاز بعدی

## قوانین اصلی

- همه جدول‌ها `id` دارند.
- همه جدول‌های اصلی `accuracy` دارند.
- حذف رکوردها با `accuracy = TRASHED` انجام می‌شود.
- همه فرم‌ها `Validation` دارند.
- همه APIها response یکدست دارند.
- هر سرویس بیرونی باید تست و داکیومنت داشته باشد.

## API boundaries

Public API:

```text
/api/v1
```

Admin API:

```text
/api/admin
```

## تست‌ها

برای Backend:

```bash
php artisan test
```

برای Migration:

```bash
php artisan migrate --pretend
```

بعد از اضافه شدن Laravel، این دستورها باید وارد pipeline شوند.
