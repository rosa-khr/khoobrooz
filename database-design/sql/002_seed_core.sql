/*
  Khoobrooz core seed data
  Target: SQL Server
*/

USE khoobrooz;
GO

INSERT INTO dbo.roles (name, [key], description, accuracy)
VALUES
  (N'مدیر کل', N'super_admin', N'دسترسی کامل به پنل ادمین', 1),
  (N'مدیر محتوا', N'content_manager', N'مدیریت مقاله، خبر، دسته‌بندی و تگ', 1),
  (N'مدیر بازار', N'market_manager', N'مدیریت نرخ‌ها و ابزارهای بازار', 1);

INSERT INTO dbo.permissions (name, [key], [group], description, accuracy)
VALUES
  (N'مشاهده منوها', N'menus.view', N'menus', N'مشاهده لیست منوها', 1),
  (N'مدیریت منوها', N'menus.manage', N'menus', N'ایجاد و ویرایش منوها', 1),
  (N'مشاهده مقالات', N'articles.view', N'articles', N'مشاهده مقاله‌ها', 1),
  (N'مدیریت مقالات', N'articles.manage', N'articles', N'ایجاد و ویرایش مقاله‌ها', 1),
  (N'تایید مقالات', N'articles.approve', N'articles', N'تایید مقاله برای انتشار', 1),
  (N'مشاهده خبرها', N'news.view', N'news', N'مشاهده خبرها', 1),
  (N'مدیریت خبرها', N'news.manage', N'news', N'ایجاد و ویرایش خبرها', 1),
  (N'تایید خبرها', N'news.approve', N'news', N'تایید خبر برای انتشار', 1),
  (N'مدیریت نرخ بازار', N'market.manage', N'market', N'مدیریت ابزارهای نرخ بازار', 1),
  (N'مدیریت تنظیمات', N'settings.manage', N'settings', N'مدیریت تنظیمات عمومی سایت', 1);

INSERT INTO dbo.countries
  (name_fa, name_en, iso2, iso3, phone_code, capital, currency_code, timezone_default, flag, sort_order, accuracy)
VALUES
  (N'ایران', N'Iran', 'IR', 'IRN', '+98', N'تهران', 'IRR', 'Asia/Tehran', N'🇮🇷', 10, 1),
  (N'امارات متحده عربی', N'United Arab Emirates', 'AE', 'ARE', '+971', N'ابوظبی', 'AED', 'Asia/Dubai', N'🇦🇪', 20, 1),
  (N'چین', N'China', 'CN', 'CHN', '+86', N'پکن', 'CNY', 'Asia/Shanghai', N'🇨🇳', 30, 1),
  (N'ترکیه', N'Turkey', 'TR', 'TUR', '+90', N'آنکارا', 'TRY', 'Europe/Istanbul', N'🇹🇷', 40, 1),
  (N'عراق', N'Iraq', 'IQ', 'IRQ', '+964', N'بغداد', 'IQD', 'Asia/Baghdad', N'🇮🇶', 50, 1),
  (N'روسیه', N'Russia', 'RU', 'RUS', '+7', N'مسکو', 'RUB', 'Europe/Moscow', N'🇷🇺', 60, 1),
  (N'آلمان', N'Germany', 'DE', 'DEU', '+49', N'برلین', 'EUR', 'Europe/Berlin', N'🇩🇪', 70, 1),
  (N'هند', N'India', 'IN', 'IND', '+91', N'دهلی نو', 'INR', 'Asia/Kolkata', N'🇮🇳', 80, 1),
  (N'انگلستان', N'United Kingdom', 'GB', 'GBR', '+44', N'لندن', 'GBP', 'Europe/London', N'🇬🇧', 90, 1),
  (N'ایالات متحده آمریکا', N'United States', 'US', 'USA', '+1', N'واشنگتن', 'USD', 'America/New_York', N'🇺🇸', 100, 1);

INSERT INTO dbo.settings ([group], [key], [value], [type], locale, accuracy)
VALUES
  (N'contact', N'clearance_phone', N'0912 470 1423', N'string', 'fa', 1),
  (N'contact', N'general_phone', N'0910 306 0396', N'string', 'fa', 1),
  (N'contact', N'email', N'info@khoobrooz.com', N'string', 'fa', 1),
  (N'seo', N'default_title', N'خوبروز', N'string', 'fa', 1),
  (N'seo', N'default_description', N'خدمات بازرگانی، ترخیص، آموزش و محتوای تجاری', N'string', 'fa', 1);

INSERT INTO dbo.social_links
  (title, platform, url, icon, username, sort_order, is_published, published_at, accuracy)
VALUES
  (N'واتساپ', N'whatsapp', N'https://wa.me/989124701423', N'whatsapp', N'09124701423', 10, 1, SYSUTCDATETIME(), 1),
  (N'بله', N'bale', N'https://ble.ir/khoobrooz', N'bale', N'khoobrooz', 20, 1, SYSUTCDATETIME(), 1),
  (N'ایمیل', N'email', N'mailto:info@khoobrooz.com', N'email', N'info@khoobrooz.com', 30, 1, SYSUTCDATETIME(), 1);

INSERT INTO dbo.market_rate_sources ([key], name, base_url, is_active, accuracy)
VALUES
  (N'tgju', N'internal_market_rate_source', NULL, 1, 1),
  (N'cbi', N'بانک مرکزی', N'https://www.cbi.ir', 0, 1);

DECLARE @tgju_id BIGINT = (SELECT id FROM dbo.market_rate_sources WHERE [key] = N'tgju');

INSERT INTO dbo.market_rate_instruments
  (source_id, [key], [group], title, symbol, unit, sort_order, is_active, accuracy)
VALUES
  (@tgju_id, N'bourse', N'board', N'بورس', N'TSE', N'واحد', 10, 1, 1),
  (@tgju_id, N'ons', N'metal', N'انس طلا', N'XAU', N'دلار', 20, 1, 1),
  (@tgju_id, N'mesghal', N'metal', N'مثقال طلا', N'MITHQAL', N'ریال', 30, 1, 1),
  (@tgju_id, N'geram18', N'metal', N'طلا', N'18K', N'ریال', 40, 1, 1),
  (@tgju_id, N'sekee', N'coin', N'سکه', N'EMAMI', N'ریال', 50, 1, 1),
  (@tgju_id, N'price_dollar_rl', N'market', N'دلار', N'USD', N'ریال', 60, 1, 1),
  (@tgju_id, N'price_eur', N'market', N'یورو', N'EUR', N'ریال', 70, 1, 1),
  (@tgju_id, N'oil_brent', N'board', N'نفت برنت', N'BRENT', N'دلار', 80, 1, 1),
  (@tgju_id, N'crypto-bitcoin', N'board', N'بیت‌کوین', N'BTC', N'دلار', 90, 1, 1);
