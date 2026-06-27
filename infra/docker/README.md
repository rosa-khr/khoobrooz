# Docker

این فولدر برای مستندات و فایل‌های مربوط به `Docker` نگهداری می‌شود.

## وضعیت فعلی

Frontend، Backend و MySQL با Docker Compose اجرا می‌شوند.

فایل‌های فعلی:

```text
Dockerfile
docker-compose.yml
.dockerignore
```

## سرویس‌های فعلی

- `web`
- `api`
- `mysql`

هر سرویس باید healthcheck و env مستقل داشته باشد.
