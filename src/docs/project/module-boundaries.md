# مرزبندی Frontend، Backend، Database و Infrastructure

این سند مشخص می‌کند هر بخش پروژه چه مسئولیتی دارد و چه چیزی نباید انجام دهد.

## Frontend

محل فعلی:

```text
src/
```

مسئولیت:

- UI عمومی
- SEO سمت Frontend
- نمایش داده‌ها
- فراخوانی `REST API`

نباید:

- مستقیم به Database وصل شود.
- business logic مربوط به approval، publish یا payment را نگه دارد.
- حذف رکورد را خودش تصمیم‌گیری کند؛ فقط درخواست به API می‌فرستد.

## Backend

محل:

```text
backend/
```

مسئولیت:

- business logic
- validation
- auth
- permission
- approval workflow
- market sync
- API response

نباید:

- UI عمومی را رندر کند، مگر برای Admin Panel در صورت انتخاب معماری Laravel admin.
- داده public را بدون validation ذخیره کند.

## Database

محل مستندات:

```text
database-design/
src/docs/project/database/
```

مسئولیت:

- ذخیره داده
- constraintها
- indexها
- reference integrity

نباید:

- business rule پیچیده را به تنهایی نگه دارد؛ منطق اصلی در Backend است.

## Infrastructure

محل:

```text
infra/
```

مسئولیت:

- Docker
- Nginx/Caddy
- SSL
- deploy
- environment variables

نباید:

- secret واقعی داخل repository ذخیره کند.

## جریان داده

```text
User -> Frontend -> Backend API -> Database
```

برای integrationها:

```text
Scheduler/Job -> External Service -> Backend Service -> Database -> Frontend
```

## قانون تست

هر مرز ارتباطی باید تست داشته باشد:

- Frontend به API: contract یا integration test در آینده
- Backend به Database: feature test
- Backend به External Service: unit/feature test با Mock/Fake
- Scheduler و Job: test جداگانه
