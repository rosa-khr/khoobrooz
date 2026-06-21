# قراردادهای Database و Migration

این سند قراردادهای مشترک جدول‌ها و migrationهای Backend را مشخص می‌کند.

## ستون‌های مشترک همه جدول‌ها

```text
id
created_at
created_by
modified_at
modified_by
accuracy
```

## مقادیر Accuracy

```text
PENDING = 0
ACCEPTED = 1
TRASHED = 2
```

## قانون حذف

هیچ CRUD عمومی نباید حذف فیزیکی انجام دهد.

حذف منطقی:

```text
accuracy = 2
```

## ستون‌های انتشار

برای جدول‌هایی که در سایت منتشر می‌شوند:

```text
is_published
published_at
published_by
```

## ستون‌های تایید

برای `articles` و `news`:

```text
approve
approved_at
approved_by
```

## ستون‌های SEO

برای entityهای public:

```text
slug
seo_title
seo_description
canonical_url
og_title
og_description
og_image_id
robots
structured_data
```

## Indexهای پیشنهادی

برای بیشتر جدول‌های public:

```text
locale
slug
accuracy
is_published
published_at
sort_order
```

برای جدول‌های content:

```text
approve
scheduled_at
category_id
```

## Foreign Keyها

ستون‌های audit:

```text
created_by
modified_by
published_by
approved_by
```

به `users.id` اشاره می‌کنند، اما باید nullable باشند تا seed/system job هم بتواند رکورد بسازد.
