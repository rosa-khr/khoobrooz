# MySQL Schema

این پوشه نسخه اجرایی دیتابیس خوبروز برای `MySQL 8.4` را نگهداری می‌کند.

## ترتیب اجرا

```text
001_core_schema.sql
002_seed_core.sql
003_repair_utf8_seed_data.sql
004_enforce_utf8mb4.sql
```

در حالت `Docker Compose` این فایل‌ها از مسیر زیر به کانتینر `khoobrooz-mysql` وصل می‌شوند و هنگام ساخت volume جدید اجرا می‌شوند:

```text
/docker-entrypoint-initdb.d
```

تمام متن‌های فارسی با `utf8mb4` و collation برابر `utf8mb4_unicode_ci` ذخیره می‌شوند. فایل `003` داده‌های seed قدیمی با encoding اشتباه را ترمیم می‌کند و فایل `004` تنظیمات دیتابیس و جدول‌های موجود را به collation استاندارد پروژه تبدیل می‌کند.

## جدول‌های فعلی

- `menus`
- `categories`
- `tags`
- `services`
- `articles`
- `article_tag`
- `news`
- `news_tag`
- `countries`
- `world_clock_items`

## قانون حذف منطقی

حذف رکوردها با تغییر مقدار `accuracy` انجام می‌شود:

```text
PENDING = 0
ACCEPTED = 1
TRASHED = 2
```

در خروجی dropdownها فقط داده‌های قابل انتخاب با `accuracy = 1` برگردانده می‌شوند.
