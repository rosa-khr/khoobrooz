# اجرای SQL Server روی local

برای اجرای SQL Server روی macOS از `Docker` استفاده می‌کنیم.

## وضعیت سیستم فعلی

در سیستم فعلی:

```text
docker نصب نیست
colima نصب نیست
brew اجرا می‌شود اما Homebrew قدیمی/خراب است و permission دارد
```

خطای Homebrew:

```text
error: cannot open .git/FETCH_HEAD: Permission denied
```

علت:

```text
/usr/local/Homebrew
```

متعلق به یک کاربر دیگر است و نیاز به اصلاح مالکیت دارد.

## دستور اصلاح Homebrew

این دستور باید توسط خود کاربر در Terminal اجرا شود، چون `sudo` رمز سیستم می‌خواهد:

```bash
sudo chown -R $(whoami):admin /usr/local/Homebrew
```

بعد:

```bash
git -C /usr/local/Homebrew pull --ff-only origin stable
brew --version
```

## نصب Docker CLI و Colima

بعد از درست شدن Homebrew:

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
