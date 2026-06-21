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

## Google Tag Manager

هدف:

- مدیریت tagهای بازاریابی، analytics و event tracking بدون تغییر مستقیم کد سایت.
- آماده‌سازی مسیر اتصال به Google Analytics و رویدادهای مهم مثل تماس، کلیک روی واتساپ، ارسال فرم و مشاهده صفحات خدمات.

پیاده‌سازی frontend:

- کامپوننت: `src/shared/components/GoogleTagManager.tsx`
- اتصال در layout اصلی: `src/app/layout.tsx`
- متغیر محیطی: `NEXT_PUBLIC_GTM_ID`

رفتار فعلی:

- اگر `NEXT_PUBLIC_GTM_ID` خالی باشد، هیچ اسکریپتی inject نمی‌شود.
- مسیرهای `/admin` ردیابی نمی‌شوند تا رفتار مدیر سایت وارد داده‌های analytics نشود.
- اسکریپت با `next/script` و strategy برابر `afterInteractive` بارگذاری می‌شود.

تنظیم محیط:

```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

نکات deploy:

- Container ID باید از Google Tag Manager ساخته و در environment هاست یا CI/CD قرار داده شود.
- بعد از publish، با حالت Preview در GTM و ابزار Tag Assistant صحت نصب بررسی شود.
- برای eventهای اختصاصی باید در فاز بعدی `dataLayer.push` در کامپوننت‌های مهم سایت اضافه شود.
