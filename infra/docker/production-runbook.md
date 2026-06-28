# Production Runbook

## Prerequisites

- Docker Engine with the Compose plugin
- A domain pointed to the host
- Nginx and TLS configured on the host
- A VPS or dedicated Linux server with SSH and Docker access

Shared cPanel/WordPress hosting without Docker and SSH access is not a supported deployment target.

## Environment

Create `.env` from `.env.example` and replace every `replace-with-*` value.

Required secrets:

- `MYSQL_PASSWORD`
- `MYSQL_ROOT_PASSWORD`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

Keep `APP_BIND_ADDRESS=127.0.0.1`, `BACKEND_BIND_ADDRESS=127.0.0.1`, and do not expose MySQL publicly.

Use different, strong values for the MySQL application user, MySQL root user, and Admin account. Local development passwords must not be reused in production.

## First Installation

```bash
docker compose config --quiet
docker compose build --no-cache
docker compose up -d --no-build
docker compose ps
```

All three services must become `healthy`.

## Verification

```bash
curl --fail http://127.0.0.1:3000/fa
curl --fail http://127.0.0.1:8000/health
curl --fail http://127.0.0.1:3000/api/world-clocks
```

The Admin route must return `401` without credentials:

```bash
curl --output /dev/null --silent --write-out "%{http_code}\n" http://127.0.0.1:3000/admin
```

## Update

```bash
git pull --ff-only origin main
docker compose build --no-cache
docker compose up -d --no-build --remove-orphans
docker compose ps
```

## Logs

```bash
docker compose logs --tail 200
docker compose logs -f khoobrooz-web khoobrooz-api
```

## Database Backup

```bash
docker compose exec -T khoobrooz-mysql sh -c \
  'mysqldump --no-tablespaces --single-transaction -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"' \
  > khoobrooz-backup.sql
```

Do not use `docker compose down -v` in production because it deletes the database volume.

## Reverse Proxy

Copy `infra/nginx/khoobrooz.conf.example`, enable the site, and issue a TLS certificate before public access:

```bash
sudo certbot --nginx -d khoobrooz.com -d www.khoobrooz.com
```

Only ports `22`, `80`, and `443` should be public. Ports `3000`, `8000`, and `3306` must remain private. Basic Auth credentials must only travel over HTTPS.

## Production Readiness Checklist

- DNS records for `khoobrooz.com` and `www.khoobrooz.com` point to the server.
- Production `.env` contains unique secrets and is not committed.
- `docker compose config --quiet` succeeds.
- All three containers become `healthy`.
- Nginx proxies to `127.0.0.1:3000`.
- TLS is active and HTTP redirects to HTTPS.
- Admin returns `401` without credentials and opens only over HTTPS.
- A database backup is created and its restore procedure is tested.
- GitHub Actions checks pass on `main`.
