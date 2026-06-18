# ساخت Laravel Backend

این سند مراحل scaffold کردن `Laravel Backend` را مشخص می‌کند.

## پیش‌نیازها

روی سیستم local یا سرور توسعه باید نصب باشد:

```bash
php -v
composer --version
```

نسخه پیشنهادی:

```text
PHP 8.3+
Composer 2+
Laravel 11/12
```

## روش پیشنهادی ساخت

چون فولدر `backend/` از قبل برای docs ساخته شده، بهتر است Laravel ابتدا در مسیر temporary ساخته شود و بعد فایل‌های app به `backend/` منتقل شوند.

نمونه:

```bash
composer create-project laravel/laravel /tmp/khoobrooz-api
```

بعد از ساخت، محتوا با دقت به `backend/` منتقل می‌شود و پوشه `backend/docs/` حفظ می‌شود.

## ساختار لایه‌ها بعد از scaffold

بعد از نصب Laravel، این فولدرها باید ساخته شوند:

```text
backend/app/
  Actions/
  DTOs/
  Http/
    Controllers/
    Requests/
    Resources/
  Jobs/
  Models/
  Policies/
  Repositories/
  Services/
  Support/
```

## Packageهای اولیه

Packageهای پیشنهادی:

```bash
composer require laravel/sanctum
composer require predis/predis
```

برای `SQL Server` باید driver مناسب PHP روی محیط نصب باشد:

```text
sqlsrv
pdo_sqlsrv
```

## تنظیمات Environment

نمونه اتصال SQL Server:

```env
DB_CONNECTION=sqlsrv
DB_HOST=sqlserver
DB_PORT=1433
DB_DATABASE=khoobrooz
DB_USERNAME=sa
DB_PASSWORD=ChangeThisStrongPassword
```

هیچ مقدار واقعی password نباید داخل repository ذخیره شود.

## تست بعد از scaffold

بعد از نصب:

```bash
php artisan test
php artisan migrate --pretend
```
