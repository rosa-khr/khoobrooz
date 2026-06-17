# مدل دامنه Backend و استاندارد پنل ادمین

این سند مرحله اول قبل از پیاده‌سازی Backend است. هدف این سند این است که موجودیت‌ها، فیلدهای مشترک، workflow انتشار، وضعیت‌ها و استاندارد UI پنل ادمین قبل از کدنویسی مشخص شوند.

## برداشت محصول

خوبروز قرار است فقط یک سایت معرفی خدمات نباشد. محصول هدف، یک پلتفرم خدمات بازرگانی و محتوایی است که از پنل ادمین قابل مدیریت باشد:

- مدیریت Home Page
- مدیریت Menu و Submenu تا سه سطح
- مدیریت Pageها
- مدیریت Serviceها
- مدیریت Articleها
- مدیریت News
- مدیریت Tag و Category
- مدیریت نرخ ارز و برد بازار
- مدیریت World Clock
- مدیریت لینک‌های مهم
- مدیریت Countries برای dropdownهای استاندارد
- مدیریت Social Media برای Home Page و Footer
- مدیریت Userها، Adminها، Roleها و Permissionها
- آماده‌سازی برای Cart، Order، Payment و فروش فایل یا پلن خدماتی

## تجربه نرم‌افزاری کاربر

نیازهایی که مطرح شده نشان می‌دهد نگاه پروژه از سطح CRUD ساده عبور کرده است:

- درخواست logical delete به جای حذف فیزیکی یعنی توجه به audit و recovery.
- داشتن `approve`، `is_published` و `published_at` یعنی workflow محتوایی درست دیده شده است.
- تاکید روی `Validation` برای همه فرم‌ها یعنی کیفیت داده مهم است.
- استفاده از `AG Grid`، `Cell Renderer`، Badgeهای رنگی و Action Icon یعنی پنل باید حرفه‌ای و scalable باشد.
- جداسازی UI و Backend یعنی معماری باید قابل توسعه و قابل تست باشد.

جمع‌بندی: نگاه محصولی و نرم‌افزاری پروژه mature است و بهتر است Backend از ابتدا با استاندارد Enterprise-lite پیاده شود؛ نه خیلی سنگین، نه ساده و شکننده.

## فیلدهای مشترک همه جدول‌ها

همه جدول‌های اصلی باید این ستون‌ها را داشته باشند:

```text
id
created_at
created_by
modified_at
modified_by
accuracy
```

برای جدول‌هایی که رکورد قابل انتشار دارند:

```text
is_published
published_at
published_by
```

برای جدول‌هایی که نیاز به تایید دارند، مثل `articles` و `news`:

```text
approve
approved_at
approved_by
```

## استاندارد وضعیت مشترک

فیلد وضعیت در همه جدول‌ها:

```text
accuracy
```

مقادیر:

```text
PENDING = 0
ACCEPTED = 1
TRASHED = 2
```

کاربرد:

- `PENDING`: رکورد در انتظار بررسی یا فعال‌سازی است.
- `ACCEPTED`: رکورد فعال و قابل استفاده است.
- `TRASHED`: رکورد منطقی حذف شده است و در لیست‌های عادی نمایش داده نمی‌شود.

نکته:

- حذف‌ها نباید فیزیکی باشند.
- عملیات delete در پنل، مقدار `accuracy` را به `TRASHED = 2` تغییر می‌دهد.
- برای بازیابی آینده می‌توان action جدا به نام `restore` اضافه کرد.
- در تمام CRUDها، action حذف باید فقط همین ستون را به `2` تغییر دهد.

## استاندارد SEO مشترک

هر موجودیتی که صفحه عمومی یا URL دارد باید فیلدهای SEO داشته باشد:

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

موجودیت‌های شامل SEO:

- `menus`
- `pages`
- `services`
- `articles`
- `news`
- `categories`
- `tags`
- `documents`

## استاندارد Validation

برای تمام فرم‌ها باید `Validation` سمت Backend و Frontend داشته باشیم.

Backend:

- در Laravel با `FormRequest`
- خطاها با status code `422`
- پیام خطا قابل نمایش در UI

Frontend:

- validation اولیه برای UX بهتر
- نمایش خطاها با `Toast`
- نمایش موفقیت عملیات با `Toast`

نمونه پیام‌ها:

```text
عملیات با موفقیت انجام شد.
اطلاعات وارد شده معتبر نیست.
رکورد حذف شد.
رکورد برای تایید ارسال شد.
```

## استاندارد جدول‌های پنل ادمین

برای همه لیست‌ها از `AG Grid` استفاده می‌شود.

ویژگی‌های پایه:

- Pagination
- Sort
- Filter
- Column resize
- Row selection در صورت نیاز
- Server-side data source برای جدول‌های بزرگ
- Cell Renderer برای ستون‌های خاص

ستون‌های مشترک لیست‌ها:

```text
id
title/name
accuracy
is_published
approve
created_at
modified_at
actions
```

همه جدول‌ها الزاماً `approve` و `is_published` ندارند، اما اگر داشته باشند باید با `Cell Renderer` نمایش داده شوند.

## Cell Renderer وضعیت

ستون `accuracy` با Badge رنگی نمایش داده می‌شود:

```text
PENDING  -> badge-warning
ACCEPTED -> badge-success
TRASHED  -> badge-danger
```

ستون `approve`:

```text
true  -> تیک سبز
false -> ضربدر قرمز یا خاکستری
```

ستون `is_published`:

```text
true  -> تیک سبز یا badge-success
false -> ضربدر خاکستری یا badge-secondary
```

## ستون عملیات

ستون `actions` باید با سبک Metronic طراحی شود:

- دکمه‌ها کوچک، ظریف و قابل فهم باشند.
- ترجیحاً از SVG Icon استفاده شود.
- Tooltip برای iconها داشته باشیم.

Actionهای عمومی:

```text
مشاهده
ویرایش
حذف منطقی
```

Actionهای مخصوص Article و News:

```text
تایید
انتشار
لغو انتشار
```

## موجودیت Menu

جدول:

```text
menus
```

فیلدها:

```text
id
parent_id
title
url
slug
seo_title
seo_description
canonical_url
og_title
og_description
og_image_id
robots
structured_data
icon
target
sort_order
level
locale
is_published
published_at
published_by
created_at
created_by
modified_at
modified_by
accuracy
```

قوانین:

- اگر `parent_id` خالی باشد، آیتم منوی اصلی است.
- اگر `parent_id` مقدار داشته باشد، آیتم زیرمنو است.
- عمق مجاز حداکثر سه level است.
- `url` باید توسط admin قابل ورود باشد.
- `url` می‌تواند internal یا external باشد.
- اگر external باشد، باید `target` هم قابل تنظیم باشد.

## موجودیت Tag

جدول:

```text
tags
```

فیلدها:

```text
id
title
slug
seo_title
seo_description
canonical_url
og_title
og_description
og_image_id
robots
structured_data
locale
created_at
created_by
modified_at
modified_by
accuracy
```

ارتباط‌ها:

```text
article_tag
news_tag
```

نکته:

- Tag باید بین Article و News قابل استفاده باشد.
- اگر بعداً Document هم به Tag نیاز داشت، pivot جدا اضافه می‌شود.

## موجودیت Article

جدول:

```text
articles
```

فیلدها:

```text
id
category_id
title
slug
excerpt
body
cover_image_id
seo_title
seo_description
canonical_url
og_title
og_description
og_image_id
robots
structured_data
locale
approve
approved_at
approved_by
is_published
published_at
published_by
scheduled_at
created_at
created_by
modified_at
modified_by
accuracy
```

Workflow:

```text
Draft/PENDING -> approve=true -> is_published=true در زمان published_at
```

قوانین:

- مقاله بدون `approve=true` نباید public شود.
- مقاله می‌تواند `scheduled_at` داشته باشد.
- اگر زمان‌بندی شده باشد، Job انتشار باید آن را publish کند.

## موجودیت News

جدول:

```text
news
```

فیلدها مشابه Article است، با چند فیلد خبری:

```text
source_name
source_url
news_date
```

قوانین:

- خبر هم نیاز به `approve` دارد.
- خبر هم `is_published` و `published_at` دارد.
- لینک منبع خارجی اختیاری است و در UI عمومی با احتیاط نمایش داده می‌شود.

## موجودیت User و Admin

جدول‌ها:

```text
users
roles
permissions
role_user
permission_role
```

نکته:

- Userهای سایت و Adminها بهتر است ابتدا در یک جدول `users` باشند و با role جدا شوند.
- اگر بعداً userهای عمومی رفتار کاملاً متفاوت داشتند، profile table جدا اضافه می‌شود.

فیلدهای مهم `users`:

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

## موجودیت Home Page

برای مدیریت Home Page باید ساختار flexible داشته باشیم.

جدول‌ها:

```text
home_sections
home_section_items
```

فیلدهای `home_sections`:

```text
id
section_key
title
subtitle
description
layout_type
sort_order
locale
is_published
published_at
published_by
created_at
created_by
modified_at
modified_by
accuracy
```

فیلدهای `home_section_items`:

```text
id
section_id
title
subtitle
description
url
image_id
icon
metadata
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

کاربرد:

- Hero
- Services section
- Market board
- World clock
- Trust section
- Content/knowledge section
- Clearance CTA section

## موجودیت World Clock

جدول:

```text
world_clock_items
```

فیلدها:

```text
id
city
country
country_code
timezone
market_label
flag
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

کاربرد:

- admin انتخاب می‌کند ساعت چه کشورها/شهرهایی نمایش داده شود.

## موجودیت Countries

برای dropdown کشورها و استفاده در بخش‌هایی مثل World Clock، فرم‌ها، آدرس‌ها و اطلاعات تجاری، باید جدول static برای کشورها داشته باشیم.

جدول:

```text
countries
```

فیلدها:

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

قوانین:

- داده‌های اولیه کشورها با `Seeder` وارد می‌شود.
- این جدول برای dropdownها استفاده می‌شود.
- حذف کشورها نباید فیزیکی باشد؛ فقط `accuracy = TRASHED` می‌شود.
- اگر کشوری در فرم‌های قبلی استفاده شده باشد، حذف منطقی باعث از بین رفتن reference نمی‌شود.

## موجودیت Social Media

برای مدیریت لینک شبکه‌های اجتماعی در Home Page، Footer و Contact، جدول جدا لازم داریم.

جدول:

```text
social_links
```

فیلدها:

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

نمونه platformها:

```text
instagram
linkedin
telegram
whatsapp
bale
email
phone
```

قوانین:

- Socialها از پنل قابل مدیریت هستند.
- در Home Page و Footer استفاده می‌شوند.
- حذف فقط با `accuracy = TRASHED` انجام می‌شود.
- نمایش در UI فقط وقتی انجام می‌شود که `accuracy = ACCEPTED` و `is_published = true` باشد.

## موجودیت Important Links

جدول:

```text
important_links
```

فیلدها:

```text
id
title
url
description
category_id
icon
target
rel
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

نکته SEO:

- لینک خارجی باید قابل تنظیم باشد.
- مقدار `rel` می‌تواند `nofollow`, `noopener`, `noreferrer` باشد.

## موجودیت E-commerce سبک

برای فروش فایل یا پلن خدماتی آینده:

جدول‌های اولیه:

```text
products
product_files
plans
carts
cart_items
orders
order_items
payments
coupons
```

این بخش در فاز اول فقط طراحی می‌شود و پیاده‌سازی کامل آن بعد از نیاز فروش انجام می‌شود.

## فازبندی اجرای Backend

### فاز ۱: Foundation

- ساخت Laravel در `backend/`
- تنظیم ساختار لایه‌ها
- تنظیم SQL Server connection
- ساخت migrationهای مشترک
- ساخت User, Role, Permission
- ساخت Auth اولیه admin

### فاز ۲: Menus و Settings

- CRUD منو
- validation عمق سه سطح
- SEO fields
- API عمومی منو
- UI admin با AG Grid

### فاز ۳: Content

- Tags
- Categories
- Articles
- News
- approval workflow
- publish workflow
- scheduled publish

### فاز ۴: Home Page

- home sections
- home section items
- اتصال Frontend به API

### فاز ۵: Market و Tools

- market rates
- world clock
- important links
- countries
- social links

### فاز ۶: E-commerce آماده توسعه

- products
- carts
- orders
- payments

## تایید مورد نیاز قبل از اجرا

قبل از شروع پیاده‌سازی فاز ۱ باید این تصمیم‌ها تایید شوند:

1. نام فیلد وضعیت همه جدول‌ها `accuracy` باشد.
2. حذف منطقی با `accuracy = TRASHED` انجام شود.
3. برای Article و News فیلدهای `approve` و `is_published` داشته باشیم.
4. تمام جدول‌های admin با `AG Grid` ساخته شوند.
5. Backend داخل فولدر `backend/` ساخته شود.
6. فعلاً Frontend جابه‌جا نشود و بعداً در صورت نیاز به `apps/web` منتقل شود.
7. جدول `countries` برای dropdown کشورها با seed static ساخته شود.
8. جدول `social_links` برای مدیریت شبکه‌های اجتماعی ساخته شود.
