# مستند Docker و Deployment

این سند مسیر اجرای production پروژه با `Docker` را توضیح می‌دهد.

## وضعیت فعلی

- پروژه با سه سرویس Docker اجرا می‌شود:
  - `khoobrooz-web`: رابط کاربری `Next.js`
  - `khoobrooz-api`: سرویس Backend
  - `khoobrooz-mysql`: دیتابیس `MySQL 8.4`
- فایل‌های اصلی:
  - `Dockerfile`
  - `docker-compose.yml`
  - `.dockerignore`
  - `.env.example`
- مرز مستندات infra:
  - `infra/README.md`
  - `infra/docker/README.md`
  - `infra/nginx/README.md`
- خروجی Next.js روی حالت `standalone` تنظیم شده است.
- اطلاعات محرمانه فقط در فایل local و ignore‌شده `.env` نگهداری می‌شوند.

## تست production روی local

اگر `Docker Desktop` نصب باشد:

```bash
npm run typecheck
npm run lint
npm run build
docker compose up --build -d
docker compose ps
```

آدرس تست:

```text
http://localhost:3000
```

برای دیدن logها:

```bash
docker compose logs -f
```

برای توقف:

```bash
docker compose down
```

## متغیرهای محیطی

نمونه فایل:

```text
.env.example
```

برای سرور باید از روی آن فایل `.env` ساخته شود:

```bash
cp .env.example .env
```

متغیرهای فعلی:

```text
APP_PORT=3000
APP_BIND_ADDRESS=127.0.0.1
BACKEND_PORT=8000
BACKEND_BIND_ADDRESS=127.0.0.1
MYSQL_DATABASE=...
MYSQL_USER=...
MYSQL_PASSWORD=...
MYSQL_ROOT_PASSWORD=...
ADMIN_USERNAME=...
ADMIN_PASSWORD=...
TGJU_API_URL=...
```

`TGJU_API_URL` فقط باید در سرویس backend/api استفاده شود. سرویس frontend نباید آدرس provider خارجی را داشته باشد.

در محیط local، مقادیر رمز در `.env` تنظیم شده‌اند. فایل `.env` در `.gitignore` قرار دارد و نباید commit شود. برای staging و production باید رمزهای قوی و منحصربه‌فرد جایگزین شوند.

## Deployment روی VPS

پیش‌نیازها:

- Ubuntu یا Linux server
- Docker
- Docker Compose
- Git
- دسترسی SSH

مراحل:

```bash
git clone https://github.com/rosa-khr/khoobrooz.git
cd khoobrooz
cp .env.example .env
docker compose up --build -d
```

## Reverse Proxy

برای اتصال دامنه، `Nginx` یا `Caddy` باید requestها را به کانتینر بفرستد:

```text
127.0.0.1:3000
```

دامنه production:

```text
khoobrooz.com
```

بعد از اتصال دامنه، SSL با `Let's Encrypt` فعال می‌شود.

## Cron برای نرخ ارز

اگر نرخ‌ها از API داخلی گرم شوند:

```cron
0 9,15 * * * curl -fsS https://khoobrooz.com/api/market-rates >/dev/null
```

اگر timezone سرور UTC باشد:

```cron
30 5,11 * * * curl -fsS https://khoobrooz.com/api/market-rates >/dev/null
```

## Branch flow

مسیر merge:

```text
feat -> dev -> main/prod
```

فعلاً branch اصلی production در GitHub برابر `main` است. اگر branch `prod` ساخته شود، workflow فعلی از آن هم پشتیبانی می‌کند.

## جداسازی بعدی

فایل‌های زیرساختی در صورت گسترش سرویس‌ها باید مرحله‌ای تفکیک شوند:

```text
infra/docker/
infra/nginx/
```

تا قبل از آن، `Dockerfile` و `docker-compose.yml` در root باقی می‌مانند تا build فعلی Frontend نشکند.
