# Infrastructure

این فولدر برای فایل‌ها و مستندات زیرساخت پروژه خوبروز است.

## مسئولیت‌ها

- `Docker`
- `Docker Compose`
- `Nginx` یا `Caddy`
- تنظیمات deployment
- تنظیمات SSL
- تنظیمات staging و production

## ساختار هدف

```text
infra/
  docker/
  nginx/
```

## نکته

در حال حاضر فایل‌های اصلی Docker در root پروژه قرار دارند:

```text
Dockerfile
docker-compose.yml
.dockerignore
```

بعد از اضافه شدن Backend و Database، فایل‌های زیرساختی می‌توانند به شکل مرحله‌ای به `infra/` منتقل یا تفکیک شوند.
