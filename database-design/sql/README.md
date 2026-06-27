# SQL Server Scripts

این پوشه نسخه طراحی‌شده SQL Server را نگهداری می‌کند.

## فایل‌ها

```text
001_core_schema.sql
002_seed_core.sql
```

## ترتیب اجرا

```text
001_core_schema.sql
002_seed_core.sql
```

## نکته مهم

این فایل‌ها منبع طراحی دیتابیس هستند. در مرحله Laravel، همین ساختار باید به `Migration` تبدیل شود.

## تست

فعلاً روی سیستم local ابزار SQL Server وجود ندارد، پس اجرای واقعی انجام نشده است. بعد از آماده شدن SQL Server باید این موارد تست شوند:

- اجرای schema بدون خطا
- اجرای seed بدون خطا
- بررسی `Foreign Key`
- بررسی `Unique Constraint`
- بررسی logical delete با `accuracy = 2`
