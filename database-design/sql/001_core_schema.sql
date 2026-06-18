/*
  Khoobrooz core database schema
  Target: SQL Server

  Notes:
  - Logical delete is handled with accuracy = 2.
  - Shared status values:
      PENDING  = 0
      ACCEPTED = 1
      TRASHED  = 2
  - This SQL design will later be translated into Laravel migrations.
*/

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET ANSI_PADDING ON;
SET ANSI_WARNINGS ON;
SET CONCAT_NULL_YIELDS_NULL ON;
SET ARITHABORT ON;
SET NUMERIC_ROUNDABORT OFF;
GO

IF DB_ID(N'khoobrooz') IS NULL
BEGIN
    CREATE DATABASE khoobrooz;
END
GO

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

CREATE TABLE dbo.users (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    email NVARCHAR(190) NULL,
    phone NVARCHAR(30) NULL,
    password NVARCHAR(255) NOT NULL,
    email_verified_at DATETIME2 NULL,
    phone_verified_at DATETIME2 NULL,
    last_login_at DATETIME2 NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_users_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_users_accuracy DEFAULT 0,
    CONSTRAINT CK_users_accuracy CHECK (accuracy IN (0, 1, 2))
);

CREATE TABLE dbo.roles (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    name NVARCHAR(120) NOT NULL,
    [key] NVARCHAR(120) NOT NULL,
    description NVARCHAR(500) NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_roles_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_roles_accuracy DEFAULT 0,
    CONSTRAINT CK_roles_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT UQ_roles_key UNIQUE ([key])
);

CREATE TABLE dbo.permissions (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    [key] NVARCHAR(150) NOT NULL,
    [group] NVARCHAR(100) NOT NULL,
    description NVARCHAR(500) NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_permissions_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_permissions_accuracy DEFAULT 0,
    CONSTRAINT CK_permissions_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT UQ_permissions_key UNIQUE ([key])
);

CREATE TABLE dbo.role_user (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    role_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_role_user_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_role_user_accuracy DEFAULT 1,
    CONSTRAINT CK_role_user_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT FK_role_user_role FOREIGN KEY (role_id) REFERENCES dbo.roles(id),
    CONSTRAINT FK_role_user_user FOREIGN KEY (user_id) REFERENCES dbo.users(id),
    CONSTRAINT UQ_role_user UNIQUE (role_id, user_id)
);

CREATE TABLE dbo.permission_role (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    permission_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_permission_role_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_permission_role_accuracy DEFAULT 1,
    CONSTRAINT CK_permission_role_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT FK_permission_role_permission FOREIGN KEY (permission_id) REFERENCES dbo.permissions(id),
    CONSTRAINT FK_permission_role_role FOREIGN KEY (role_id) REFERENCES dbo.roles(id),
    CONSTRAINT UQ_permission_role UNIQUE (permission_id, role_id)
);

CREATE TABLE dbo.media_files (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    disk NVARCHAR(80) NOT NULL,
    [path] NVARCHAR(600) NOT NULL,
    mime_type NVARCHAR(150) NULL,
    size_bytes BIGINT NULL,
    alt NVARCHAR(255) NULL,
    caption NVARCHAR(500) NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_media_files_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_media_files_accuracy DEFAULT 0,
    CONSTRAINT CK_media_files_accuracy CHECK (accuracy IN (0, 1, 2))
);

CREATE TABLE dbo.countries (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    name_fa NVARCHAR(160) NOT NULL,
    name_en NVARCHAR(160) NOT NULL,
    iso2 CHAR(2) NOT NULL,
    iso3 CHAR(3) NOT NULL,
    phone_code NVARCHAR(12) NULL,
    capital NVARCHAR(160) NULL,
    currency_code CHAR(3) NULL,
    timezone_default NVARCHAR(120) NULL,
    flag NVARCHAR(20) NULL,
    sort_order INT NOT NULL CONSTRAINT DF_countries_sort_order DEFAULT 0,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_countries_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_countries_accuracy DEFAULT 1,
    CONSTRAINT CK_countries_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT UQ_countries_iso2 UNIQUE (iso2),
    CONSTRAINT UQ_countries_iso3 UNIQUE (iso3)
);

CREATE TABLE dbo.settings (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [group] NVARCHAR(100) NOT NULL,
    [key] NVARCHAR(150) NOT NULL,
    [value] NVARCHAR(MAX) NULL,
    [type] NVARCHAR(50) NOT NULL CONSTRAINT DF_settings_type DEFAULT 'string',
    locale NVARCHAR(10) NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_settings_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_settings_accuracy DEFAULT 1,
    CONSTRAINT CK_settings_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT UQ_settings_key_locale UNIQUE ([group], [key], locale)
);

CREATE TABLE dbo.social_links (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    title NVARCHAR(120) NOT NULL,
    platform NVARCHAR(80) NOT NULL,
    url NVARCHAR(600) NOT NULL,
    icon NVARCHAR(150) NULL,
    username NVARCHAR(150) NULL,
    sort_order INT NOT NULL CONSTRAINT DF_social_links_sort_order DEFAULT 0,
    is_published BIT NOT NULL CONSTRAINT DF_social_links_is_published DEFAULT 0,
    published_at DATETIME2 NULL,
    published_by BIGINT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_social_links_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_social_links_accuracy DEFAULT 0,
    CONSTRAINT CK_social_links_accuracy CHECK (accuracy IN (0, 1, 2))
);

CREATE TABLE dbo.menus (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    parent_id BIGINT NULL,
    title NVARCHAR(160) NOT NULL,
    url NVARCHAR(600) NULL,
    slug NVARCHAR(180) NULL,
    seo_title NVARCHAR(255) NULL,
    seo_description NVARCHAR(500) NULL,
    canonical_url NVARCHAR(600) NULL,
    og_title NVARCHAR(255) NULL,
    og_description NVARCHAR(500) NULL,
    og_image_id BIGINT NULL,
    robots NVARCHAR(80) NULL,
    structured_data NVARCHAR(MAX) NULL,
    icon NVARCHAR(150) NULL,
    target NVARCHAR(30) NULL,
    sort_order INT NOT NULL CONSTRAINT DF_menus_sort_order DEFAULT 0,
    [level] TINYINT NOT NULL CONSTRAINT DF_menus_level DEFAULT 1,
    locale NVARCHAR(10) NOT NULL CONSTRAINT DF_menus_locale DEFAULT 'fa',
    is_published BIT NOT NULL CONSTRAINT DF_menus_is_published DEFAULT 0,
    published_at DATETIME2 NULL,
    published_by BIGINT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_menus_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_menus_accuracy DEFAULT 0,
    CONSTRAINT CK_menus_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT CK_menus_level CHECK ([level] BETWEEN 1 AND 3),
    CONSTRAINT FK_menus_parent FOREIGN KEY (parent_id) REFERENCES dbo.menus(id),
    CONSTRAINT FK_menus_og_image FOREIGN KEY (og_image_id) REFERENCES dbo.media_files(id)
);

CREATE TABLE dbo.categories (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    parent_id BIGINT NULL,
    [type] NVARCHAR(60) NOT NULL,
    locale NVARCHAR(10) NOT NULL CONSTRAINT DF_categories_locale DEFAULT 'fa',
    title NVARCHAR(160) NOT NULL,
    slug NVARCHAR(180) NOT NULL,
    seo_title NVARCHAR(255) NULL,
    seo_description NVARCHAR(500) NULL,
    canonical_url NVARCHAR(600) NULL,
    og_title NVARCHAR(255) NULL,
    og_description NVARCHAR(500) NULL,
    og_image_id BIGINT NULL,
    robots NVARCHAR(80) NULL,
    structured_data NVARCHAR(MAX) NULL,
    sort_order INT NOT NULL CONSTRAINT DF_categories_sort_order DEFAULT 0,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_categories_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_categories_accuracy DEFAULT 0,
    CONSTRAINT CK_categories_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT FK_categories_parent FOREIGN KEY (parent_id) REFERENCES dbo.categories(id),
    CONSTRAINT FK_categories_og_image FOREIGN KEY (og_image_id) REFERENCES dbo.media_files(id),
    CONSTRAINT UQ_categories_locale_slug UNIQUE (locale, slug)
);

CREATE TABLE dbo.tags (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    title NVARCHAR(160) NOT NULL,
    slug NVARCHAR(180) NOT NULL,
    seo_title NVARCHAR(255) NULL,
    seo_description NVARCHAR(500) NULL,
    canonical_url NVARCHAR(600) NULL,
    og_title NVARCHAR(255) NULL,
    og_description NVARCHAR(500) NULL,
    og_image_id BIGINT NULL,
    robots NVARCHAR(80) NULL,
    structured_data NVARCHAR(MAX) NULL,
    locale NVARCHAR(10) NOT NULL CONSTRAINT DF_tags_locale DEFAULT 'fa',
    created_at DATETIME2 NOT NULL CONSTRAINT DF_tags_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_tags_accuracy DEFAULT 0,
    CONSTRAINT CK_tags_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT FK_tags_og_image FOREIGN KEY (og_image_id) REFERENCES dbo.media_files(id),
    CONSTRAINT UQ_tags_locale_slug UNIQUE (locale, slug)
);

CREATE TABLE dbo.pages (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    locale NVARCHAR(10) NOT NULL CONSTRAINT DF_pages_locale DEFAULT 'fa',
    slug NVARCHAR(180) NOT NULL,
    title NVARCHAR(220) NOT NULL,
    summary NVARCHAR(800) NULL,
    body NVARCHAR(MAX) NULL,
    seo_title NVARCHAR(255) NULL,
    seo_description NVARCHAR(500) NULL,
    canonical_url NVARCHAR(600) NULL,
    og_title NVARCHAR(255) NULL,
    og_description NVARCHAR(500) NULL,
    og_image_id BIGINT NULL,
    robots NVARCHAR(80) NULL,
    structured_data NVARCHAR(MAX) NULL,
    is_published BIT NOT NULL CONSTRAINT DF_pages_is_published DEFAULT 0,
    published_at DATETIME2 NULL,
    published_by BIGINT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_pages_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_pages_accuracy DEFAULT 0,
    CONSTRAINT CK_pages_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT FK_pages_og_image FOREIGN KEY (og_image_id) REFERENCES dbo.media_files(id),
    CONSTRAINT UQ_pages_locale_slug UNIQUE (locale, slug)
);

CREATE TABLE dbo.services (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    locale NVARCHAR(10) NOT NULL CONSTRAINT DF_services_locale DEFAULT 'fa',
    slug NVARCHAR(180) NOT NULL,
    title NVARCHAR(220) NOT NULL,
    short_title NVARCHAR(120) NULL,
    summary NVARCHAR(800) NULL,
    body NVARCHAR(MAX) NULL,
    icon NVARCHAR(150) NULL,
    sort_order INT NOT NULL CONSTRAINT DF_services_sort_order DEFAULT 0,
    is_featured BIT NOT NULL CONSTRAINT DF_services_is_featured DEFAULT 0,
    seo_title NVARCHAR(255) NULL,
    seo_description NVARCHAR(500) NULL,
    canonical_url NVARCHAR(600) NULL,
    og_title NVARCHAR(255) NULL,
    og_description NVARCHAR(500) NULL,
    og_image_id BIGINT NULL,
    robots NVARCHAR(80) NULL,
    structured_data NVARCHAR(MAX) NULL,
    is_published BIT NOT NULL CONSTRAINT DF_services_is_published DEFAULT 0,
    published_at DATETIME2 NULL,
    published_by BIGINT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_services_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_services_accuracy DEFAULT 0,
    CONSTRAINT CK_services_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT FK_services_og_image FOREIGN KEY (og_image_id) REFERENCES dbo.media_files(id),
    CONSTRAINT UQ_services_locale_slug UNIQUE (locale, slug)
);

CREATE TABLE dbo.articles (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    category_id BIGINT NULL,
    locale NVARCHAR(10) NOT NULL CONSTRAINT DF_articles_locale DEFAULT 'fa',
    title NVARCHAR(240) NOT NULL,
    slug NVARCHAR(200) NOT NULL,
    excerpt NVARCHAR(900) NULL,
    body NVARCHAR(MAX) NULL,
    cover_image_id BIGINT NULL,
    seo_title NVARCHAR(255) NULL,
    seo_description NVARCHAR(500) NULL,
    canonical_url NVARCHAR(600) NULL,
    og_title NVARCHAR(255) NULL,
    og_description NVARCHAR(500) NULL,
    og_image_id BIGINT NULL,
    robots NVARCHAR(80) NULL,
    structured_data NVARCHAR(MAX) NULL,
    approve BIT NOT NULL CONSTRAINT DF_articles_approve DEFAULT 0,
    approved_at DATETIME2 NULL,
    approved_by BIGINT NULL,
    is_published BIT NOT NULL CONSTRAINT DF_articles_is_published DEFAULT 0,
    published_at DATETIME2 NULL,
    published_by BIGINT NULL,
    scheduled_at DATETIME2 NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_articles_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_articles_accuracy DEFAULT 0,
    CONSTRAINT CK_articles_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT FK_articles_category FOREIGN KEY (category_id) REFERENCES dbo.categories(id),
    CONSTRAINT FK_articles_cover_image FOREIGN KEY (cover_image_id) REFERENCES dbo.media_files(id),
    CONSTRAINT FK_articles_og_image FOREIGN KEY (og_image_id) REFERENCES dbo.media_files(id),
    CONSTRAINT UQ_articles_locale_slug UNIQUE (locale, slug)
);

CREATE TABLE dbo.article_tag (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    article_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_article_tag_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_article_tag_accuracy DEFAULT 1,
    CONSTRAINT CK_article_tag_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT FK_article_tag_article FOREIGN KEY (article_id) REFERENCES dbo.articles(id),
    CONSTRAINT FK_article_tag_tag FOREIGN KEY (tag_id) REFERENCES dbo.tags(id),
    CONSTRAINT UQ_article_tag UNIQUE (article_id, tag_id)
);

CREATE TABLE dbo.news (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    category_id BIGINT NULL,
    locale NVARCHAR(10) NOT NULL CONSTRAINT DF_news_locale DEFAULT 'fa',
    title NVARCHAR(240) NOT NULL,
    slug NVARCHAR(200) NOT NULL,
    summary NVARCHAR(900) NULL,
    body NVARCHAR(MAX) NULL,
    source_name NVARCHAR(180) NULL,
    source_url NVARCHAR(600) NULL,
    news_date DATETIME2 NULL,
    cover_image_id BIGINT NULL,
    seo_title NVARCHAR(255) NULL,
    seo_description NVARCHAR(500) NULL,
    canonical_url NVARCHAR(600) NULL,
    og_title NVARCHAR(255) NULL,
    og_description NVARCHAR(500) NULL,
    og_image_id BIGINT NULL,
    robots NVARCHAR(80) NULL,
    structured_data NVARCHAR(MAX) NULL,
    approve BIT NOT NULL CONSTRAINT DF_news_approve DEFAULT 0,
    approved_at DATETIME2 NULL,
    approved_by BIGINT NULL,
    is_published BIT NOT NULL CONSTRAINT DF_news_is_published DEFAULT 0,
    published_at DATETIME2 NULL,
    published_by BIGINT NULL,
    scheduled_at DATETIME2 NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_news_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_news_accuracy DEFAULT 0,
    CONSTRAINT CK_news_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT FK_news_category FOREIGN KEY (category_id) REFERENCES dbo.categories(id),
    CONSTRAINT FK_news_cover_image FOREIGN KEY (cover_image_id) REFERENCES dbo.media_files(id),
    CONSTRAINT FK_news_og_image FOREIGN KEY (og_image_id) REFERENCES dbo.media_files(id),
    CONSTRAINT UQ_news_locale_slug UNIQUE (locale, slug)
);

CREATE TABLE dbo.news_tag (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    news_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_news_tag_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_news_tag_accuracy DEFAULT 1,
    CONSTRAINT CK_news_tag_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT FK_news_tag_news FOREIGN KEY (news_id) REFERENCES dbo.news(id),
    CONSTRAINT FK_news_tag_tag FOREIGN KEY (tag_id) REFERENCES dbo.tags(id),
    CONSTRAINT UQ_news_tag UNIQUE (news_id, tag_id)
);

CREATE TABLE dbo.documents (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    locale NVARCHAR(10) NOT NULL CONSTRAINT DF_documents_locale DEFAULT 'fa',
    slug NVARCHAR(180) NOT NULL,
    title NVARCHAR(220) NOT NULL,
    description NVARCHAR(900) NULL,
    file_id BIGINT NULL,
    price DECIMAL(18,2) NOT NULL CONSTRAINT DF_documents_price DEFAULT 0,
    is_free BIT NOT NULL CONSTRAINT DF_documents_is_free DEFAULT 1,
    seo_title NVARCHAR(255) NULL,
    seo_description NVARCHAR(500) NULL,
    canonical_url NVARCHAR(600) NULL,
    og_title NVARCHAR(255) NULL,
    og_description NVARCHAR(500) NULL,
    og_image_id BIGINT NULL,
    robots NVARCHAR(80) NULL,
    structured_data NVARCHAR(MAX) NULL,
    is_published BIT NOT NULL CONSTRAINT DF_documents_is_published DEFAULT 0,
    published_at DATETIME2 NULL,
    published_by BIGINT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_documents_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_documents_accuracy DEFAULT 0,
    CONSTRAINT CK_documents_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT FK_documents_file FOREIGN KEY (file_id) REFERENCES dbo.media_files(id),
    CONSTRAINT FK_documents_og_image FOREIGN KEY (og_image_id) REFERENCES dbo.media_files(id),
    CONSTRAINT UQ_documents_locale_slug UNIQUE (locale, slug)
);

CREATE TABLE dbo.home_sections (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    section_key NVARCHAR(120) NOT NULL,
    title NVARCHAR(220) NULL,
    subtitle NVARCHAR(220) NULL,
    description NVARCHAR(900) NULL,
    layout_type NVARCHAR(80) NULL,
    sort_order INT NOT NULL CONSTRAINT DF_home_sections_sort_order DEFAULT 0,
    locale NVARCHAR(10) NOT NULL CONSTRAINT DF_home_sections_locale DEFAULT 'fa',
    is_published BIT NOT NULL CONSTRAINT DF_home_sections_is_published DEFAULT 0,
    published_at DATETIME2 NULL,
    published_by BIGINT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_home_sections_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_home_sections_accuracy DEFAULT 0,
    CONSTRAINT CK_home_sections_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT UQ_home_sections_locale_key UNIQUE (locale, section_key)
);

CREATE TABLE dbo.home_section_items (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    section_id BIGINT NOT NULL,
    title NVARCHAR(220) NULL,
    subtitle NVARCHAR(220) NULL,
    description NVARCHAR(900) NULL,
    url NVARCHAR(600) NULL,
    image_id BIGINT NULL,
    icon NVARCHAR(150) NULL,
    metadata NVARCHAR(MAX) NULL,
    sort_order INT NOT NULL CONSTRAINT DF_home_section_items_sort_order DEFAULT 0,
    is_published BIT NOT NULL CONSTRAINT DF_home_section_items_is_published DEFAULT 0,
    published_at DATETIME2 NULL,
    published_by BIGINT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_home_section_items_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_home_section_items_accuracy DEFAULT 0,
    CONSTRAINT CK_home_section_items_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT FK_home_section_items_section FOREIGN KEY (section_id) REFERENCES dbo.home_sections(id),
    CONSTRAINT FK_home_section_items_image FOREIGN KEY (image_id) REFERENCES dbo.media_files(id)
);

CREATE TABLE dbo.world_clock_items (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    country_id BIGINT NULL,
    city NVARCHAR(160) NOT NULL,
    country NVARCHAR(160) NOT NULL,
    country_code CHAR(2) NULL,
    timezone NVARCHAR(120) NOT NULL,
    market_label NVARCHAR(180) NULL,
    flag NVARCHAR(20) NULL,
    sort_order INT NOT NULL CONSTRAINT DF_world_clock_items_sort_order DEFAULT 0,
    is_published BIT NOT NULL CONSTRAINT DF_world_clock_items_is_published DEFAULT 0,
    published_at DATETIME2 NULL,
    published_by BIGINT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_world_clock_items_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_world_clock_items_accuracy DEFAULT 0,
    CONSTRAINT CK_world_clock_items_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT FK_world_clock_items_country FOREIGN KEY (country_id) REFERENCES dbo.countries(id)
);

CREATE TABLE dbo.important_links (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    title NVARCHAR(180) NOT NULL,
    url NVARCHAR(600) NOT NULL,
    description NVARCHAR(800) NULL,
    category_id BIGINT NULL,
    icon NVARCHAR(150) NULL,
    target NVARCHAR(30) NULL,
    rel NVARCHAR(120) NULL,
    sort_order INT NOT NULL CONSTRAINT DF_important_links_sort_order DEFAULT 0,
    is_published BIT NOT NULL CONSTRAINT DF_important_links_is_published DEFAULT 0,
    published_at DATETIME2 NULL,
    published_by BIGINT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_important_links_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_important_links_accuracy DEFAULT 0,
    CONSTRAINT CK_important_links_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT FK_important_links_category FOREIGN KEY (category_id) REFERENCES dbo.categories(id)
);

CREATE TABLE dbo.market_rate_sources (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [key] NVARCHAR(120) NOT NULL,
    name NVARCHAR(180) NOT NULL,
    base_url NVARCHAR(800) NULL,
    is_active BIT NOT NULL CONSTRAINT DF_market_rate_sources_is_active DEFAULT 1,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_market_rate_sources_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_market_rate_sources_accuracy DEFAULT 1,
    CONSTRAINT CK_market_rate_sources_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT UQ_market_rate_sources_key UNIQUE ([key])
);

CREATE TABLE dbo.market_rate_instruments (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    source_id BIGINT NOT NULL,
    [key] NVARCHAR(160) NOT NULL,
    [group] NVARCHAR(80) NOT NULL,
    title NVARCHAR(180) NOT NULL,
    symbol NVARCHAR(40) NULL,
    unit NVARCHAR(40) NULL,
    sort_order INT NOT NULL CONSTRAINT DF_market_rate_instruments_sort_order DEFAULT 0,
    is_active BIT NOT NULL CONSTRAINT DF_market_rate_instruments_is_active DEFAULT 1,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_market_rate_instruments_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_market_rate_instruments_accuracy DEFAULT 1,
    CONSTRAINT CK_market_rate_instruments_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT FK_market_rate_instruments_source FOREIGN KEY (source_id) REFERENCES dbo.market_rate_sources(id),
    CONSTRAINT UQ_market_rate_instruments_source_key UNIQUE (source_id, [key])
);

CREATE TABLE dbo.market_rate_snapshots (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    instrument_id BIGINT NOT NULL,
    price NVARCHAR(80) NULL,
    high NVARCHAR(80) NULL,
    low NVARCHAR(80) NULL,
    change_value NVARCHAR(80) NULL,
    change_percent DECIMAL(10,4) NULL,
    direction NVARCHAR(20) NULL,
    source_updated_at DATETIME2 NULL,
    fetched_at DATETIME2 NOT NULL CONSTRAINT DF_market_rate_snapshots_fetched_at DEFAULT SYSUTCDATETIME(),
    created_at DATETIME2 NOT NULL CONSTRAINT DF_market_rate_snapshots_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_market_rate_snapshots_accuracy DEFAULT 1,
    CONSTRAINT CK_market_rate_snapshots_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT FK_market_rate_snapshots_instrument FOREIGN KEY (instrument_id) REFERENCES dbo.market_rate_instruments(id)
);

CREATE TABLE dbo.market_rate_sync_logs (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    source_id BIGINT NOT NULL,
    status NVARCHAR(40) NOT NULL,
    message NVARCHAR(MAX) NULL,
    started_at DATETIME2 NOT NULL,
    finished_at DATETIME2 NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_market_rate_sync_logs_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_market_rate_sync_logs_accuracy DEFAULT 1,
    CONSTRAINT CK_market_rate_sync_logs_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT FK_market_rate_sync_logs_source FOREIGN KEY (source_id) REFERENCES dbo.market_rate_sources(id)
);

CREATE TABLE dbo.contact_requests (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [type] NVARCHAR(80) NOT NULL,
    name NVARCHAR(160) NULL,
    phone NVARCHAR(40) NULL,
    email NVARCHAR(190) NULL,
    company NVARCHAR(180) NULL,
    message NVARCHAR(MAX) NULL,
    metadata NVARCHAR(MAX) NULL,
    status NVARCHAR(60) NOT NULL CONSTRAINT DF_contact_requests_status DEFAULT 'new',
    created_at DATETIME2 NOT NULL CONSTRAINT DF_contact_requests_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_contact_requests_accuracy DEFAULT 0,
    CONSTRAINT CK_contact_requests_accuracy CHECK (accuracy IN (0, 1, 2))
);

CREATE TABLE dbo.products (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    locale NVARCHAR(10) NOT NULL CONSTRAINT DF_products_locale DEFAULT 'fa',
    slug NVARCHAR(180) NOT NULL,
    title NVARCHAR(220) NOT NULL,
    description NVARCHAR(MAX) NULL,
    price DECIMAL(18,2) NOT NULL CONSTRAINT DF_products_price DEFAULT 0,
    product_type NVARCHAR(60) NOT NULL CONSTRAINT DF_products_type DEFAULT 'file',
    is_published BIT NOT NULL CONSTRAINT DF_products_is_published DEFAULT 0,
    published_at DATETIME2 NULL,
    published_by BIGINT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_products_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_products_accuracy DEFAULT 0,
    CONSTRAINT CK_products_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT UQ_products_locale_slug UNIQUE (locale, slug)
);

CREATE TABLE dbo.product_files (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    file_id BIGINT NOT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_product_files_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_product_files_accuracy DEFAULT 1,
    CONSTRAINT CK_product_files_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT FK_product_files_product FOREIGN KEY (product_id) REFERENCES dbo.products(id),
    CONSTRAINT FK_product_files_file FOREIGN KEY (file_id) REFERENCES dbo.media_files(id)
);

CREATE TABLE dbo.carts (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    user_id BIGINT NULL,
    session_id NVARCHAR(160) NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_carts_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_carts_accuracy DEFAULT 1,
    CONSTRAINT CK_carts_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT FK_carts_user FOREIGN KEY (user_id) REFERENCES dbo.users(id)
);

CREATE TABLE dbo.cart_items (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL CONSTRAINT DF_cart_items_quantity DEFAULT 1,
    unit_price DECIMAL(18,2) NOT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_cart_items_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_cart_items_accuracy DEFAULT 1,
    CONSTRAINT CK_cart_items_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT FK_cart_items_cart FOREIGN KEY (cart_id) REFERENCES dbo.carts(id),
    CONSTRAINT FK_cart_items_product FOREIGN KEY (product_id) REFERENCES dbo.products(id)
);

CREATE TABLE dbo.orders (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    user_id BIGINT NULL,
    order_number NVARCHAR(80) NOT NULL,
    status NVARCHAR(60) NOT NULL CONSTRAINT DF_orders_status DEFAULT 'pending',
    total_amount DECIMAL(18,2) NOT NULL CONSTRAINT DF_orders_total_amount DEFAULT 0,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_orders_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_orders_accuracy DEFAULT 1,
    CONSTRAINT CK_orders_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT FK_orders_user FOREIGN KEY (user_id) REFERENCES dbo.users(id),
    CONSTRAINT UQ_orders_order_number UNIQUE (order_number)
);

CREATE TABLE dbo.order_items (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    title NVARCHAR(220) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(18,2) NOT NULL,
    total_price DECIMAL(18,2) NOT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_order_items_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_order_items_accuracy DEFAULT 1,
    CONSTRAINT CK_order_items_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT FK_order_items_order FOREIGN KEY (order_id) REFERENCES dbo.orders(id),
    CONSTRAINT FK_order_items_product FOREIGN KEY (product_id) REFERENCES dbo.products(id)
);

CREATE TABLE dbo.payments (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    provider NVARCHAR(80) NOT NULL,
    authority NVARCHAR(160) NULL,
    reference_id NVARCHAR(160) NULL,
    amount DECIMAL(18,2) NOT NULL,
    status NVARCHAR(60) NOT NULL CONSTRAINT DF_payments_status DEFAULT 'pending',
    paid_at DATETIME2 NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_payments_created_at DEFAULT SYSUTCDATETIME(),
    created_by BIGINT NULL,
    modified_at DATETIME2 NULL,
    modified_by BIGINT NULL,
    accuracy TINYINT NOT NULL CONSTRAINT DF_payments_accuracy DEFAULT 1,
    CONSTRAINT CK_payments_accuracy CHECK (accuracy IN (0, 1, 2)),
    CONSTRAINT FK_payments_order FOREIGN KEY (order_id) REFERENCES dbo.orders(id)
);

CREATE INDEX IX_menus_parent_sort ON dbo.menus(parent_id, sort_order) WHERE accuracy <> 2;
CREATE UNIQUE INDEX UX_users_email_not_null ON dbo.users(email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX UX_users_phone_not_null ON dbo.users(phone) WHERE phone IS NOT NULL;
CREATE INDEX IX_articles_public ON dbo.articles(locale, is_published, approve, published_at) WHERE accuracy = 1;
CREATE INDEX IX_news_public ON dbo.news(locale, is_published, approve, published_at) WHERE accuracy = 1;
CREATE INDEX IX_market_snapshots_instrument_time ON dbo.market_rate_snapshots(instrument_id, fetched_at DESC);
CREATE INDEX IX_home_sections_public ON dbo.home_sections(locale, is_published, sort_order) WHERE accuracy = 1;
