# Docker

این فولدر برای مستندات و فایل‌های مربوط به `Docker` نگهداری می‌شود.

## وضعیت فعلی

Frontend با Next.js داکرایز شده است.

فایل‌های فعلی:

```text
Dockerfile
docker-compose.yml
.dockerignore
```

## ساختار هدف بعد از Backend

در فاز Backend، `docker-compose.yml` باید سرویس‌های زیر را پوشش دهد:

- `web`
- `api`
- `sqlserver`
- `redis`
- `queue`
- `scheduler`

هر سرویس باید healthcheck و env مستقل داشته باشد.

## SQL Server local

برای اجرای SQL Server روی local فایل زیر اضافه شده است:

```text
infra/docker/docker-compose.sqlserver.yml
```

راهنمای کامل:

```text
database-design/sqlserver-local.md
```
