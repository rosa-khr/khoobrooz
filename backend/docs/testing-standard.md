# استاندارد تست Backend

این سند قوانین تست Backend را مشخص می‌کند.

## تست‌های اجباری

برای هر feature مهم:

- `Feature Test`
- `Validation Test`
- `Authorization Test` در صورت نیاز
- `Unit Test` برای Service/Actionهای مهم

## سرویس‌های بیرونی

هر `Crawler`, `External API Client`, `Scheduler`, `Queue Job` و `Import Service` باید تست داشته باشد.

قانون:

- تست‌ها نباید به اینترنت واقعی وابسته باشند.
- از `Mock`, `Fake Response` یا fixture استفاده شود.
- حالت خطا هم تست شود.

سناریوهای خطا:

```text
timeout
invalid response
failed status code
missing fields
empty response
```

## تست Logical Delete

برای همه CRUDها باید تست شود:

```text
delete action -> accuracy = TRASHED
```

و رکورد از لیست عادی حذف شود.

## تست Approval و Publish

برای `articles` و `news`:

- رکورد بدون `approve=true` نباید public شود.
- رکورد بدون `is_published=true` نباید public شود.
- `scheduled_at` باید توسط Job قابل انتشار باشد.

## اجرای تست‌ها

```bash
php artisan test
```

برای migration:

```bash
php artisan migrate --pretend
```
