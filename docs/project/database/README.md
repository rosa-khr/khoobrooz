# مستند Database

این سند مرز و مسئولیت‌های `Database` پروژه خوبروز را مشخص می‌کند.

## Database هدف

```text
MySQL 8.4
```

## مسئولیت‌ها

- نگهداری داده‌های dynamic سایت
- نگهداری content
- نگهداری user/admin/role/permission
- نگهداری market rates
- نگهداری countries
- نگهداری social links
- آماده‌سازی ecommerce سبک

## قرارداد مشترک جدول‌ها

ستون‌های مشترک:

```text
id
created_at
created_by
modified_at
modified_by
accuracy
```

وضعیت‌ها:

```text
PENDING = 0
ACCEPTED = 1
TRASHED = 2
```

## SEO fields

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

## مستندات تکمیلی

طراحی عملی جدول‌ها و ERD در فولدر زیر نگهداری می‌شود:

```text
database-design/
```
