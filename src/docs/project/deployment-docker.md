# Docker deployment

## Local production test

```bash
npm run typecheck
npm run lint
npm run build
docker compose build
docker compose up -d
docker compose ps
```

Open:

```text
http://localhost:3000
```

## Server deploy

1. Install Docker and Docker Compose on the server.
2. Clone or pull the repository.
3. Copy `.env.example` to `.env` and set `APP_PORT` if needed.
4. Run:

```bash
docker compose build
docker compose up -d
```

## Reverse proxy

Point Nginx or Caddy to the app container port:

```text
127.0.0.1:3000
```

Then enable HTTPS for the domain.

## Market rate warmup cron

Run these jobs in Iran time, or convert to the server timezone:

```cron
0 9,15 * * * curl -fsS https://YOUR_DOMAIN.com/api/market-rates >/dev/null
```

If the server runs on UTC:

```cron
30 5,11 * * * curl -fsS https://YOUR_DOMAIN.com/api/market-rates >/dev/null
```

## Branch flow

Current work branch goes to `dev` first. After testing on `dev`, open the production pull request to the production branch. In this repository the production branch currently appears as `main`; if the remote has a `prod` branch, use `prod` instead.
