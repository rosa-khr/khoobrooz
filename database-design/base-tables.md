# جدول‌های پایه Backend

این سند جدول‌های پایه فاز `Backend Foundation` را مشخص می‌کند.

## فاز Foundation

جدول‌های این فاز:

```text
users
roles
permissions
role_user
permission_role
settings
countries
social_links
```

نسخه SQL Server این جدول‌ها و جدول‌های وابسته در مسیر زیر پیاده‌سازی شده است:

```text
database-design/sql/001_core_schema.sql
```

## جدول users

فیلدهای اصلی:

```text
id
name
email
phone
password
email_verified_at
phone_verified_at
last_login_at
created_at
created_by
modified_at
modified_by
accuracy
```

## جدول roles

```text
id
name
key
description
created_at
created_by
modified_at
modified_by
accuracy
```

## جدول permissions

```text
id
name
key
group
description
created_at
created_by
modified_at
modified_by
accuracy
```

## جدول countries

```text
id
name_fa
name_en
iso2
iso3
phone_code
capital
currency_code
timezone_default
flag
sort_order
created_at
created_by
modified_at
modified_by
accuracy
```

## جدول social_links

```text
id
title
platform
url
icon
username
sort_order
is_published
published_at
published_by
created_at
created_by
modified_at
modified_by
accuracy
```
