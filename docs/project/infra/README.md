# مستند Infrastructure

این سند مرز و مسئولیت‌های `Infrastructure` پروژه خوبروز را مشخص می‌کند.

## مسئولیت‌ها

- Docker
- Docker Compose
- Reverse proxy
- SSL
- CI/CD
- Deployment
- محیط staging و production

## دامنه‌ها

Production:

```text
https://khoobrooz.com
```

Staging پیشنهادی:

```text
https://dev.khoobrooz.com
```

## Pipeline

Pipeline فعلی روی GitHub Actions اجرا می‌شود و این مراحل را دارد:

```bash
npm ci
npm run typecheck
npm run lint
npm run build
docker build
```

بعد از اضافه شدن Backend، مراحل زیر هم باید اضافه شوند:

```bash
composer install
php artisan test
php artisan migrate --pretend
```

## Database لوکال

دیتابیس local پروژه `MySQL 8.4` است و همراه سرویس‌های web و api از طریق فایل root با `docker compose up --build -d` اجرا می‌شود.
