USE khoobrooz;
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET ANSI_PADDING ON;
SET ANSI_WARNINGS ON;
SET CONCAT_NULL_YIELDS_NULL ON;
SET ARITHABORT ON;
SET NUMERIC_ROUNDABORT OFF;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_menus_parent_sort' AND object_id = OBJECT_ID(N'dbo.menus'))
    CREATE INDEX IX_menus_parent_sort ON dbo.menus(parent_id, sort_order) WHERE accuracy <> 2;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_users_email_not_null' AND object_id = OBJECT_ID(N'dbo.users'))
    CREATE UNIQUE INDEX UX_users_email_not_null ON dbo.users(email) WHERE email IS NOT NULL;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_users_phone_not_null' AND object_id = OBJECT_ID(N'dbo.users'))
    CREATE UNIQUE INDEX UX_users_phone_not_null ON dbo.users(phone) WHERE phone IS NOT NULL;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_articles_public' AND object_id = OBJECT_ID(N'dbo.articles'))
    CREATE INDEX IX_articles_public ON dbo.articles(locale, is_published, approve, published_at) WHERE accuracy = 1;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_news_public' AND object_id = OBJECT_ID(N'dbo.news'))
    CREATE INDEX IX_news_public ON dbo.news(locale, is_published, approve, published_at) WHERE accuracy = 1;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_market_snapshots_instrument_time' AND object_id = OBJECT_ID(N'dbo.market_rate_snapshots'))
    CREATE INDEX IX_market_snapshots_instrument_time ON dbo.market_rate_snapshots(instrument_id, fetched_at DESC);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_home_sections_public' AND object_id = OBJECT_ID(N'dbo.home_sections'))
    CREATE INDEX IX_home_sections_public ON dbo.home_sections(locale, is_published, sort_order) WHERE accuracy = 1;
