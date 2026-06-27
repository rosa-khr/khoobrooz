# برنامه Seed کامل کشورها

جدول `countries` باید در نسخه نهایی شامل همه کشورها باشد و برای dropdownها استفاده شود.

## وضعیت فعلی

Seed کامل کشورها اضافه شده است:

```text
backend/database/seeders/data/countries.php
database-design/sql/004_seed_countries_full.sql
```

`CoreSeeder` از فایل `backend/database/seeders/data/countries.php` استفاده می‌کند.

فیلدهای لازم:

```text
name_fa
name_en
iso2
iso3
phone_code
capital
currency_code
timezone_default
flag
sort_order
accuracy
```

## تست اجباری

برای `CountrySeeder` باید تست نوشته شود:

- تعداد کشورها کمتر از لیست معتبر ISO نباشد.
- `iso2` تکراری نباشد.
- `iso3` تکراری نباشد.
- `name_en` خالی نباشد.
- `accuracy` برای رکوردهای فعال برابر `ACCEPTED = 1` باشد.

## منبع داده

داده اولیه از دیتاست ساختاریافته کشورها شامل `name`, `capital`, `iso2`, `iso3` ساخته شده و نام فارسی با `Intl.DisplayNames` تولید شده است.
