# معماری Backend و Database

این سند مسیر تبدیل خوبروز از یک سایت Frontend محور به یک پلتفرم داینامیک با `Backend`, `Database`, `Admin Panel` و `REST API` را مشخص می‌کند.

## تصمیم معماری

- `Next.js` همچنان Frontend عمومی سایت باقی می‌ماند.
- `Laravel` به عنوان `Backend`، `REST API` و پایه `Admin Panel` استفاده می‌شود.
- `SQL Server` برای ذخیره داده‌های داینامیک استفاده می‌شود.
- `Docker Compose` برای اجرای سرویس‌های `web`, `api`, `sqlserver`, `redis`, `queue` و `scheduler` در محیط VPS یا Cloud در نظر گرفته می‌شود.
- پنل ادمین از نظر UI از سبک `Metronic` پیروی می‌کند.

این معماری برای هاست WordPress/cPanel معمولی مناسب نیست، مگر اینکه هاست از `Node.js App`, `PHP Extensions`, `SQL Server Driver`, `Queue Worker` و processهای طولانی پشتیبانی کند. گزینه مناسب‌تر برای این مسیر، VPS یا Azure است.

جزئیات عملیاتی موجودیت‌ها، فیلدهای مشترک، `accuracy`، workflow تایید/انتشار و استاندارد جدول‌های ادمین در سند زیر تکمیل شده است:

```text
src/docs/project/backend-domain-model.md
```

## ساختار پیشنهادی Repository

در همین Repository پیاده‌سازی می‌کنیم، اما فولدرها جدا و استاندارد می‌مانند:

```text
khoobrooz/
  src/                         # Frontend فعلی با Next.js
  backend/                     # Laravel API و Admin Panel
  database-design/             # مستندات ERD، SQL notes و seed plan
  infra/
    docker/                    # فایل‌های زیرساختی Docker/Nginx
  src/docs/project/            # مستندات محصول و معماری
```

فعلاً Frontend را از `src/` جابه‌جا نمی‌کنیم تا ریسک شکستن پروژه کم بماند. اگر بعداً لازم شد، می‌توانیم پروژه را به شکل monorepo با `apps/web` و `apps/api` بازچینش کنیم.

## Stack پیشنهادی

- Frontend: `Next.js 15`, `React 19`, `Tailwind`
- Backend: `Laravel 11/12`
- Admin Auth: `Laravel Sanctum`
- Admin UI: `Metronic`
- Database: `SQL Server`
- Cache/Queue: `Redis`
- Scheduler: `Laravel Scheduler`
- API Style: `REST API`

## استاندارد لایه‌های Backend

در Laravel فقط `Controller` سنگین نمی‌نویسیم. لایه‌ها باید جدا باشند:

```text
backend/app/
  Http/
    Controllers/
    Requests/
    Resources/
  Models/
  Services/
  Repositories/
  Actions/
  DTOs/
  Jobs/
  Policies/
  Support/
```

کار هر لایه:

- `Controller`: دریافت request و برگرداندن response.
- `FormRequest`: validation ورودی‌ها.
- `Resource`: فرمت خروجی API.
- `Service`: منطق اصلی business.
- `Repository`: ارتباط خواندن/نوشتن با Database برای entityهای پیچیده.
- `Action`: عملیات مشخص و کوچک مثل publish کردن مقاله یا sync نرخ ارز.
- `Job`: کارهای async مثل sync بازار یا ساخت sitemap.
- `Policy`: کنترل دسترسی admin.

## موجودیت‌ها و جدول‌ها

### کاربران و دسترسی‌ها

جدول‌ها:

- `users`
- `roles`
- `permissions`
- `role_user`
- `permission_role`

کاربرد:

- ورود ادمین
- نقش‌های مدیر، نویسنده، SEO و پشتیبان
- محدود کردن دسترسی CRUDها

### منوها

جدول‌ها:

- `menus`
- `menu_items`

فیلدهای اصلی `menus`:

- `id`
- `key`
- `title`
- `locale`
- `is_active`
- `created_at`
- `updated_at`

فیلدهای اصلی `menu_items`:

- `id`
- `menu_id`
- `parent_id`
- `title`
- `url`
- `route_name`
- `target`
- `icon`
- `sort_order`
- `is_active`
- `created_at`
- `updated_at`

نکته‌ها:

- منوی header، footer و mobile هرکدام می‌توانند `key` جدا داشته باشند.
- منوها چندسطحی هستند و با `parent_id` مدیریت می‌شوند.
- زبان فارسی default است و در URL پیشوند `fa` نمی‌گیرد.

### صفحه‌ها

جدول:

- `pages`

فیلدها:

- `id`
- `locale`
- `slug`
- `title`
- `summary`
- `body`
- `status`
- `seo_title`
- `seo_description`
- `canonical_url`
- `published_at`
- `created_at`
- `updated_at`

کاربرد:

- درباره ما
- تماس
- صفحه‌های ثابت خدمات
- متن‌های قابل مدیریت توسط admin

### مقاله‌ها و دانشنامه

جدول‌ها:

- `articles`
- `categories`
- `tags`
- `article_tag`

فیلدهای اصلی `articles`:

- `id`
- `locale`
- `category_id`
- `slug`
- `title`
- `excerpt`
- `body`
- `cover_image_id`
- `status`
- `seo_title`
- `seo_description`
- `published_at`
- `created_at`
- `updated_at`

کاربرد:

- بلاگ
- دانشنامه تجاری
- آموزش واردات و صادرات
- محتوای SEO محور

### خبرها

جدول‌ها:

- `news`
- `news_tag`

فیلدهای اصلی:

- `id`
- `locale`
- `slug`
- `title`
- `summary`
- `body`
- `source_name`
- `source_url`
- `status`
- `seo_title`
- `seo_description`
- `published_at`
- `created_at`
- `updated_at`

نکته SEO:

- `source_url` اختیاری است.
- لینک خارجی در صفحه عمومی فقط وقتی نمایش داده می‌شود که ارزش محتوایی داشته باشد.

### خدمات

جدول:

- `services`

فیلدها:

- `id`
- `locale`
- `slug`
- `title`
- `short_title`
- `summary`
- `body`
- `icon`
- `sort_order`
- `is_featured`
- `status`
- `seo_title`
- `seo_description`
- `created_at`
- `updated_at`

کاربرد:

- صفحه خدمات
- کارت‌های خدمات صفحه اول
- منوی خدمات

### فایل‌ها و اسناد تجاری

جدول‌ها:

- `documents`
- `media_files`

فیلدهای اصلی `documents`:

- `id`
- `locale`
- `slug`
- `title`
- `description`
- `file_id`
- `status`
- `price`
- `is_free`
- `seo_title`
- `seo_description`
- `created_at`
- `updated_at`

کاربرد:

- فایل‌های آموزشی
- فرم‌ها و قالب‌های تجاری
- فایل‌های قابل دانلود یا قابل فروش در آینده

### نرخ ارز و بازار

جدول‌ها:

- `market_rate_sources`
- `market_rate_instruments`
- `market_rate_snapshots`
- `market_rate_sync_logs`

فیلدهای اصلی `market_rate_sources`:

- `id`
- `key`
- `name`
- `base_url`
- `is_active`
- `created_at`
- `updated_at`

فیلدهای اصلی `market_rate_instruments`:

- `id`
- `source_id`
- `key`
- `group`
- `title`
- `symbol`
- `unit`
- `sort_order`
- `is_active`
- `created_at`
- `updated_at`

فیلدهای اصلی `market_rate_snapshots`:

- `id`
- `instrument_id`
- `price`
- `high`
- `low`
- `change`
- `change_percent`
- `direction`
- `source_updated_at`
- `fetched_at`
- `created_at`
- `updated_at`

کاربرد:

- صفحه قیمت ارزها
- برد بازار صفحه اول
- نگهداری snapshotهای نرخ‌ها
- sync زمان‌بندی شده ساعت ۹ و ۱۵ به وقت ایران

### درخواست‌های تماس

جدول:

- `contact_requests`

فیلدها:

- `id`
- `type`
- `name`
- `phone`
- `email`
- `company`
- `message`
- `metadata`
- `status`
- `created_at`
- `updated_at`

نوع‌های اولیه:

- `general`
- `customs_clearance`
- `document_request`
- `consultation`

### تنظیمات سایت

جدول:

- `settings`

فیلدها:

- `id`
- `group`
- `key`
- `value`
- `type`
- `locale`
- `created_at`
- `updated_at`

کاربرد:

- شماره تماس
- لینک WhatsApp و Bale
- تنظیمات footer
- مقدارهای SEO عمومی
- تنظیمات social

### کشورها

جدول:

- `countries`

کاربرد:

- داده static کشورها برای dropdownها
- استفاده در World Clock، فرم‌ها، آدرس‌ها و اطلاعات تجاری
- حذف logical با `accuracy = TRASHED`

### شبکه‌های اجتماعی

جدول:

- `social_links`

کاربرد:

- مدیریت لینک‌های Social Media برای Home Page، Footer و Contact
- نمایش فقط برای رکوردهای `ACCEPTED` و `is_published`

## REST API عمومی

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

## REST API ادمین

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

## Scheduler و Jobها

Jobهای اولیه:

- `SyncMarketRatesJob`
- `GenerateSitemapJob`
- `ClearFrontendCacheJob`

نمونه Scheduler:

```php
$schedule->job(new SyncMarketRatesJob())->timezone('Asia/Tehran')->dailyAt('09:00');
$schedule->job(new SyncMarketRatesJob())->timezone('Asia/Tehran')->dailyAt('15:00');
```

## پنل ادمین با Metronic

بخش‌های ادمین:

- Dashboard
- Menu Builder
- Pages
- Services
- Articles
- News
- Categories
- Tags
- Documents
- Media
- Market Rates
- Contact Requests
- Settings
- Users and Roles

نکته:

- قبل از commit کردن assetهای `Metronic` باید لایسنس و فایل‌های اصلی آن در دسترس باشد.
- اگر assetهای Metronic را مستقیم وارد نکنیم، UI را با الهام از سبک آن پیاده می‌کنیم.

## برنامه مهاجرت Frontend به API

1. داده‌های فعلی file-based به عنوان fallback باقی می‌مانند.
2. یک `API Client Layer` در Next.js اضافه می‌شود.
3. منوها از `/api/v1/menus/header` خوانده می‌شوند.
4. خدمات از `/api/v1/services` خوانده می‌شوند.
5. مقاله‌ها و خبرها صفحه به صفحه داینامیک می‌شوند.
6. نرخ ارز از Laravel API خوانده می‌شود.
7. strategy مربوط به cache و revalidate تنظیم می‌شود.

## فازهای اجرا

### فاز ۱: پایه Backend

- ساخت Laravel app در فولدر `backend/`
- تنظیم SQL Server
- تنظیم Docker برای API و SQL Server
- ساخت Auth اولیه
- ساخت migrationهای users، settings و menus

### فاز ۲: Content API

- Pages
- Services
- Articles
- News
- Categories
- Tags
- Media

### فاز ۳: Market Data

- Sources
- Instruments
- Snapshots
- Sync Job
- Public API برای صفحه ارز و برد بازار

### فاز ۴: Admin Panel

- Layout بر اساس Metronic
- CRUD صفحه‌ها
- مدیریت نقش‌ها
- مدیریت فایل‌ها

### فاز ۵: اتصال Frontend

- منوی داینامیک
- خدمات داینامیک
- مقاله و خبر داینامیک
- نرخ ارز داینامیک

### فاز ۶: Deployment

- VPS یا Azure
- Docker Compose production
- Nginx یا Caddy
- SSL برای `khoobrooz.com`
- GitHub Actions deploy بعد از merge به production
