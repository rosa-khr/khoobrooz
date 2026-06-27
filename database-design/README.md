# Database Design

این فولدر برای طراحی و مستندسازی `Database` پروژه خوبروز است.

## Database هدف

Database اصلی فعلی:

```text
MySQL 8.4
```

## مواردی که اینجا نگهداری می‌شود

- `ERD`
- توضیح جدول‌ها
- `Migration Plan`
- `Seed Plan`
- مستندات `Indexes`
- مستندات `Foreign Keys`
- تصمیم‌های مربوط به performance و گزارش‌گیری
- اسکریپت‌های اجرایی MySQL در `database-design/mysql`
- اسکریپت‌های SQL Server قبلی فقط برای آرشیو تصمیم‌های طراحی در `database-design/sql` نگهداری می‌شوند.
- برنامه seed کامل کشورها در `database-design/countries-seed-plan.md`

## قوانین مشترک جدول‌ها

همه جدول‌های اصلی باید این ستون‌ها را داشته باشند:

```text
id
created_at
created_by
modified_at
modified_by
accuracy
```

مقادیر `accuracy`:

```text
PENDING = 0
ACCEPTED = 1
TRASHED = 2
```

برای entityهای قابل انتشار:

```text
is_published
published_at
published_by
```

برای entityهای نیازمند تایید مثل `articles` و `news`:

```text
approve
approved_at
approved_by
```

## Seedهای پایه

Seedهای پایه که باید در فاز پیاده‌سازی آماده شوند:

- `countries`
- `roles`
- `permissions`
- `settings`
- `market_rate_sources`
- `market_rate_instruments`

## SQL Scripts

نسخه اجرایی schema و seed در مسیر زیر قرار دارد:

```text
database-design/mysql/
```

ترتیب اجرا:

```text
001_core_schema.sql
002_seed_core.sql
```
