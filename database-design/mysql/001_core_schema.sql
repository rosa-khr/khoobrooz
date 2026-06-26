CREATE DATABASE IF NOT EXISTS khoobrooz
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE khoobrooz;

CREATE TABLE IF NOT EXISTS menus (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(220) NOT NULL,
  url VARCHAR(600) NULL,
  slug VARCHAR(180) NOT NULL,
  parent_id BIGINT UNSIGNED NULL,
  level TINYINT UNSIGNED NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  seo_title VARCHAR(255) NULL,
  seo_description VARCHAR(500) NULL,
  is_published TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT UNSIGNED NULL,
  modified_at TIMESTAMP NULL,
  modified_by BIGINT UNSIGNED NULL,
  accuracy TINYINT UNSIGNED NOT NULL DEFAULT 0,
  CONSTRAINT chk_menus_accuracy CHECK (accuracy IN (0, 1, 2)),
  CONSTRAINT fk_menus_parent FOREIGN KEY (parent_id) REFERENCES menus(id)
);

CREATE TABLE IF NOT EXISTS categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(220) NOT NULL,
  slug VARCHAR(180) NOT NULL,
  parent_id BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT UNSIGNED NULL,
  modified_at TIMESTAMP NULL,
  modified_by BIGINT UNSIGNED NULL,
  accuracy TINYINT UNSIGNED NOT NULL DEFAULT 0,
  CONSTRAINT chk_categories_accuracy CHECK (accuracy IN (0, 1, 2)),
  CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS tags (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT UNSIGNED NULL,
  modified_at TIMESTAMP NULL,
  modified_by BIGINT UNSIGNED NULL,
  accuracy TINYINT UNSIGNED NOT NULL DEFAULT 0,
  CONSTRAINT chk_tags_accuracy CHECK (accuracy IN (0, 1, 2))
);

CREATE TABLE IF NOT EXISTS services (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  locale VARCHAR(10) NOT NULL DEFAULT 'fa',
  slug VARCHAR(180) NOT NULL,
  title VARCHAR(220) NOT NULL,
  short_title VARCHAR(120) NULL,
  summary VARCHAR(800) NULL,
  body LONGTEXT NULL,
  icon VARCHAR(150) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  seo_title VARCHAR(255) NULL,
  seo_description VARCHAR(500) NULL,
  is_published TINYINT(1) NOT NULL DEFAULT 0,
  published_at TIMESTAMP NULL,
  published_by BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT UNSIGNED NULL,
  modified_at TIMESTAMP NULL,
  modified_by BIGINT UNSIGNED NULL,
  accuracy TINYINT UNSIGNED NOT NULL DEFAULT 0,
  UNIQUE KEY uq_services_locale_slug (locale, slug),
  CONSTRAINT chk_services_accuracy CHECK (accuracy IN (0, 1, 2))
);

CREATE TABLE IF NOT EXISTS articles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id BIGINT UNSIGNED NULL,
  locale VARCHAR(10) NOT NULL DEFAULT 'fa',
  title VARCHAR(240) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  excerpt VARCHAR(900) NULL,
  body LONGTEXT NULL,
  seo_title VARCHAR(255) NULL,
  seo_description VARCHAR(500) NULL,
  approve TINYINT(1) NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 0,
  published_at TIMESTAMP NULL,
  published_by BIGINT UNSIGNED NULL,
  scheduled_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT UNSIGNED NULL,
  modified_at TIMESTAMP NULL,
  modified_by BIGINT UNSIGNED NULL,
  accuracy TINYINT UNSIGNED NOT NULL DEFAULT 0,
  UNIQUE KEY uq_articles_locale_slug (locale, slug),
  CONSTRAINT fk_articles_category FOREIGN KEY (category_id) REFERENCES categories(id),
  CONSTRAINT chk_articles_accuracy CHECK (accuracy IN (0, 1, 2))
);

CREATE TABLE IF NOT EXISTS article_tag (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  article_id BIGINT UNSIGNED NOT NULL,
  tag_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT UNSIGNED NULL,
  modified_at TIMESTAMP NULL,
  modified_by BIGINT UNSIGNED NULL,
  accuracy TINYINT UNSIGNED NOT NULL DEFAULT 1,
  UNIQUE KEY uq_article_tag (article_id, tag_id),
  CONSTRAINT fk_article_tag_article FOREIGN KEY (article_id) REFERENCES articles(id),
  CONSTRAINT fk_article_tag_tag FOREIGN KEY (tag_id) REFERENCES tags(id),
  CONSTRAINT chk_article_tag_accuracy CHECK (accuracy IN (0, 1, 2))
);

CREATE TABLE IF NOT EXISTS news (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id BIGINT UNSIGNED NULL,
  locale VARCHAR(10) NOT NULL DEFAULT 'fa',
  title VARCHAR(240) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  summary VARCHAR(900) NULL,
  body LONGTEXT NULL,
  seo_title VARCHAR(255) NULL,
  seo_description VARCHAR(500) NULL,
  approve TINYINT(1) NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 0,
  published_at TIMESTAMP NULL,
  published_by BIGINT UNSIGNED NULL,
  scheduled_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT UNSIGNED NULL,
  modified_at TIMESTAMP NULL,
  modified_by BIGINT UNSIGNED NULL,
  accuracy TINYINT UNSIGNED NOT NULL DEFAULT 0,
  UNIQUE KEY uq_news_locale_slug (locale, slug),
  CONSTRAINT fk_news_category FOREIGN KEY (category_id) REFERENCES categories(id),
  CONSTRAINT chk_news_accuracy CHECK (accuracy IN (0, 1, 2))
);

CREATE TABLE IF NOT EXISTS news_tag (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  news_id BIGINT UNSIGNED NOT NULL,
  tag_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT UNSIGNED NULL,
  modified_at TIMESTAMP NULL,
  modified_by BIGINT UNSIGNED NULL,
  accuracy TINYINT UNSIGNED NOT NULL DEFAULT 1,
  UNIQUE KEY uq_news_tag (news_id, tag_id),
  CONSTRAINT fk_news_tag_news FOREIGN KEY (news_id) REFERENCES news(id),
  CONSTRAINT fk_news_tag_tag FOREIGN KEY (tag_id) REFERENCES tags(id),
  CONSTRAINT chk_news_tag_accuracy CHECK (accuracy IN (0, 1, 2))
);

CREATE TABLE IF NOT EXISTS countries (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name_fa VARCHAR(160) NOT NULL,
  name_en VARCHAR(160) NOT NULL,
  iso2 CHAR(2) NOT NULL UNIQUE,
  iso3 CHAR(3) NOT NULL UNIQUE,
  phone_code VARCHAR(12) NULL,
  capital VARCHAR(160) NULL,
  continent VARCHAR(80) NULL,
  currency_code CHAR(3) NULL,
  timezone_default VARCHAR(120) NULL,
  flag VARCHAR(20) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT UNSIGNED NULL,
  modified_at TIMESTAMP NULL,
  modified_by BIGINT UNSIGNED NULL,
  accuracy TINYINT UNSIGNED NOT NULL DEFAULT 1,
  CONSTRAINT chk_countries_accuracy CHECK (accuracy IN (0, 1, 2))
);

CREATE TABLE IF NOT EXISTS world_clock_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  country_id BIGINT UNSIGNED NULL,
  city VARCHAR(160) NOT NULL,
  country VARCHAR(160) NOT NULL,
  country_code CHAR(2) NULL,
  timezone VARCHAR(120) NOT NULL,
  market_label VARCHAR(180) NULL,
  flag VARCHAR(20) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 0,
  published_at TIMESTAMP NULL,
  published_by BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT UNSIGNED NULL,
  modified_at TIMESTAMP NULL,
  modified_by BIGINT UNSIGNED NULL,
  accuracy TINYINT UNSIGNED NOT NULL DEFAULT 0,
  CONSTRAINT fk_world_clock_country FOREIGN KEY (country_id) REFERENCES countries(id),
  CONSTRAINT chk_world_clock_accuracy CHECK (accuracy IN (0, 1, 2))
);
