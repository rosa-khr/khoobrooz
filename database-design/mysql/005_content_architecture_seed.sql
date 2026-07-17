SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
USE khoobrooz;

DROP PROCEDURE IF EXISTS add_category_column_if_missing;
DELIMITER //
CREATE PROCEDURE add_category_column_if_missing(IN p_column_name VARCHAR(64), IN alter_sql TEXT)
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'categories'
      AND COLUMN_NAME = p_column_name
  ) THEN
    SET @sql = alter_sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END//
DELIMITER ;

CALL add_category_column_if_missing('type', 'ALTER TABLE categories ADD COLUMN type VARCHAR(60) NOT NULL DEFAULT ''encyclopedia'' AFTER parent_id');
CALL add_category_column_if_missing('locale', 'ALTER TABLE categories ADD COLUMN locale VARCHAR(10) NOT NULL DEFAULT ''fa'' AFTER type');
CALL add_category_column_if_missing('summary', 'ALTER TABLE categories ADD COLUMN summary VARCHAR(800) NULL AFTER slug');
CALL add_category_column_if_missing('content_top', 'ALTER TABLE categories ADD COLUMN content_top LONGTEXT NULL AFTER summary');
CALL add_category_column_if_missing('content_bottom', 'ALTER TABLE categories ADD COLUMN content_bottom LONGTEXT NULL AFTER content_top');
CALL add_category_column_if_missing('cover_image_url', 'ALTER TABLE categories ADD COLUMN cover_image_url VARCHAR(600) NULL AFTER content_bottom');
CALL add_category_column_if_missing('seo_title', 'ALTER TABLE categories ADD COLUMN seo_title VARCHAR(255) NULL AFTER cover_image_url');
CALL add_category_column_if_missing('seo_description', 'ALTER TABLE categories ADD COLUMN seo_description VARCHAR(500) NULL AFTER seo_title');
CALL add_category_column_if_missing('canonical_url', 'ALTER TABLE categories ADD COLUMN canonical_url VARCHAR(600) NULL AFTER seo_description');
CALL add_category_column_if_missing('faq_json', 'ALTER TABLE categories ADD COLUMN faq_json JSON NULL AFTER canonical_url');
CALL add_category_column_if_missing('is_published', 'ALTER TABLE categories ADD COLUMN is_published TINYINT(1) NOT NULL DEFAULT 0 AFTER faq_json');
CALL add_category_column_if_missing('is_indexable', 'ALTER TABLE categories ADD COLUMN is_indexable TINYINT(1) NOT NULL DEFAULT 1 AFTER is_published');
CALL add_category_column_if_missing('sort_order', 'ALTER TABLE categories ADD COLUMN sort_order INT NOT NULL DEFAULT 0 AFTER is_indexable');
DROP PROCEDURE IF EXISTS add_category_column_if_missing;

SET @article_menu_fk := (
  SELECT CONSTRAINT_NAME
  FROM information_schema.KEY_COLUMN_USAGE
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'articles'
    AND COLUMN_NAME = 'category_id'
    AND REFERENCED_TABLE_NAME = 'menus'
  LIMIT 1
);
SET @sql := IF(@article_menu_fk IS NULL, 'SELECT 1', CONCAT('ALTER TABLE articles DROP FOREIGN KEY ', @article_menu_fk));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @news_menu_fk := (
  SELECT CONSTRAINT_NAME
  FROM information_schema.KEY_COLUMN_USAGE
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'news'
    AND COLUMN_NAME = 'category_id'
    AND REFERENCED_TABLE_NAME = 'menus'
  LIMIT 1
);
SET @sql := IF(@news_menu_fk IS NULL, 'SELECT 1', CONCAT('ALTER TABLE news DROP FOREIGN KEY ', @news_menu_fk));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE articles SET category_id = NULL WHERE category_id IS NOT NULL AND category_id NOT IN (SELECT id FROM categories);
UPDATE news SET category_id = NULL WHERE category_id IS NOT NULL AND category_id NOT IN (SELECT id FROM categories);

SET @article_category_fk := (
  SELECT CONSTRAINT_NAME
  FROM information_schema.KEY_COLUMN_USAGE
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'articles'
    AND COLUMN_NAME = 'category_id'
    AND REFERENCED_TABLE_NAME = 'categories'
  LIMIT 1
);
SET @sql := IF(@article_category_fk IS NULL, 'ALTER TABLE articles ADD CONSTRAINT fk_articles_category FOREIGN KEY (category_id) REFERENCES categories(id)', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @news_category_fk := (
  SELECT CONSTRAINT_NAME
  FROM information_schema.KEY_COLUMN_USAGE
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'news'
    AND COLUMN_NAME = 'category_id'
    AND REFERENCED_TABLE_NAME = 'categories'
  LIMIT 1
);
SET @sql := IF(@news_category_fk IS NULL, 'ALTER TABLE news ADD CONSTRAINT fk_news_category FOREIGN KEY (category_id) REFERENCES categories(id)', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE menus
SET is_published = 0, accuracy = 2, modified_at = UTC_TIMESTAMP(), modified_by = 1
WHERE slug IN (
  'home', 'knowledge', 'news', 'documents', 'markets', 'currency-rates', 'services-china-sourcing',
  'buy-from-china-guide', 'buy-from-china-alibaba', 'buy-from-china-1688', 'buy-from-china-request',
  'import-export', 'import-export-import', 'import-export-export', 'import-export-order-registration',
  'customs-clearance', 'yuan-transfer', 'import-registration-menu', 'import-services-menu', 'china-import-menu',
  'china-cargo-menu', 'export-services-menu', 'education', 'knowledge-base', 'trade-circulars-menu', 'trade-updates-menu',
  'trade-news-customs-menu', 'trade-news-import-menu', 'trade-news-export-menu', 'trade-news-china-trade-menu',
  'trade-news-eurasia-trade-menu', 'trade-news-asia-trade-menu', 'trade-news-shipping-logistics-menu', 'customs-circulars-menu',
  'currency-transfer-request'
);

CREATE TEMPORARY TABLE tmp_content_menus (
  title VARCHAR(220) NOT NULL,
  url VARCHAR(600) NOT NULL,
  slug VARCHAR(180) NOT NULL,
  parent_slug VARCHAR(180) NULL,
  level TINYINT UNSIGNED NOT NULL,
  sort_order INT NOT NULL,
  seo_title VARCHAR(255) NULL,
  seo_description VARCHAR(500) NULL
);

INSERT INTO tmp_content_menus (title, url, slug, parent_slug, level, sort_order, seo_title, seo_description) VALUES
  ('خدمات', '/services', 'services', NULL, 1, 10, 'خدمات خوبروز | خرید از چین، ترخیص، حواله، ثبت سفارش و حمل', 'صفحات خدماتی و تبدیل‌محور خوبروز بدون ترکیب با مقالات.'),
  ('خرید از چین', '/buy-from-china', 'buy-from-china', 'services', 2, 11, 'خرید از چین | خوبروز', 'مسیر خرید، تامین کالا، پرداخت و حمل از چین با ساختار خدماتی خوبروز.'),
  ('ترخیص کالا', '/services/customs-clearance', 'customs-clearance', 'services', 2, 12, 'ترخیص کالا | خوبروز', 'بررسی مسیر ترخیص کالا، اسناد و امور گمرکی.'),
  ('حواله‌های ارزی', '/services/currency-transfer', 'services-currency-transfer', 'services', 2, 13, 'خدمات حواله ارزی | خوبروز', 'خدمت هماهنگی حواله‌های تجاری یوان، درهم و ارزهای رایج.'),
  ('ثبت سفارش واردات', '/services/import-registration', 'services-import-registration', 'services', 2, 14, 'خدمات ثبت سفارش واردات | خوبروز', 'خدمت پیگیری مسیر ثبت سفارش واردات.'),
  ('حمل بین‌المللی', '/services/international-shipping', 'services-international-shipping', 'services', 2, 15, 'حمل بین‌المللی | خوبروز', 'خدمت هماهنگی حمل و لجستیک بین‌المللی.'),
  ('خدمات صادرات', '/services/export-services', 'services-export-services', 'services', 2, 16, 'خدمات صادرات | خوبروز', 'خدمت مسیر صادرات، اسناد، آماده‌سازی و پیگیری صادرات.'),
  ('واردات از چین', '/import-from-china', 'import-from-china', NULL, 1, 30, 'واردات از چین | خوبروز', 'مسیر واردات کالا از چین، مدارک، حمل و ثبت سفارش.'),
  ('مراحل واردات از چین', '/import-from-china/steps', 'import-from-china-steps', 'import-from-china', 2, 31, 'مراحل واردات از چین | خوبروز', 'مراحل واردات کالا از چین و هماهنگی سفارش تا ورود کالا.'),
  ('حمل کالا از چین', '/import-from-china/shipping', 'import-from-china-shipping', 'import-from-china', 2, 32, 'حمل کالا از چین | خوبروز', 'مسیر حمل کالا از چین و هماهنگی لجستیک واردات.'),
  ('ثبت سفارش واردات', '/import-from-china/order-registration', 'import-from-china-order-registration', 'import-from-china', 2, 33, 'ثبت سفارش واردات از چین | خوبروز', 'پیش‌نیازها و مدارک ثبت سفارش برای کالاهای وارداتی از چین.'),
  ('حواله‌های ارزی', '/currency-transfer', 'currency-transfer', NULL, 1, 40, 'حواله‌های ارزی | خوبروز', 'مسیر خدمات حواله تتر، حواله دلار، حواله یوان، حواله لیر و حواله درهم.'),
  ('حواله تتر', '/currency-transfer/tether', 'currency-transfer-tether', 'currency-transfer', 2, 41, 'حواله تتر | خوبروز', 'انتقال تتر برای پرداخت‌های تجاری و تسویه‌های بین‌المللی.'),
  ('حواله دلار', '/currency-transfer/dollar', 'currency-transfer-dollar', 'currency-transfer', 2, 42, 'حواله دلار | خوبروز', 'حواله دلار برای پرداخت‌های تجاری و تسویه‌های بین‌المللی.'),
  ('حواله یوان', '/currency-transfer/yuan', 'currency-transfer-yuan', 'currency-transfer', 2, 43, 'حواله یوان | خوبروز', 'پرداخت RMB و حواله یوان برای خرید و واردات از چین.'),
  ('حواله لیر', '/currency-transfer/lira', 'currency-transfer-lira', 'currency-transfer', 2, 44, 'حواله لیر | خوبروز', 'حواله لیر برای پرداخت‌های تجاری و منطقه‌ای.'),
  ('حواله درهم', '/currency-transfer/aed', 'currency-transfer-aed', 'currency-transfer', 2, 45, 'حواله درهم | خوبروز', 'حواله درهم برای پرداخت‌های تجاری و وارداتی.'),
  ('دانشنامه تجاری', '/trade-encyclopedia', 'trade-encyclopedia-menu', NULL, 1, 50, 'دانشنامه تجاری | خوبروز', 'دسته‌بندی‌های آموزشی تجارت خارجی، اسناد، حمل، ارز و اصطلاحات بازرگانی.'),
  ('گمرک', '/trade-encyclopedia/customs', 'trade-encyclopedia-customs-menu', 'trade-encyclopedia-menu', 2, 51, 'گمرک | دانشنامه تجاری خوبروز', 'مفاهیم آموزشی گمرکی بدون ترکیب با مقررات.'),
  ('اسناد تجاری', '/trade-encyclopedia/commercial-documents', 'trade-encyclopedia-commercial-documents-menu', 'trade-encyclopedia-menu', 2, 52, 'اسناد تجاری | دانشنامه خوبروز', 'اسناد رایج خرید خارجی، واردات، صادرات و حمل.'),
  ('پروفرما', '/trade-encyclopedia/commercial-documents/proforma', 'commercial-documents-proforma-menu', 'trade-encyclopedia-commercial-documents-menu', 3, 521, 'پروفرما | اسناد تجاری خوبروز', 'پروفرما یا پیش‌فاکتور خرید خارجی و کاربرد آن در واردات و صادرات.'),
  ('پروفرما اینویس', '/trade-encyclopedia/commercial-documents/proforma-invoice', 'commercial-documents-proforma-invoice-menu', 'trade-encyclopedia-commercial-documents-menu', 3, 522, 'پروفرما اینویس | اسناد تجاری خوبروز', 'سند پایه توافق خرید خارجی و شروع مسیر ثبت سفارش.'),
  ('اینویس تجاری', '/trade-encyclopedia/commercial-documents/commercial-invoice', 'commercial-documents-commercial-invoice-menu', 'trade-encyclopedia-commercial-documents-menu', 3, 523, 'اینویس تجاری | اسناد تجاری خوبروز', 'فاکتور تجاری رسمی معامله در واردات و صادرات.'),
  ('پکینگ لیست', '/trade-encyclopedia/commercial-documents/packing-list', 'commercial-documents-packing-list-menu', 'trade-encyclopedia-commercial-documents-menu', 3, 524, 'پکینگ لیست | اسناد تجاری خوبروز', 'فهرست بسته‌بندی کالا و کاربرد آن در حمل و گمرک.'),
  ('بارنامه', '/trade-encyclopedia/commercial-documents/bill-of-lading', 'commercial-documents-bill-of-lading-menu', 'trade-encyclopedia-commercial-documents-menu', 3, 525, 'بارنامه | اسناد حمل خوبروز', 'سند حمل کالا در مسیرهای حمل بین‌المللی.'),
  ('گواهی مبدأ', '/trade-encyclopedia/commercial-documents/certificate-of-origin', 'commercial-documents-certificate-of-origin-menu', 'trade-encyclopedia-commercial-documents-menu', 3, 526, 'گواهی مبدأ | اسناد تجاری خوبروز', 'سند کشور مبدأ کالا در واردات و صادرات.'),
  ('گواهی بازرسی', '/trade-encyclopedia/commercial-documents/inspection-certificate', 'commercial-documents-inspection-certificate-menu', 'trade-encyclopedia-commercial-documents-menu', 3, 527, 'گواهی بازرسی | اسناد تجاری خوبروز', 'سند کنترل و بازرسی کالا پیش از حمل یا تحویل.'),
  ('اظهارنامه گمرکی', '/trade-encyclopedia/commercial-documents/customs-declaration', 'commercial-documents-customs-declaration-menu', 'trade-encyclopedia-commercial-documents-menu', 3, 528, 'اظهارنامه گمرکی | اسناد تجاری خوبروز', 'سند اظهار کالا به گمرک برای واردات و صادرات.'),
  ('مجوزهای واردات و صادرات', '/trade-encyclopedia/commercial-documents/import-export-permits', 'commercial-documents-import-export-permits-menu', 'trade-encyclopedia-commercial-documents-menu', 3, 529, 'مجوزهای واردات و صادرات | خوبروز', 'مجوزهای لازم برای ورود و خروج کالا در تجارت خارجی.'),
  ('اینکوترمز', '/trade-encyclopedia/incoterms', 'trade-encyclopedia-incoterms-menu', 'trade-encyclopedia-menu', 2, 53, 'اینکوترمز | دانشنامه خوبروز', 'قواعد اینکوترمز و مفاهیم تحویل کالا در تجارت خارجی.'),
  ('انگلیسی تجاری', '/trade-encyclopedia/business-english', 'trade-encyclopedia-business-english-menu', 'trade-encyclopedia-menu', 2, 54, 'انگلیسی تجاری | دانشنامه خوبروز', 'اصطلاحات، مکاتبات و واژگان انگلیسی تجارت خارجی.'),
  ('حمل‌ونقل بین‌المللی', '/trade-encyclopedia/international-shipping', 'trade-encyclopedia-international-shipping-menu', 'trade-encyclopedia-menu', 2, 55, 'حمل‌ونقل بین‌المللی | دانشنامه خوبروز', 'روش‌های حمل، لجستیک و مفاهیم حمل بین‌المللی.'),
  ('امور ارزی', '/trade-encyclopedia/foreign-exchange', 'trade-encyclopedia-foreign-exchange-menu', 'trade-encyclopedia-menu', 2, 56, 'امور ارزی | دانشنامه خوبروز', 'مفاهیم ارزی کاربردی در واردات و صادرات.'),
  ('اصطلاحات بازرگانی', '/trade-encyclopedia/trade-terms', 'trade-encyclopedia-trade-terms-menu', 'trade-encyclopedia-menu', 2, 57, 'اصطلاحات بازرگانی | دانشنامه خوبروز', 'واژه‌ها و اصطلاحات پرکاربرد تجارت خارجی.'),
  ('اخبار و بخشنامه‌ها', '/trade-updates', 'trade-updates-menu', NULL, 1, 60, 'اخبار و بخشنامه‌ها | خوبروز', 'پایش اخبار تجارت و بخشنامه‌های رسمی واردات، صادرات، ارز و گمرک.'),
  ('اخبار تجارت', '/trade-news', 'trade-news-menu', 'trade-updates-menu', 2, 61, 'اخبار تجارت | خوبروز', 'اخبار گمرک، واردات، صادرات، ارز، چین و تجارت خارجی.'),
  ('بخشنامه‌ها', '/trade-circulars', 'trade-circulars-menu', 'trade-updates-menu', 2, 62, 'بخشنامه‌های تجارت | خوبروز', 'بخشنامه‌ها و ابلاغیه‌های رسمی گمرک، صمت، بانک مرکزی و تجارت.'),
  ('ارتباط با خوبروز', '/contact', 'khoobrooz-contact', NULL, 1, 80, 'ارتباط با خوبروز | تماس و معرفی', 'مسیرهای تماس با خوبروز، معرفی برند و سوالات متداول.'),
  ('تماس با ما', '/contact', 'contact', 'khoobrooz-contact', 2, 81, 'تماس با خوبروز | مشاوره تجارت خارجی', 'واتساپ، شبکه‌های اجتماعی و مسیرهای تماس خوبروز.'),
  ('درباره خوبروز', '/about', 'about', 'khoobrooz-contact', 2, 82, 'درباره خوبروز | خدمات بازرگانی', 'معرفی خوبروز، رویکرد خدماتی و ارزش‌های برند.'),
  ('سوالات متداول', '/faq', 'faq', 'khoobrooz-contact', 2, 83, 'سوالات متداول خوبروز', 'پاسخ سوال‌های رایج درباره خدمات و مسیرهای همکاری.');

INSERT INTO menus (title, url, slug, parent_id, level, sort_order, seo_title, seo_description, is_published, accuracy, created_by)
SELECT t.title, t.url, t.slug, p.id, t.level, t.sort_order, t.seo_title, t.seo_description, 1, 1, 1
FROM tmp_content_menus t
LEFT JOIN menus p ON p.slug = t.parent_slug
WHERE NOT EXISTS (SELECT 1 FROM menus m WHERE m.slug = t.slug);

UPDATE menus m
JOIN tmp_content_menus t ON t.slug = m.slug
LEFT JOIN menus p ON p.slug = t.parent_slug
SET m.title = t.title,
    m.url = t.url,
    m.parent_id = p.id,
    m.level = t.level,
    m.sort_order = t.sort_order,
    m.seo_title = t.seo_title,
    m.seo_description = t.seo_description,
    m.is_published = 1,
    m.accuracy = 1,
    m.modified_at = UTC_TIMESTAMP(),
    m.modified_by = 1;

CREATE TEMPORARY TABLE tmp_content_categories (
  title VARCHAR(220) NOT NULL,
  slug VARCHAR(180) NOT NULL,
  parent_slug VARCHAR(180) NULL,
  type VARCHAR(60) NOT NULL,
  sort_order INT NOT NULL,
  summary VARCHAR(800) NULL,
  seo_title VARCHAR(255) NULL,
  seo_description VARCHAR(500) NULL,
  canonical_url VARCHAR(600) NULL
);

INSERT INTO tmp_content_categories (title, slug, parent_slug, type, sort_order, summary, seo_title, seo_description, canonical_url) VALUES
  ('دانشنامه تجاری', 'trade-encyclopedia', NULL, 'encyclopedia', 10, 'مرجع آموزشی خوبروز برای مفاهیم تجارت خارجی، اسناد، حمل، ارز و اصطلاحات بازرگانی.', 'دانشنامه تجاری | خوبروز', 'دانشنامه تجاری خوبروز برای یادگیری مفاهیم واردات، صادرات، گمرک، اسناد تجاری و حمل بین‌المللی.', '/trade-encyclopedia'),
  ('گمرک', 'customs', 'trade-encyclopedia', 'encyclopedia', 11, 'محتوای آموزشی درباره مفاهیم گمرکی، تعرفه، اظهارنامه، حقوق ورودی و مسیرهای گمرکی.', 'گمرک | دانشنامه تجاری خوبروز', 'آموزش مفاهیم گمرکی مانند تعرفه، HS Code، ارزش گمرکی، حقوق ورودی، اظهارنامه و کوتاژ.', '/trade-encyclopedia/customs'),
  ('اسناد تجاری', 'commercial-documents', 'trade-encyclopedia', 'encyclopedia', 12, 'آشنایی با اسناد رایج خرید خارجی، واردات، صادرات و حمل بین‌المللی.', 'اسناد تجاری | دانشنامه خوبروز', 'معرفی اسناد تجاری مانند پروفرما، اینویس، پکینگ لیست، بارنامه و مدارک واردات و صادرات.', '/trade-encyclopedia/commercial-documents'),
  ('پروفرما', 'proforma', 'commercial-documents', 'encyclopedia', 121, 'پروفرما یا پیش‌فاکتور خرید خارجی و کاربرد آن در واردات و صادرات.', 'پروفرما | اسناد تجاری خوبروز', 'پروفرما چیست و چه کاربردی در خرید خارجی، واردات و صادرات دارد.', '/trade-encyclopedia/commercial-documents/proforma'),
  ('پروفرما اینویس', 'proforma-invoice', 'commercial-documents', 'encyclopedia', 122, 'پروفرما اینویس سند پایه توافق خرید خارجی و شروع مسیر ثبت سفارش است.', 'پروفرما اینویس | اسناد تجاری خوبروز', 'پروفرما اینویس چیست و چه اطلاعاتی در آن درج می‌شود.', '/trade-encyclopedia/commercial-documents/proforma-invoice'),
  ('اینویس تجاری', 'commercial-invoice', 'commercial-documents', 'encyclopedia', 123, 'اینویس تجاری یا فاکتور رسمی معامله در واردات و صادرات.', 'اینویس تجاری | اسناد تجاری خوبروز', 'کاربرد اینویس تجاری در واردات، صادرات و گمرک.', '/trade-encyclopedia/commercial-documents/commercial-invoice'),
  ('پکینگ لیست', 'packing-list', 'commercial-documents', 'encyclopedia', 124, 'پکینگ لیست یا فهرست بسته‌بندی کالا برای حمل و گمرک.', 'پکینگ لیست | اسناد تجاری خوبروز', 'پکینگ لیست چیست و چه اطلاعاتی درباره بسته‌بندی کالا دارد.', '/trade-encyclopedia/commercial-documents/packing-list'),
  ('بارنامه', 'bill-of-lading', 'commercial-documents', 'encyclopedia', 125, 'بارنامه سند حمل کالا و یکی از اسناد کلیدی حمل بین‌المللی.', 'بارنامه | اسناد تجاری خوبروز', 'بارنامه چیست و چه کاربردی در حمل بین‌المللی و ترخیص دارد.', '/trade-encyclopedia/commercial-documents/bill-of-lading'),
  ('گواهی مبدأ', 'certificate-of-origin', 'commercial-documents', 'encyclopedia', 126, 'گواهی مبدأ سند کشور مبدأ کالا در واردات و صادرات.', 'گواهی مبدأ | اسناد تجاری خوبروز', 'گواهی مبدأ چیست و چرا در تجارت خارجی اهمیت دارد.', '/trade-encyclopedia/commercial-documents/certificate-of-origin'),
  ('گواهی بازرسی', 'inspection-certificate', 'commercial-documents', 'encyclopedia', 127, 'گواهی بازرسی سند کنترل کالا از نظر مقدار، کیفیت یا مشخصات توافق‌شده.', 'گواهی بازرسی | اسناد تجاری خوبروز', 'گواهی بازرسی چیست و چه کاربردی در خرید خارجی دارد.', '/trade-encyclopedia/commercial-documents/inspection-certificate'),
  ('اظهارنامه گمرکی', 'customs-declaration', 'commercial-documents', 'encyclopedia', 128, 'اظهارنامه گمرکی سند اظهار کالا به گمرک برای واردات یا صادرات.', 'اظهارنامه گمرکی | اسناد تجاری خوبروز', 'اظهارنامه گمرکی چیست و چه اطلاعاتی در آن ثبت می‌شود.', '/trade-encyclopedia/commercial-documents/customs-declaration'),
  ('مجوزهای واردات و صادرات', 'import-export-permits', 'commercial-documents', 'encyclopedia', 129, 'مجوزهای لازم برای واردات و صادرات کالاهای مختلف.', 'مجوزهای واردات و صادرات | اسناد تجاری خوبروز', 'مجوزهای واردات و صادرات چیست و چه زمانی لازم می‌شود.', '/trade-encyclopedia/commercial-documents/import-export-permits'),
  ('اینکوترمز', 'incoterms', 'trade-encyclopedia', 'encyclopedia', 13, 'مفاهیم و قواعد اینکوترمز برای تحویل کالا، ریسک و هزینه در تجارت خارجی.', 'اینکوترمز | دانشنامه خوبروز', 'راهنمای قواعد اینکوترمز و کاربرد آن‌ها در قراردادهای خرید، فروش و حمل بین‌المللی.', '/trade-encyclopedia/incoterms'),
  ('انگلیسی تجاری', 'business-english', 'trade-encyclopedia', 'encyclopedia', 14, 'واژگان، اصطلاحات و مکاتبات انگلیسی کاربردی در تجارت خارجی.', 'انگلیسی تجاری | دانشنامه خوبروز', 'اصطلاحات انگلیسی بازرگانی، مکاتبات تجاری، عبارات رایج خرید خارجی و صادرات.', '/trade-encyclopedia/business-english'),
  ('حمل‌ونقل بین‌المللی', 'international-shipping', 'trade-encyclopedia', 'encyclopedia', 15, 'مفاهیم حمل دریایی، هوایی، زمینی، بارنامه، فورواردر و لجستیک بین‌المللی.', 'حمل‌ونقل بین‌المللی | دانشنامه خوبروز', 'آموزش روش‌های حمل بین‌المللی، اصطلاحات لجستیک، بارنامه و عوامل موثر بر حمل کالا.', '/trade-encyclopedia/international-shipping'),
  ('امور ارزی', 'foreign-exchange', 'trade-encyclopedia', 'encyclopedia', 16, 'مفاهیم ارزی مورد استفاده در واردات، صادرات، حواله و محاسبات تجاری.', 'امور ارزی | دانشنامه خوبروز', 'آموزش مفاهیم ارزی تجارت خارجی، حواله، نرخ‌ها، کارمزدها و پرداخت بین‌المللی.', '/trade-encyclopedia/foreign-exchange'),
  ('اصطلاحات بازرگانی', 'trade-terms', 'trade-encyclopedia', 'encyclopedia', 17, 'واژه‌ها و اصطلاحات پرتکرار بازرگانی، واردات، صادرات، حمل و اسناد.', 'اصطلاحات بازرگانی | دانشنامه خوبروز', 'فرهنگ اصطلاحات تجارت خارجی و واژه‌های رایج بازرگانی برای واردات و صادرات.', '/trade-encyclopedia/trade-terms'),
  ('اخبار و بخشنامه‌ها', 'trade-updates', NULL, 'news', 20, 'مسیر اصلی اخبار تجارت و بخشنامه‌های مهم واردات، صادرات، ارز و گمرک.', 'اخبار و بخشنامه‌های تجارت | خوبروز', 'اخبار تجارت و بخشنامه‌های رسمی مرتبط با گمرک، واردات، صادرات، ارز، صمت و بانک مرکزی.', '/trade-updates'),
  ('اخبار تجارت', 'trade-news', 'trade-updates', 'news', 21, 'اخبار گمرک، واردات، صادرات، ارز، چین و تجارت خارجی.', 'اخبار تجارت | خوبروز', 'آخرین اخبار تجارت خارجی، گمرک، واردات، صادرات، ارز و چین در خوبروز.', '/trade-news'),
  ('اخبار گمرک', 'customs-news', 'trade-news', 'news', 22, 'خبرهای مرتبط با گمرک و رویه‌های اجرایی گمرکی.', 'اخبار گمرک | خوبروز', 'خبرهای مرتبط با گمرک، تشریفات گمرکی و تغییرات اجرایی حوزه گمرک.', '/trade-news/customs-news'),
  ('اخبار واردات', 'import-news', 'trade-news', 'news', 23, 'خبرهای مرتبط با واردات کالا، ثبت سفارش و مسیرهای وارداتی.', 'اخبار واردات | خوبروز', 'اخبار واردات کالا، ثبت سفارش، مجوزها و تصمیم‌های مرتبط با واردات.', '/trade-news/import-news'),
  ('اخبار صادرات', 'export-news', 'trade-news', 'news', 24, 'خبرهای مرتبط با صادرات کالا، بازارهای هدف و مقررات صادرات.', 'اخبار صادرات | خوبروز', 'اخبار صادرات کالا، بازارهای هدف، تعهدات و مسیرهای صادراتی.', '/trade-news/export-news'),
  ('اخبار ارز', 'currency-news', 'trade-news', 'news', 25, 'خبرهای مرتبط با ارز، حواله و سیاست‌های ارزی تجارت.', 'اخبار ارز | خوبروز', 'اخبار نرخ ارز، حواله، سیاست‌های ارزی و اثر آن‌ها بر تجارت خارجی.', '/trade-news/currency-news'),
  ('اخبار چین', 'china-news', 'trade-news', 'news', 26, 'خبرهای مرتبط با تجارت، خرید، حمل و واردات از چین.', 'اخبار چین | خوبروز', 'خبرهای چین، تامین کالا، واردات از چین و مسیرهای تجاری ایران و چین.', '/trade-news/china-news'),
  ('اخبار تجارت خارجی', 'foreign-trade-news', 'trade-news', 'news', 27, 'خبرهای عمومی تجارت خارجی ایران و جهان.', 'اخبار تجارت خارجی | خوبروز', 'خبرهای تجارت خارجی، واردات، صادرات و تصمیم‌های کلان تجاری.', '/trade-news/foreign-trade-news'),
  ('تجارت با چین', 'china-trade', 'trade-news', 'news', 28, 'خبرهای تجارت ایران و چین، واردات از چین و مسیرهای تجاری مرتبط.', 'اخبار تجارت با چین | خوبروز', 'خبرهای تجارت ایران و چین، واردات از چین، خرید از چین و مسیرهای پرداخت و حمل چین.', '/trade-news/china-trade'),
  ('تجارت با اوراسیا', 'eurasia-trade', 'trade-news', 'news', 29, 'خبرهای تجارت با اتحادیه اقتصادی اوراسیا، تعرفه‌ها و فرصت‌های منطقه‌ای.', 'اخبار تجارت با اوراسیا | خوبروز', 'خبرهای تجارت با اوراسیا، صادرات به اوراسیا، واردات از اوراسیا و تعرفه ترجیحی.', '/trade-news/eurasia-trade'),
  ('تجارت آسیا', 'asia-trade', 'trade-news', 'news', 30, 'خبرهای تجارت با کشورهای آسیایی، بازارهای منطقه‌ای و مسیرهای واردات و صادرات.', 'اخبار تجارت آسیا | خوبروز', 'خبرهای تجارت آسیا، صادرات به آسیا، واردات از آسیا و بازارهای آسیایی.', '/trade-news/asia-trade'),
  ('حمل و لجستیک', 'shipping-logistics', 'trade-news', 'news', 31, 'خبرهای حمل بین‌المللی، لجستیک، زنجیره تامین و مسیرهای حمل کالا.', 'اخبار حمل‌ونقل و لجستیک | خوبروز', 'خبرهای حمل‌ونقل، لجستیک، حمل بین‌المللی، کشتیرانی و زنجیره تامین.', '/trade-news/shipping-logistics'),
  ('بخشنامه‌ها', 'trade-circulars', 'trade-updates', 'circular', 31, 'بخشنامه‌های گمرکی، ارزی، واردات، صادرات، صمت و بانک مرکزی.', 'بخشنامه‌های تجارت | خوبروز', 'بخشنامه‌های رسمی مرتبط با واردات، صادرات، گمرک، ارز، وزارت صمت و بانک مرکزی.', '/trade-circulars'),
  ('بخشنامه‌های گمرک', 'customs-circulars', 'trade-circulars', 'circular', 32, 'بخشنامه‌ها و ابلاغیه‌های گمرکی.', 'بخشنامه‌های گمرک | خوبروز', 'بخشنامه‌های گمرکی، تغییرات رویه‌ها و ابلاغیه‌های مرتبط با گمرک.', '/trade-circulars/customs-circulars'),
  ('بخشنامه‌های ارزی', 'currency-circulars', 'trade-circulars', 'circular', 33, 'بخشنامه‌های مرتبط با ارز، حواله و تعهدات ارزی.', 'بخشنامه‌های ارزی | خوبروز', 'بخشنامه‌های ارزی، حواله‌های تجاری، تعهدات ارزی و دستورالعمل‌های بانک مرکزی.', '/trade-circulars/currency-circulars'),
  ('بخشنامه‌های واردات', 'import-circulars', 'trade-circulars', 'circular', 34, 'بخشنامه‌های مرتبط با واردات کالا و ثبت سفارش.', 'بخشنامه‌های واردات | خوبروز', 'بخشنامه‌های واردات کالا، ثبت سفارش، مجوزها و محدودیت‌های وارداتی.', '/trade-circulars/import-circulars'),
  ('بخشنامه‌های صادرات', 'export-circulars', 'trade-circulars', 'circular', 35, 'بخشنامه‌های مرتبط با صادرات کالا و تعهدات صادراتی.', 'بخشنامه‌های صادرات | خوبروز', 'بخشنامه‌های صادرات کالا، تعهدات صادراتی و ضوابط بازارهای هدف.', '/trade-circulars/export-circulars'),
  ('بخشنامه‌های وزارت صمت', 'industry-ministry-circulars', 'trade-circulars', 'circular', 36, 'بخشنامه‌ها و اطلاعیه‌های وزارت صمت در تجارت خارجی.', 'بخشنامه‌های وزارت صمت | خوبروز', 'بخشنامه‌ها و دستورالعمل‌های وزارت صمت مرتبط با واردات، صادرات و ثبت سفارش.', '/trade-circulars/industry-ministry-circulars'),
  ('بخشنامه‌های بانک مرکزی', 'central-bank-circulars', 'trade-circulars', 'circular', 37, 'بخشنامه‌ها و دستورالعمل‌های بانک مرکزی درباره ارز و تجارت.', 'بخشنامه‌های بانک مرکزی | خوبروز', 'بخشنامه‌های بانک مرکزی در حوزه ارز، تعهدات ارزی، حواله و واردات و صادرات.', '/trade-circulars/central-bank-circulars'),
  ('تغییرات تعرفه‌ها', 'tariff-changes', 'trade-circulars', 'circular', 38, 'اطلاعیه‌ها و تغییرات مرتبط با تعرفه‌های تجاری و گمرکی.', 'تغییرات تعرفه‌ها | خوبروز', 'اخبار و بخشنامه‌های مرتبط با تغییرات تعرفه‌های واردات، صادرات و گمرک.', '/trade-circulars/tariff-changes');

INSERT INTO categories (title, slug, parent_id, type, locale, summary, seo_title, seo_description, canonical_url, is_published, is_indexable, sort_order, accuracy, created_by)
SELECT t.title, t.slug, p.id, t.type, 'fa', t.summary, t.seo_title, t.seo_description, t.canonical_url, 1, 1, t.sort_order, 1, 1
FROM tmp_content_categories t
LEFT JOIN categories p ON p.slug = t.parent_slug
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = t.slug AND COALESCE(c.locale, 'fa') = 'fa');

UPDATE categories c
JOIN tmp_content_categories t ON t.slug = c.slug AND COALESCE(c.locale, 'fa') = 'fa'
LEFT JOIN categories p ON p.slug = t.parent_slug AND COALESCE(p.locale, 'fa') = 'fa'
SET c.title = t.title,
    c.parent_id = p.id,
    c.type = t.type,
    c.locale = 'fa',
    c.summary = t.summary,
    c.seo_title = t.seo_title,
    c.seo_description = t.seo_description,
    c.canonical_url = t.canonical_url,
    c.is_published = 1,
    c.is_indexable = 1,
    c.sort_order = t.sort_order,
    c.accuracy = 1,
    c.modified_at = UTC_TIMESTAMP(),
    c.modified_by = 1;

CREATE TABLE IF NOT EXISTS pages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  locale VARCHAR(10) NOT NULL DEFAULT 'fa',
  slug VARCHAR(180) NOT NULL,
  title VARCHAR(220) NOT NULL,
  summary VARCHAR(800) NULL,
  body LONGTEXT NULL,
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
  UNIQUE KEY uq_pages_locale_slug (locale, slug),
  CONSTRAINT chk_pages_accuracy CHECK (accuracy IN (0, 1, 2))
);

CREATE TEMPORARY TABLE tmp_content_pages (
  title VARCHAR(220) NOT NULL,
  slug VARCHAR(180) NOT NULL,
  summary VARCHAR(800) NULL,
  seo_title VARCHAR(255) NULL,
  seo_description VARCHAR(500) NULL
);

INSERT INTO tmp_content_pages (title, slug, summary, seo_title, seo_description) VALUES
  ('خرید از چین', 'buy-from-china', 'مسیر خرید، تامین کالا، پرداخت و حمل از چین.', 'خرید از چین | خوبروز', 'صفحه خرید از چین برای ثبت و تکمیل محتوای خدمات خرید و تامین کالا.'),
  ('راهنمای خرید از چین', 'buy-from-china/guide', 'راهنمای مراحل خرید، تامین‌کننده، پرداخت و حمل از چین.', 'راهنمای خرید از چین | خوبروز', 'راهنمای خرید از چین و مسیرهای مرتبط با تامین کالا.'),
  ('خرید از علی‌بابا', 'buy-from-china/alibaba', 'مسیر خرید تجاری از Alibaba و هماهنگی سفارش.', 'خرید از علی‌بابا | خوبروز', 'صفحه خرید از علی‌بابا برای تکمیل محتوای اختصاصی.'),
  ('خرید از 1688', 'buy-from-china/1688', 'مسیر خرید عمده از 1688 و تامین کالا از چین.', 'خرید از 1688 | خوبروز', 'صفحه خرید از 1688 برای تکمیل محتوای اختصاصی.'),
  ('درخواست خرید از چین', 'buy-from-china/request', 'ثبت درخواست بررسی خرید و تامین کالا از چین.', 'درخواست خرید از چین | خوبروز', 'صفحه درخواست خرید از چین و دریافت اطلاعات سفارش.'),
  ('صادرات و واردات', 'import-export', 'صفحه اصلی مسیرهای واردات، صادرات و ثبت سفارش.', 'صادرات و واردات | خوبروز', 'صفحه صادرات و واردات خوبروز برای تکمیل محتوای پیلار.'),
  ('واردات کالا', 'import-export/import', 'مراحل، مدارک و مسیر رسمی واردات کالا.', 'واردات کالا | خوبروز', 'صفحه واردات کالا برای تکمیل محتوای اختصاصی.'),
  ('صادرات کالا', 'import-export/export', 'اسناد، بازار هدف، مذاکره و مسیر صادرات کالا.', 'صادرات کالا | خوبروز', 'صفحه صادرات کالا برای تکمیل محتوای اختصاصی.'),
  ('ثبت سفارش واردات', 'import-export/order-registration', 'پیش‌نیازها و مدارک لازم برای ثبت سفارش واردات.', 'ثبت سفارش واردات | خوبروز', 'صفحه ثبت سفارش واردات برای تکمیل محتوا.'),
  ('واردات از چین', 'import-from-china', 'مسیر واردات کالا از چین، از بررسی سفارش و مدارک تا حمل و ثبت سفارش.', 'واردات از چین | خوبروز', 'صفحه واردات از چین برای تکمیل محتوای پیلار.'),
  ('مراحل واردات از چین', 'import-from-china/steps', 'مراحل اصلی واردات کالا از چین و هماهنگی سفارش تا ورود کالا.', 'مراحل واردات از چین | خوبروز', 'صفحه مراحل واردات از چین برای تکمیل محتوا.'),
  ('حمل کالا از چین', 'import-from-china/shipping', 'مسیر حمل کالا از چین و هماهنگی لجستیک واردات.', 'حمل کالا از چین | خوبروز', 'صفحه حمل کالا از چین برای تکمیل محتوا.'),
  ('ثبت سفارش واردات از چین', 'import-from-china/order-registration', 'پیش‌نیازها و مدارک ثبت سفارش برای کالاهای وارداتی از چین.', 'ثبت سفارش واردات از چین | خوبروز', 'صفحه ثبت سفارش واردات از چین برای تکمیل محتوا.'),
  ('حواله‌های ارزی', 'currency-transfer', 'مسیر خدمات حواله تتر، حواله دلار، حواله یوان، حواله لیر و حواله درهم.', 'حواله‌های ارزی | خوبروز', 'صفحه حواله‌های ارزی خوبروز برای تکمیل محتوا.'),
  ('حواله تتر', 'currency-transfer/tether', 'انتقال تتر برای پرداخت‌های تجاری و تسویه‌های بین‌المللی.', 'حواله تتر | خوبروز', 'صفحه حواله تتر برای تکمیل محتوای اختصاصی.'),
  ('حواله دلار', 'currency-transfer/dollar', 'حواله دلار برای پرداخت‌های تجاری و تسویه‌های بین‌المللی.', 'حواله دلار | خوبروز', 'صفحه حواله دلار برای تکمیل محتوای اختصاصی.'),
  ('حواله یوان', 'currency-transfer/yuan', 'پرداخت RMB و حواله یوان برای خرید و واردات از چین.', 'حواله یوان | خوبروز', 'صفحه حواله یوان برای تکمیل محتوای اختصاصی.'),
  ('حواله لیر', 'currency-transfer/lira', 'حواله لیر برای پرداخت‌های تجاری و منطقه‌ای.', 'حواله لیر | خوبروز', 'صفحه حواله لیر برای تکمیل محتوای اختصاصی.'),
  ('حواله درهم', 'currency-transfer/aed', 'حواله درهم برای پرداخت‌های تجاری و وارداتی.', 'حواله درهم | خوبروز', 'صفحه حواله درهم برای تکمیل محتوای اختصاصی.'),
  ('درخواست حواله ارزی', 'currency-transfer/request', 'ثبت درخواست بررسی حواله ارزی برای پرداخت‌های تجاری.', 'درخواست حواله ارزی | خوبروز', 'صفحه درخواست حواله ارزی برای تکمیل محتوا.'),
  ('دانشنامه تجاری', 'trade-encyclopedia', 'مرجع آموزشی خوبروز برای مفاهیم تجارت خارجی.', 'دانشنامه تجاری | خوبروز', 'صفحه دانشنامه تجاری و دسته‌های آموزشی تجارت خارجی.'),
  ('گمرک', 'trade-encyclopedia/customs', 'محتوای آموزشی درباره مفاهیم گمرکی.', 'گمرک | دانشنامه تجاری خوبروز', 'صفحه دسته گمرک برای تکمیل محتوای آموزشی.'),
  ('اسناد تجاری', 'trade-encyclopedia/commercial-documents', 'آشنایی با اسناد رایج خرید خارجی، واردات و صادرات.', 'اسناد تجاری | خوبروز', 'صفحه دسته اسناد تجاری برای تکمیل محتوا.'),
  ('پروفرما', 'trade-encyclopedia/commercial-documents/proforma', 'پروفرما یا پیش‌فاکتور خرید خارجی و کاربرد آن در واردات و صادرات.', 'پروفرما | خوبروز', 'صفحه پروفرما برای تکمیل محتوای دانشنامه اسناد تجاری.'),
  ('پروفرما اینویس', 'trade-encyclopedia/commercial-documents/proforma-invoice', 'پروفرما اینویس سند پایه توافق خرید خارجی و شروع مسیر ثبت سفارش است.', 'پروفرما اینویس | خوبروز', 'صفحه پروفرما اینویس برای تکمیل محتوای دانشنامه اسناد تجاری.'),
  ('اینویس تجاری', 'trade-encyclopedia/commercial-documents/commercial-invoice', 'اینویس تجاری یا فاکتور رسمی معامله در واردات و صادرات.', 'اینویس تجاری | خوبروز', 'صفحه اینویس تجاری برای تکمیل محتوای دانشنامه اسناد تجاری.'),
  ('پکینگ لیست', 'trade-encyclopedia/commercial-documents/packing-list', 'پکینگ لیست یا فهرست بسته‌بندی کالا برای حمل و گمرک.', 'پکینگ لیست | خوبروز', 'صفحه پکینگ لیست برای تکمیل محتوای دانشنامه اسناد تجاری.'),
  ('بارنامه', 'trade-encyclopedia/commercial-documents/bill-of-lading', 'بارنامه سند حمل کالا و یکی از اسناد کلیدی حمل بین‌المللی.', 'بارنامه | خوبروز', 'صفحه بارنامه برای تکمیل محتوای دانشنامه اسناد تجاری.'),
  ('گواهی مبدأ', 'trade-encyclopedia/commercial-documents/certificate-of-origin', 'گواهی مبدأ سند کشور مبدأ کالا در واردات و صادرات.', 'گواهی مبدأ | خوبروز', 'صفحه گواهی مبدأ برای تکمیل محتوای دانشنامه اسناد تجاری.'),
  ('گواهی بازرسی', 'trade-encyclopedia/commercial-documents/inspection-certificate', 'گواهی بازرسی سند کنترل کالا از نظر مقدار، کیفیت یا مشخصات توافق‌شده.', 'گواهی بازرسی | خوبروز', 'صفحه گواهی بازرسی برای تکمیل محتوای دانشنامه اسناد تجاری.'),
  ('اظهارنامه گمرکی', 'trade-encyclopedia/commercial-documents/customs-declaration', 'اظهارنامه گمرکی سند اظهار کالا به گمرک برای واردات یا صادرات.', 'اظهارنامه گمرکی | خوبروز', 'صفحه اظهارنامه گمرکی برای تکمیل محتوای دانشنامه اسناد تجاری.'),
  ('مجوزهای واردات و صادرات', 'trade-encyclopedia/commercial-documents/import-export-permits', 'مجوزهای لازم برای واردات و صادرات کالاهای مختلف.', 'مجوزهای واردات و صادرات | خوبروز', 'صفحه مجوزهای واردات و صادرات برای تکمیل محتوای دانشنامه اسناد تجاری.'),
  ('اینکوترمز', 'trade-encyclopedia/incoterms', 'مفاهیم و قواعد اینکوترمز در تجارت خارجی.', 'اینکوترمز | خوبروز', 'صفحه دسته اینکوترمز برای تکمیل محتوا.'),
  ('انگلیسی تجاری', 'trade-encyclopedia/business-english', 'واژگان و مکاتبات انگلیسی کاربردی تجارت خارجی.', 'انگلیسی تجاری | خوبروز', 'صفحه انگلیسی تجاری برای تکمیل محتوا.'),
  ('حمل‌ونقل بین‌المللی', 'trade-encyclopedia/international-shipping', 'مفاهیم حمل و لجستیک بین‌المللی.', 'حمل‌ونقل بین‌المللی | خوبروز', 'صفحه حمل‌ونقل بین‌المللی برای تکمیل محتوا.'),
  ('امور ارزی', 'trade-encyclopedia/foreign-exchange', 'مفاهیم ارزی مورد استفاده در واردات و صادرات.', 'امور ارزی | خوبروز', 'صفحه امور ارزی برای تکمیل محتوا.'),
  ('اصطلاحات بازرگانی', 'trade-encyclopedia/trade-terms', 'واژه‌ها و اصطلاحات پرتکرار بازرگانی.', 'اصطلاحات بازرگانی | خوبروز', 'صفحه اصطلاحات بازرگانی برای تکمیل محتوا.'),
  ('اخبار و بخشنامه‌ها', 'trade-updates', 'ورودی مشترک اخبار تجارت و بخشنامه‌های رسمی.', 'اخبار و بخشنامه‌ها | خوبروز', 'صفحه اخبار و بخشنامه‌ها با مسیرهای جداگانه.'),
  ('اخبار تجارت', 'trade-news', 'اخبار تجارت خارجی، واردات، صادرات، ارز و چین.', 'اخبار تجارت | خوبروز', 'صفحه اخبار تجارت برای تکمیل محتوا.'),
  ('اخبار گمرک', 'trade-news/customs-news', 'خبرهای گمرکی، تغییر رویه‌ها و موضوعات اجرایی گمرک.', 'اخبار گمرک | خوبروز', 'صفحه اخبار گمرک برای تکمیل محتوا.'),
  ('اخبار واردات', 'trade-news/import-news', 'خبرهای واردات کالا، ثبت سفارش و تصمیم‌های مرتبط با واردات.', 'اخبار واردات | خوبروز', 'صفحه اخبار واردات برای تکمیل محتوا.'),
  ('اخبار صادرات', 'trade-news/export-news', 'خبرهای صادرات کالا، بازارهای هدف و سیاست‌های صادرات.', 'اخبار صادرات | خوبروز', 'صفحه اخبار صادرات برای تکمیل محتوا.'),
  ('اخبار تجارت با چین', 'trade-news/china-trade', 'خبرهای تجارت ایران و چین، واردات از چین و مسیرهای تجاری مرتبط.', 'اخبار تجارت با چین | خوبروز', 'صفحه اخبار تجارت با چین برای تکمیل محتوا.'),
  ('اخبار تجارت با اوراسیا', 'trade-news/eurasia-trade', 'خبرهای تجارت با اتحادیه اقتصادی اوراسیا، تعرفه‌ها و فرصت‌های منطقه‌ای.', 'اخبار تجارت با اوراسیا | خوبروز', 'صفحه اخبار تجارت با اوراسیا برای تکمیل محتوا.'),
  ('اخبار تجارت آسیا', 'trade-news/asia-trade', 'خبرهای تجارت با کشورهای آسیایی، بازارهای منطقه‌ای و مسیرهای واردات و صادرات.', 'اخبار تجارت آسیا | خوبروز', 'صفحه اخبار تجارت آسیا برای تکمیل محتوا.'),
  ('اخبار حمل‌ونقل و لجستیک', 'trade-news/shipping-logistics', 'خبرهای حمل بین‌المللی، لجستیک، زنجیره تامین و مسیرهای حمل کالا.', 'اخبار حمل‌ونقل و لجستیک | خوبروز', 'صفحه اخبار حمل و لجستیک برای تکمیل محتوا.'),
  ('بخشنامه‌های گمرکی', 'trade-circulars/customs-circulars', 'بخشنامه‌ها و ابلاغیه‌های رسمی گمرکی.', 'بخشنامه‌های گمرکی | خوبروز', 'صفحه بخشنامه‌های گمرکی برای تکمیل محتوا.'),
  ('ترخیص کالا', 'services/customs-clearance', 'بررسی مسیر ترخیص کالا، اسناد و امور گمرکی.', 'ترخیص کالا | خوبروز', 'صفحه خدمت ترخیص کالا برای تکمیل محتوا.'),
  ('خدمات خرید و تامین کالا از چین', 'services/china-sourcing', 'خدمت خرید، سورسینگ و تامین کالا از چین.', 'خرید و تامین کالا از چین | خوبروز', 'صفحه خدمت خرید و تامین کالا از چین.'),
  ('خدمات حواله‌های ارزی', 'services/currency-transfer', 'خدمت هماهنگی حواله‌های تجاری.', 'خدمات حواله ارزی | خوبروز', 'صفحه خدمت حواله‌های ارزی.'),
  ('خدمات ثبت سفارش واردات', 'services/import-registration', 'خدمت پیگیری مسیر ثبت سفارش واردات.', 'ثبت سفارش واردات | خوبروز', 'صفحه خدمت ثبت سفارش واردات.'),
  ('حمل بین‌المللی', 'services/international-shipping', 'خدمت هماهنگی حمل و لجستیک بین‌المللی.', 'حمل بین‌المللی | خوبروز', 'صفحه خدمت حمل بین‌المللی.'),
  ('خدمات صادرات', 'services/export-services', 'خدمت مسیر صادرات، اسناد و پیگیری صادرات.', 'خدمات صادرات | خوبروز', 'صفحه خدمت صادرات.');

INSERT INTO pages (title, slug, summary, seo_title, seo_description, is_published, accuracy, created_by)
SELECT t.title, t.slug, t.summary, t.seo_title, t.seo_description, 1, 1, 1
FROM tmp_content_pages t
WHERE NOT EXISTS (SELECT 1 FROM pages p WHERE p.slug = t.slug AND COALESCE(p.locale, 'fa') = 'fa');

UPDATE pages p
JOIN tmp_content_pages t ON t.slug = p.slug AND COALESCE(p.locale, 'fa') = 'fa'
SET p.title = t.title,
    p.summary = t.summary,
    p.seo_title = t.seo_title,
    p.seo_description = t.seo_description,
    p.body = IF(COALESCE(p.body, '') = '', p.body, p.body),
    p.is_published = 1,
    p.accuracy = 1,
    p.modified_at = UTC_TIMESTAMP(),
    p.modified_by = 1;

DROP TEMPORARY TABLE IF EXISTS tmp_content_menus;
DROP TEMPORARY TABLE IF EXISTS tmp_content_categories;
DROP TEMPORARY TABLE IF EXISTS tmp_content_pages;
