# مستند Frontend

این سند مرز و مسئولیت‌های `Frontend` پروژه خوبروز را مشخص می‌کند.

## وضعیت فعلی

کد Frontend فعلاً در فولدر `src/` قرار دارد و با `Next.js` اجرا می‌شود.

```text
src/
  app/
  assets/
  core/
  data/
  shared/
```

فعلاً کد Frontend به `apps/web` منتقل نمی‌شود تا ریسک شکستن مسیرها، importها و build کم بماند. اگر بعداً لازم شد، این انتقال به عنوان یک فاز جدا انجام می‌شود.

## مسئولیت‌ها

- نمایش سایت عمومی
- پشتیبانی از زبان‌ها
- SEO سمت Frontend
- نمایش صفحات خدمات، مقاله، خبر، اسناد و بازار
- اتصال مرحله‌ای به Backend API
- نمایش Toast برای خطا و موفقیت عملیات
- نمایش جدول‌های admin با `AG Grid` در فاز پنل

## استاندارد اتصال به Backend

Frontend نباید مستقیم به Database وصل شود.

مسیر درست:

```text
Frontend -> REST API -> Database
```

هر بخش داینامیک باید یک `API Client` مشخص داشته باشد و تا زمان آماده شدن Backend، fallback data حفظ شود.

## ترتیب داینامیک شدن

1. Menus
2. Settings و Social Links
3. Services
4. Articles
5. News
6. Market Rates
7. Home Page Sections

## تست‌ها

قبل از merge:

```bash
npm run typecheck
npm run lint
npm run build
```

اگر برای Frontend تست واحد یا integration اضافه شود، دستور test باید به pipeline اضافه شود.
