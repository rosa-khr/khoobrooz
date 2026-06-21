# مستندات خوبروز

این فولدر مرجع مشترک مستندات پروژه خوبروز است و فقط متعلق به Frontend نیست.

## Stack فعلی

- `Next.js`
- `TypeScript`
- `Tailwind CSS`
- `React`

## ساختار پروژه

کد Frontend فعلاً داخل `src` قرار دارد. مستندات مشترک پروژه در root و داخل `docs` نگهداری می‌شود تا Frontend، Backend، Database و Infrastructure را با هم پوشش دهد.

```text
docs/
  project/             مستندات مشترک پروژه، معماری، agentها، planها و prototype آرشیوی
src/
  app/                 routeها و صفحه‌های Next.js
  core/
    lib/               ثابت‌ها و helperهای اصلی
  shared/
    components/        componentهای قابل استفاده مجدد
  data/                داده‌های navigation و content
  assets/
    images/            assetهای تصویری پروژه
backend/               مرز Backend و مستندات Laravel
database-design/       طراحی Database و جدول‌های پایه
infra/                 مرز Infrastructure و مستندات زیرساخت
```

فایل‌هایی مثل `package.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.js`, `tsconfig.json` و `next-env.d.ts` فعلاً در root می‌مانند چون ابزارهای Next.js، npm، TypeScript و Tailwind این مسیر را انتظار دارند.

## دستورها

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
```

آدرس local اصلی:

```text
http://localhost:3000/fa
```
