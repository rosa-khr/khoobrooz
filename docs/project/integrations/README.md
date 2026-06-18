# مستندات Integrations

این پوشه برای داکیومنت سرویس‌هایی است که با منبع بیرونی کار می‌کنند.

نمونه‌ها:

- `Market Rate Sync`
- `Crawler`
- `External API Client`
- `Webhook`
- `Import Service`

برای هر integration باید این موارد ثبت شود:

- هدف
- منبع داده
- زمان‌بندی اجرا
- endpoint یا صفحه مورد استفاده
- mapping داده‌ها به جدول‌های داخلی
- سناریوهای خطا
- تست‌های نوشته شده
- محدودیت‌ها و نکات نگهداری

هیچ integration مهمی نباید بدون تست و داکیومنت وارد branchهای `dev` یا production شود.
