# استاندارد Repository و پیاده‌سازی

این سند از این مرحله به بعد مرجع ساختار فولدرها، داکیومنت‌نویسی و استاندارد لایه‌هاست.

## زبان مستندات

- توضیحات پروژه باید فارسی باشد.
- اصطلاحات فنی مثل `Backend`, `REST API`, `Migration`, `Service Layer`, `Repository`, `Controller`, `DTO`, `Docker`, `CI/CD` انگلیسی نوشته می‌شوند.
- هر تصمیم مهم باید در docs ثبت شود.

## ساختار فولدرها

ساختار فعلی:

```text
khoobrooz/
  src/                         # Next.js frontend
  public/                      # فایل‌های public
  Dockerfile                   # Docker frontend
  docker-compose.yml           # Compose فعلی frontend
  src/docs/project/            # مستندات پروژه
```

ساختار هدف بعد از شروع Backend:

```text
khoobrooz/
  src/                         # Frontend فعلی
  backend/                     # Laravel backend
  database-design/             # ERD و SQL notes
  infra/
    docker/
    nginx/
  src/docs/project/
```

## استاندارد Backend

وقتی Laravel اضافه شود، ساختار داخلی باید لایه‌بندی شده باشد:

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

قانون‌ها:

- `Controller` نباید business logic سنگین داشته باشد.
- `Validation` داخل `FormRequest` انجام می‌شود.
- خروجی API با `Resource` یکدست می‌شود.
- منطق اصلی داخل `Service` یا `Action` نوشته می‌شود.
- دسترسی‌های admin با `Policy` کنترل می‌شود.
- عملیات زمان‌بر با `Job` اجرا می‌شود.

## استاندارد Database

- همه تغییرات database باید با `Migration` انجام شود.
- نام جدول‌ها plural و snake_case باشد.
- ستون‌های مشترک:
  - `id`
  - `created_at`
  - `updated_at`
  - `created_by`
  - `modified_at`
  - `modified_by`
  - `accuracy`
- حذف منطقی با `accuracy = TRASHED` انجام می‌شود و حذف فیزیکی پیش‌فرض نیست.
- entityهای content باید فیلدهای SEO داشته باشند:
  - `seo_title`
  - `seo_description`
  - `canonical_url` در صورت نیاز
- entityهای چندزبانه باید `locale` داشته باشند.

## استاندارد API

- prefix عمومی:

```text
/api/v1
```

- prefix admin:

```text
/api/admin
```

- responseها باید ساختار قابل پیش‌بینی داشته باشند:

```json
{
  "data": {},
  "meta": {},
  "message": null
}
```

- خطاها باید status code درست داشته باشند:
  - `400`
  - `401`
  - `403`
  - `404`
  - `422`
  - `500`

## استاندارد Frontend integration

- Frontend فعلی تا زمان آماده شدن API نباید شکسته شود.
- برای هر بخش داینامیک، fallback data نگه داشته می‌شود.
- اتصال API مرحله‌ای انجام می‌شود:
  1. menu
  2. services
  3. articles
  4. news
  5. market rates
  6. settings

## استاندارد داکیومنت برای هر مرحله

برای هر feature مهم باید این موارد ثبت شود:

- هدف
- فایل‌های تغییر کرده
- migrationها
- endpointها
- تست‌ها
- تصمیم‌های مهم
- کارهای باقی‌مانده

محل ثبت:

```text
src/docs/project/
```

## استاندارد Commit و Branch

مسیر branch:

```text
feat -> dev -> main/prod
```

قبل از push:

```bash
npm run typecheck
npm run lint
npm run build
```

برای backend بعدی:

```bash
php artisan test
php artisan migrate --pretend
```
