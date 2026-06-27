# Nginx

این فولدر برای تنظیمات `Nginx` یا reverse proxy نگهداری می‌شود.

## دامنه‌ها

Production:

```text
khoobrooz.com
```

Staging پیشنهادی:

```text
dev.khoobrooz.com
```

## هدف

در deployment نهایی، requestها باید به سرویس‌های داخلی منتقل شوند:

```text
/        -> web
/api     -> api
/admin   -> api/admin یا admin panel
```

SSL باید با `Let's Encrypt` یا سرویس معادل فعال شود.
