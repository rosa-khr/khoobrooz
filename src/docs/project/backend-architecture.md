# Backend architecture

## Direction

Khoobrooz should move from mostly file-based content to a dynamic service platform:

- Next.js remains the public frontend.
- Laravel becomes the REST API and admin backend.
- SQL Server stores dynamic content and market data.
- Docker Compose runs frontend, backend, SQL Server, queue worker, and scheduler on VPS or cloud.
- Metronic can be used for the admin UI style.

This setup is not suitable for a basic WordPress/cPanel host unless Node.js, PHP extensions, SQL Server drivers, workers, and long-running processes are supported. A VPS or container host is recommended.

## Proposed repository shape

```text
apps/
  web/          # current Next.js app, moved later if we convert to monorepo
  api/          # Laravel REST API and admin
infra/
  docker/
docs/
```

For the current project, Laravel can first be added as `backend/` to avoid a risky move of the existing frontend.

## Stack

- Frontend: Next.js 15, React 19, Tailwind
- Backend: Laravel 11 or 12 REST API
- Admin: Laravel + Metronic theme, preferably Blade/Inertia depending on license/assets
- Database: SQL Server
- Cache/queue: Redis when available
- Auth: Laravel Sanctum for admin/session and API tokens
- Scheduler: Laravel Scheduler for market rate sync

## Core entities

### Users and access

- `users`
- `roles`
- `permissions`
- `role_user`
- `permission_role`

Purpose: admin login, editors, SEO/content roles.

### Menus

- `menus`
- `menu_items`

Fields:

- `menus`: `id`, `key`, `title`, `locale`, `is_active`, timestamps
- `menu_items`: `id`, `menu_id`, `parent_id`, `title`, `url`, `route_name`, `target`, `icon`, `sort_order`, `is_active`, timestamps

Notes:

- Supports header, footer, mobile, and language-specific menus.
- Nested menu items use `parent_id`.

### Pages

- `pages`

Fields:

- `id`, `locale`, `slug`, `title`, `summary`, `body`, `status`, `seo_title`, `seo_description`, `canonical_url`, `published_at`, timestamps

Purpose: static-like dynamic pages such as about, services landing, contact text blocks.

### Articles and knowledge

- `articles`
- `article_translations` if multilingual content becomes more complex
- `categories`
- `tags`
- `article_tag`

Fields:

- `articles`: `id`, `locale`, `category_id`, `slug`, `title`, `excerpt`, `body`, `cover_image_id`, `status`, `seo_title`, `seo_description`, `published_at`, timestamps
- `categories`: `id`, `type`, `locale`, `slug`, `title`, `sort_order`, `is_active`, timestamps
- `tags`: `id`, `locale`, `slug`, `title`, timestamps

Purpose: blog, encyclopedia, trade education.

### News

- `news`
- `news_tag`

Fields:

- `id`, `locale`, `slug`, `title`, `summary`, `body`, `source_name`, `source_url`, `status`, `seo_title`, `seo_description`, `published_at`, timestamps

Notes:

- Keep `source_url` optional and avoid public outbound links unless needed.

### Services

- `services`

Fields:

- `id`, `locale`, `slug`, `title`, `short_title`, `summary`, `body`, `icon`, `sort_order`, `is_featured`, `status`, `seo_title`, `seo_description`, timestamps

Purpose: dynamic service pages, homepage service marquee, service menu.

### Documents and files

- `documents`
- `media_files`

Fields:

- `documents`: `id`, `locale`, `slug`, `title`, `description`, `file_id`, `status`, `price`, `is_free`, `seo_title`, `seo_description`, timestamps
- `media_files`: `id`, `disk`, `path`, `mime_type`, `size`, `alt`, `caption`, timestamps

Purpose: trade templates, downloadable files, future paid content.

### Market rates

- `market_rate_sources`
- `market_rate_instruments`
- `market_rate_snapshots`
- `market_rate_sync_logs`

Fields:

- `market_rate_sources`: `id`, `key`, `name`, `base_url`, `is_active`, timestamps
- `market_rate_instruments`: `id`, `source_id`, `key`, `group`, `title`, `symbol`, `unit`, `sort_order`, `is_active`, timestamps
- `market_rate_snapshots`: `id`, `instrument_id`, `price`, `high`, `low`, `change`, `change_percent`, `direction`, `source_updated_at`, `fetched_at`, timestamps
- `market_rate_sync_logs`: `id`, `source_id`, `status`, `message`, `started_at`, `finished_at`

Purpose:

- Dynamic currency page
- Homepage market board
- Scheduled fetch at 09:00 and 15:00 Iran time
- Historical snapshots if needed later

### Leads and contact

- `contact_requests`

Fields:

- `id`, `type`, `name`, `phone`, `email`, `company`, `message`, `metadata`, `status`, timestamps

Types:

- `general`
- `customs_clearance`
- `document_request`
- `consultation`

### Site settings

- `settings`

Fields:

- `id`, `group`, `key`, `value`, `type`, `locale`, timestamps

Purpose: phone numbers, WhatsApp/Bale links, SEO defaults, social links, footer data.

## REST API draft

Public frontend API:

```text
GET /api/v1/menus/{key}?locale=fa
GET /api/v1/pages/{slug}?locale=fa
GET /api/v1/services?locale=fa
GET /api/v1/services/{slug}?locale=fa
GET /api/v1/articles?locale=fa&category=&tag=&page=
GET /api/v1/articles/{slug}?locale=fa
GET /api/v1/news?locale=fa&page=
GET /api/v1/news/{slug}?locale=fa
GET /api/v1/documents?locale=fa&page=
GET /api/v1/market-rates?groups=market,metal,coin
GET /api/v1/market-rates/board
GET /api/v1/settings/public?locale=fa
POST /api/v1/contact-requests
```

Admin API:

```text
POST /api/admin/login
POST /api/admin/logout
GET /api/admin/me

GET/POST/PATCH/DELETE /api/admin/menus
GET/POST/PATCH/DELETE /api/admin/menu-items
GET/POST/PATCH/DELETE /api/admin/pages
GET/POST/PATCH/DELETE /api/admin/services
GET/POST/PATCH/DELETE /api/admin/articles
GET/POST/PATCH/DELETE /api/admin/news
GET/POST/PATCH/DELETE /api/admin/categories
GET/POST/PATCH/DELETE /api/admin/tags
GET/POST/PATCH/DELETE /api/admin/documents
GET/POST/PATCH/DELETE /api/admin/media-files
GET/POST/PATCH/DELETE /api/admin/market-rate-instruments
POST /api/admin/market-rates/sync
GET/PATCH /api/admin/settings
```

## Laravel jobs and scheduler

Jobs:

- `SyncMarketRatesJob`
- `GenerateSitemapJob`
- `ClearFrontendCacheJob`

Scheduler:

```php
$schedule->job(new SyncMarketRatesJob())->timezone('Asia/Tehran')->dailyAt('09:00');
$schedule->job(new SyncMarketRatesJob())->timezone('Asia/Tehran')->dailyAt('15:00');
```

## Frontend migration steps

1. Keep current file-based data as fallback.
2. Add API client layer in Next.js.
3. Replace menus with `/api/v1/menus/header`.
4. Replace services with `/api/v1/services`.
5. Replace articles, news, knowledge, documents page by page.
6. Replace market rates with Laravel endpoint.
7. Add cache/revalidate strategy.

## Admin panel with Metronic

Admin sections:

- Dashboard
- Menu builder
- Pages
- Services
- Articles
- News
- Categories and tags
- Documents and media
- Market rates
- Contact requests
- Settings
- Users and roles

Metronic should be used as a visual system, but its license/assets must be available before committing it into the repository.

## Implementation phases

### Phase 1: Backend foundation

- Add Laravel app
- Configure SQL Server
- Add auth
- Add migrations for users, settings, menus
- Add Docker services for API and SQL Server

### Phase 2: Content API

- Pages
- Services
- Articles
- News
- Tags/categories
- Media

### Phase 3: Market data

- Sources
- Instruments
- Snapshots
- Sync job
- Public API for board and currency page

### Phase 4: Admin panel

- Metronic layout
- CRUD screens
- Role permissions
- Upload/media manager

### Phase 5: Frontend integration

- Dynamic menus
- Dynamic home sections
- Dynamic articles/news
- Dynamic market rates

### Phase 6: Deployment

- VPS or cloud container host
- Docker Compose production
- Nginx/Caddy reverse proxy
- SSL for `khoobrooz.com`
- GitHub Actions deploy after merge to production
