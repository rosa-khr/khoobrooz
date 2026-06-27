SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

USE khoobrooz;

START TRANSACTION;

UPDATE countries
SET name_fa = CONVERT(BINARY CONVERT(name_fa USING latin1) USING utf8mb4)
WHERE name_fa REGEXP '[ØÙÚÛ]';

UPDATE cities
SET name_fa = CONVERT(BINARY CONVERT(name_fa USING latin1) USING utf8mb4)
WHERE name_fa REGEXP '[ØÙÚÛ]';

UPDATE menus
SET
  title = IF(title REGEXP '[ØÙÚÛ]', CONVERT(BINARY CONVERT(title USING latin1) USING utf8mb4), title),
  seo_title = IF(seo_title REGEXP '[ØÙÚÛ]', CONVERT(BINARY CONVERT(seo_title USING latin1) USING utf8mb4), seo_title),
  seo_description = IF(seo_description REGEXP '[ØÙÚÛ]', CONVERT(BINARY CONVERT(seo_description USING latin1) USING utf8mb4), seo_description)
WHERE title REGEXP '[ØÙÚÛ]'
   OR seo_title REGEXP '[ØÙÚÛ]'
   OR seo_description REGEXP '[ØÙÚÛ]';

UPDATE tags
SET
  title = IF(title REGEXP '[ØÙÚÛ]', CONVERT(BINARY CONVERT(title USING latin1) USING utf8mb4), title),
  body = IF(body REGEXP '[ØÙÚÛ]', CONVERT(BINARY CONVERT(body USING latin1) USING utf8mb4), body),
  seo_title = IF(seo_title REGEXP '[ØÙÚÛ]', CONVERT(BINARY CONVERT(seo_title USING latin1) USING utf8mb4), seo_title),
  seo_description = IF(seo_description REGEXP '[ØÙÚÛ]', CONVERT(BINARY CONVERT(seo_description USING latin1) USING utf8mb4), seo_description)
WHERE title REGEXP '[ØÙÚÛ]'
   OR body REGEXP '[ØÙÚÛ]'
   OR seo_title REGEXP '[ØÙÚÛ]'
   OR seo_description REGEXP '[ØÙÚÛ]';

UPDATE services
SET
  title = IF(title REGEXP '[ØÙÚÛ]', CONVERT(BINARY CONVERT(title USING latin1) USING utf8mb4), title),
  short_title = IF(short_title REGEXP '[ØÙÚÛ]', CONVERT(BINARY CONVERT(short_title USING latin1) USING utf8mb4), short_title),
  summary = IF(summary REGEXP '[ØÙÚÛ]', CONVERT(BINARY CONVERT(summary USING latin1) USING utf8mb4), summary),
  body = IF(body REGEXP '[ØÙÚÛ]', CONVERT(BINARY CONVERT(body USING latin1) USING utf8mb4), body),
  seo_title = IF(seo_title REGEXP '[ØÙÚÛ]', CONVERT(BINARY CONVERT(seo_title USING latin1) USING utf8mb4), seo_title),
  seo_description = IF(seo_description REGEXP '[ØÙÚÛ]', CONVERT(BINARY CONVERT(seo_description USING latin1) USING utf8mb4), seo_description)
WHERE title REGEXP '[ØÙÚÛ]'
   OR short_title REGEXP '[ØÙÚÛ]'
   OR summary REGEXP '[ØÙÚÛ]'
   OR body REGEXP '[ØÙÚÛ]'
   OR seo_title REGEXP '[ØÙÚÛ]'
   OR seo_description REGEXP '[ØÙÚÛ]';

UPDATE world_clock_items
SET
  city = IF(city REGEXP '[ØÙÚÛ]', CONVERT(BINARY CONVERT(city USING latin1) USING utf8mb4), city),
  country = IF(country REGEXP '[ØÙÚÛ]', CONVERT(BINARY CONVERT(country USING latin1) USING utf8mb4), country),
  market_label = IF(market_label REGEXP '[ØÙÚÛ]', CONVERT(BINARY CONVERT(market_label USING latin1) USING utf8mb4), market_label)
WHERE city REGEXP '[ØÙÚÛ]'
   OR country REGEXP '[ØÙÚÛ]'
   OR market_label REGEXP '[ØÙÚÛ]';

COMMIT;
