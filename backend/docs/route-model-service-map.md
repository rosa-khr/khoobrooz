# Route, Model و Service Map

این سند map اولیه بین routeها، modelها و serviceهای Backend را مشخص می‌کند.

## Public API

| Route | Model | Service |
| --- | --- | --- |
| `GET /api/v1/menus/{key}` | `Menu` | `MenuService` |
| `GET /api/v1/services` | `Service` | `ServiceService` |
| `GET /api/v1/articles` | `Article` | `ArticleService` |
| `GET /api/v1/news` | `News` | `NewsService` |
| `GET /api/v1/market-rates` | `MarketRateInstrument` | `MarketRateService` |
| `GET /api/v1/world-clock` | `WorldClockItem` | `WorldClockService` |
| `GET /api/v1/social-links` | `SocialLink` | `SocialLinkService` |

## Admin API

همه routeهای admin باید پشت `auth:sanctum` باشند.

| Module | Model | Service | نکته |
| --- | --- | --- | --- |
| Menus | `Menu` | `MenuService` | عمق منو تا سه level validate می‌شود. |
| Articles | `Article` | `ArticleService` | `approve` و `publish` action جدا دارد. |
| News | `News` | `NewsService` | `approve` و `publish` action جدا دارد. |
| Tags | `Tag` | `TagService` | مشترک بین Article و News. |
| Countries | `Country` | `CountryService` | seed کامل لازم دارد. |
| Social Links | `SocialLink` | `SocialLinkService` | برای Home/Footer/Contact. |
| Market Rates | `MarketRateInstrument` | `MarketRateService` | sync job و تست integration لازم دارد. |

## وضعیت فعلی

این فایل‌ها skeleton هستند و بعد از scaffold واقعی Laravel باید با Controller، Request، Resource و Test تکمیل شوند.
