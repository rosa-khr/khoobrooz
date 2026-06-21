# برنامه Seed کامل کشورها

جدول `countries` باید در نسخه نهایی شامل همه کشورها باشد و برای dropdownها استفاده شود.

## وضعیت فعلی

فایل زیر seed bootstrap دارد و فقط کشورهای مهم تجاری را وارد می‌کند:

```text
database-design/sql/002_seed_core.sql
```

این seed برای شروع توسعه کافی است، اما جایگزین seed کامل کشورها نیست.

## نیاز نهایی

در فاز Laravel باید یک `Seeder` کامل ساخته شود:

```text
CountrySeeder
```

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

منبع داده باید قبل از پیاده‌سازی نهایی مشخص شود و در داکیومنت integration ثبت شود. داده نباید بدون منبع یا دستی و ناقص وارد production شود.
