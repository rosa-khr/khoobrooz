# مستند GitHub Pipelines

این سند روند `CI Pipeline` و مسیر merge کردن branchها را مشخص می‌کند.

## Branch flow

- `feat`: کارهای feature و توسعه روزانه
- `dev`: محیط تست بعد از feature
- `main`: production فعلی
- `prod`: production آینده، اگر این branch در GitHub ساخته شود

دامنه production:

```text
https://khoobrooz.com
```

دامنه پیشنهادی staging:

```text
https://dev.khoobrooz.com
```

## مسیر Pull Request

ترتیب درست:

1. `feat` -> `dev`
2. `dev` -> `main` یا `prod`

## زمان اجرای Pipeline

Pipeline روی این حالت‌ها اجرا می‌شود:

- `pull_request` به `dev`
- `pull_request` به `main`
- `pull_request` به `prod`
- `push` روی `feat`
- `push` روی `dev`
- `push` روی `main`
- `push` روی `prod`

## Environment هر branch

| Branch/base | Environment | URL |
| --- | --- | --- |
| `feat` | `feature` | `http://localhost:3000` |
| `dev` | `staging` | `https://dev.khoobrooz.com` |
| `main` | `production` | `https://khoobrooz.com` |
| `prod` | `production` | `https://khoobrooz.com` |

## Checkهای فعلی

Pipeline این مراحل را اجرا می‌کند:

```bash
npm ci
npm run typecheck
npm run lint
npm run test:backend-contracts
npm run build
docker compose config --quiet
docker compose build
```

## Branch Protection پیشنهادی

در GitHub repository settings برای `dev` و branch production این موارد فعال شود:

- Require a pull request before merging
- Require status checks to pass before merging
- Required checks:
  - `Typecheck, lint and build`
  - `Docker build`
- Block direct push روی production branch

## Deployment

Deployment هنوز automate نشده، چون اطلاعات نهایی سرور، SSH، registry و secrets مشخص نیست. بعد از تهیه VPS یا Azure، workflow جدا برای deploy اضافه می‌شود.

## Secrets آینده

برای deploy بعدی احتمالاً این secretها لازم می‌شوند:

```text
SERVER_HOST
SERVER_USER
SERVER_SSH_KEY
DEPLOY_PATH
APP_URL
```

هیچ password یا private key نباید داخل commit یا چت ذخیره شود.
