# اجرای SQL Server روی local

برای اجرای SQL Server روی macOS از `Docker` استفاده می‌کنیم.

## وضعیت سیستم فعلی

در سیستم فعلی:

```text
docker نصب نیست
colima نصب نیست
Homebrew به نسخه جدید رسیده، اما نصب Docker/Colima هنوز کامل نشده است
macOS فعلی نسخه 12 است
```

## نتیجه تلاش نصب در 2026-06-18

```text
brew --version => Homebrew 6.0.2
docker --version => command not found
colima version => command not found
```

موارد انجام‌شده:

- مالکیت `/usr/local/Homebrew` اصلاح شد.
- مالکیت `/usr/local/var/homebrew` اصلاح شد.
- مالکیت `/usr/local/etc/bash_completion.d` و `/usr/local/var/log` اصلاح شد.
- `brew update-reset` توانست خود Homebrew را به‌روزرسانی کند.

محدودیت باقی‌مانده:

```text
brew install docker colima
```

در نصب dependency مربوط به `go` متوقف شد، چون فرمول Homebrew برای macOS 12 به فایلی اشاره کرد که از سرور Go خطای 404 داد.

همچنین:

```text
brew install --cask docker
```

نسخه جدید Docker Desktop را پیشنهاد داد، اما Docker Desktop جدید روی macOS 12 نصب نمی‌شود و حداقل macOS Sonoma می‌خواهد.

طبق Docker Docs:

- Docker Desktop `4.42.0` حداقل macOS Ventura `13.3` می‌خواهد.
- بنابراین برای macOS 12 باید نسخه قبل از آن، مثل `4.41.x`، نصب شود.

## مسیر پیشنهادی برای macOS 12

برای این سیستم، مسیر عملی‌تر نصب دستی Docker Desktop نسخه سازگار است:

1. نسخه Intel/amd64 از Docker Desktop `4.41.x` را از آرشیو رسمی Docker دریافت کن.
2. فایل `Docker.dmg` را نصب کن.
3. Docker Desktop را یک بار باز کن تا Docker Engine اجرا شود.
4. از Terminal بررسی کن:

```bash
docker version
docker compose version
```

بعد از آماده شدن Docker Desktop، دیگر نیازی به Colima نیست و می‌توان SQL Server را با Docker Compose همین پروژه اجرا کرد.

## مسیر جایگزین

اگر نصب Docker Desktop روی macOS 12 زمان‌بر شد، اجرای SQL Server را می‌توان روی یکی از این محیط‌ها انجام داد:

- VPS لینوکسی
- GitHub Actions service container
- سیستم local دیگر با Docker فعال
- Docker Desktop نسخه سازگار با macOS 12

## وضعیت PHP و Composer

برای scaffold کامل Laravel، نصب `php` و `composer` هم امتحان شد:

```text
brew install php composer
```

این نصب به خاطر دسترسی نداشتن به منبع `sqlite.org` کامل نشد:

```text
Failed to download resource "sqlite (3.53.2)"
Couldn't connect to www.sqlite.org
```

بنابراین تا آماده شدن PHP/Composer یا Docker، فایل‌های backend به صورت `Laravel-compatible` نگهداری می‌شوند و قرارداد دیتابیس با تست Node بررسی می‌شود.

## نصب Docker CLI و Colima

اگر بعداً Homebrew بدون خطای dependency کار کرد:

```bash
brew install docker colima
```

شروع Colima:

```bash
colima start --cpu 2 --memory 4 --disk 40
docker version
```

## اجرای SQL Server

از root پروژه:

```bash
cp .env.example .env
docker compose -f infra/docker/docker-compose.sqlserver.yml up -d
```

بررسی وضعیت:

```bash
docker ps
docker logs khoobrooz-sqlserver
```

## اجرای schema

بعد از آماده شدن container:

```bash
docker exec -i khoobrooz-sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost \
  -U sa \
  -P "$SQLSERVER_SA_PASSWORD" \
  -C < database-design/sql/001_core_schema.sql
```

سپس:

```bash
docker exec -i khoobrooz-sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost \
  -U sa \
  -P "$SQLSERVER_SA_PASSWORD" \
  -C < database-design/sql/002_seed_core.sql
```

## نکته امنیتی

مقدار `SQLSERVER_SA_PASSWORD` در `.env.example` فقط نمونه است. برای محیط واقعی باید در `.env` مقدار قوی و خصوصی قرار گیرد و commit نشود.
