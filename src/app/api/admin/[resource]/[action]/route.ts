import { NextRequest, NextResponse } from "next/server";

const backendApiBaseUrl = process.env.BACKEND_API_URL?.replace(/\/api\/v1$/, "") ?? "http://127.0.0.1:8000";

type FallbackContentSource = {
  id: number;
  title: string;
  name: string;
  slug: string;
  websiteUrl: string;
  feedUrl: string;
  sourceType: string;
  sourceCategory: string;
  language: string;
  country: string;
  defaultArticleType: string;
  defaultCategoryId: number | null;
  defaultCategory: string | null;
  trustLevel: string;
  fetchIntervalMinutes: number;
  backfillDays: number;
  maxBackfillItems: number;
  requiresReview: boolean;
  allowAutoPublish: boolean;
  isActive: boolean;
  respectRobots: boolean;
  connectionStatus: string;
  termsNotes: string;
  parserKey: string;
  lastFetchedAt: string | null;
  lastSuccessfulFetchAt: string | null;
  lastErrorAt: string | null;
  lastErrorMessage: string;
  accuracy: number;
  modifiedAt: string;
};

const initialContentSources = [
  ["گمرک جمهوری اسلامی ایران", "irica-official", "https://irica.gov.ir", "", "manual", "official", "circular", "manual_required", "RSS/API دقیق ثبت نشده؛ نیازمند بررسی robots و شرایط استفاده."],
  ["وزارت صنعت، معدن و تجارت", "mimt-official", "https://mimt.gov.ir", "", "manual", "official", "official_notice", "manual_required", "RSS/API دقیق ثبت نشده؛ قبل از فعال‌سازی باید بررسی شود."],
  ["سازمان توسعه تجارت ایران", "tpo-official", "https://tpo.ir", "", "manual", "official", "official_notice", "manual_required", "RSS/API دقیق ثبت نشده؛ قبل از فعال‌سازی باید بررسی شود."],
  ["بانک مرکزی جمهوری اسلامی ایران", "cbi-official", "https://cbi.ir", "", "manual", "official", "circular", "manual_required", "در صورت CAPTCHA یا محدودیت ضدربات، دریافت خودکار انجام نشود."],
  ["سامانه جامع تجارت ایران", "ntsw-official", "https://ntsw.ir", "", "manual", "official", "official_notice", "manual_required", "در صورت نیاز به ورود یا CAPTCHA، ورود دستی انجام شود."],
  ["پایگاه ملی اطلاع‌رسانی قوانین و مقررات کشور", "dotic-official", "https://dotic.ir", "", "manual", "official", "regulation", "manual_required", "منبع اولویت‌دار مقررات؛ URL دقیق RSS/API حدس زده نشده است."],
  ["روزنامه رسمی جمهوری اسلامی ایران", "rrk-official", "https://rrk.ir", "", "manual", "official", "regulation", "manual_required", "فقط محتوای عمومی قابل دسترسی دریافت شود."],
  ["خبرگزاری تسنیم", "tasnim-news", "https://www.tasnimnews.com", "https://www.tasnimnews.ir/fa/rss", "rss", "news_agency", "news", "ready", "فید رسمی اعلام‌شده در دستور پروژه."],
  ["خبرگزاری ایسنا", "isna-news", "https://www.isna.ir", "https://www.isna.ir/rss-help", "manual", "news_agency", "news", "needs_configuration", "این URL صفحه راهنمای RSS است، نه فید نهایی."],
  ["خبرگزاری ایرنا", "irna-news", "https://www.irna.ir", "", "manual", "news_agency", "news", "needs_configuration", "RSS/API دقیق حدس زده نشده است."],
  ["خبرگزاری مهر", "mehr-news", "https://www.mehrnews.com", "", "manual", "news_agency", "news", "needs_configuration", "RSS/API دقیق حدس زده نشده است."],
  ["باشگاه خبرنگاران جوان", "yjc-news", "https://www.yjc.ir", "https://www.yjc.ir/fa/rss", "rss", "news_agency", "news", "ready", "فقط فیدهای مرتبط با اقتصاد، تجارت، صنعت، ارز و گمرک فعال شوند."],
  ["دنیای اقتصاد", "donya-e-eqtesad", "https://donya-e-eqtesad.com", "", "manual", "trade_media", "news", "needs_configuration", "قبل از دریافت باید RSS رسمی و مجوز نمایش محتوا/تصویر بررسی شود."],
  ["اکوایران", "ecoiran", "https://ecoiran.com", "", "manual", "trade_media", "news", "needs_configuration", "روش رسمی دریافت محتوا و شرایط استفاده باید بررسی شود."],
  ["وزارت بازرگانی چین", "mofcom-china", "https://english.mofcom.gov.cn", "", "manual", "international", "news", "needs_configuration", "متن انگلیسی بدون ترجمه خودکار ذخیره شود."],
  ["گمرک چین", "china-customs", "https://english.customs.gov.cn", "", "manual", "international", "official_notice", "needs_configuration", "روش رسمی دریافت باید بررسی شود."],
  ["شورای توسعه تجارت بین‌المللی چین", "ccpit-china", "https://en.ccpit.org", "", "manual", "international", "news", "needs_configuration", "روش رسمی دریافت باید بررسی شود."],
  ["سازمان تجارت جهانی", "wto", "https://www.wto.org", "", "manual", "international", "news", "needs_configuration", "روش رسمی دریافت باید بررسی شود."],
  ["آنکتاد", "unctad", "https://unctad.org", "", "manual", "international", "news", "needs_configuration", "روش رسمی دریافت باید بررسی شود."],
  ["اتاق بازرگانی بین‌المللی", "iccwbo", "https://iccwbo.org", "", "manual", "international", "news", "needs_configuration", "روش رسمی دریافت باید بررسی شود."]
].map(([name, slug, websiteUrl, feedUrl, sourceType, sourceCategory, defaultArticleType, connectionStatus, termsNotes], index): FallbackContentSource => ({
  id: index + 1,
  title: name,
  name,
  slug,
  websiteUrl,
  feedUrl,
  sourceType,
  sourceCategory,
  language: index >= 14 ? "en" : "fa",
  country: index >= 14 ? (index < 17 ? "CN" : "") : "IR",
  defaultArticleType,
  defaultCategoryId: null,
  defaultCategory: null,
  trustLevel: sourceCategory === "official" || sourceCategory === "international" ? "official" : sourceCategory === "news_agency" ? "high" : "medium",
  fetchIntervalMinutes: sourceCategory === "international" ? 120 : sourceCategory === "trade_media" ? 60 : 30,
  backfillDays: 7,
  maxBackfillItems: 20,
  requiresReview: true,
  allowAutoPublish: false,
  isActive: connectionStatus === "ready",
  respectRobots: true,
  connectionStatus,
  termsNotes,
  parserKey: sourceType === "rss" ? "rss-generic" : "official-manual",
  lastFetchedAt: null,
  lastSuccessfulFetchAt: null,
  lastErrorAt: null,
  lastErrorMessage: "",
  accuracy: 1,
  modifiedAt: "2026-07-17 00:00:00"
}));

let fallbackContentSources: FallbackContentSource[] = [...initialContentSources];

function parseBody(bodyText: string) {
  try {
    return JSON.parse(bodyText || "{}") as Record<string, unknown>;
  } catch {
    return {};
  }
}

function fallbackAdminResponse(resource: string, action: string, bodyText: string) {
  if (resource === "content-sources" && action === "loadPage") {
    const visibleSources = fallbackContentSources.filter((source) => source.accuracy !== 2);
    return {
      responseStatus: 1,
      response: {
        items: visibleSources,
        total: visibleSources.length
      },
      message: "Content source fallback list is shown until database seed is applied."
    };
  }

  if (resource === "content-sources" && action === "find") {
    const id = Number(parseBody(bodyText).id);
    const item = fallbackContentSources.find((source) => source.id === id);
    return {
      responseStatus: 1,
      response: {
        items: item ? [item] : [],
        total: item ? 1 : 0
      },
      message: "Content source fallback item is shown until database seed is applied."
    };
  }

  if (resource === "content-sources" && (action === "add" || action === "update")) {
    const body = parseBody(bodyText);
    const id = action === "add" ? Math.max(0, ...fallbackContentSources.map((source) => source.id)) + 1 : Number(body.id);
    const previous = fallbackContentSources.find((source) => source.id === id);
    const saved = {
      ...(previous ?? fallbackContentSources[0]),
      id,
      title: String(body.name ?? body.title ?? previous?.name ?? ""),
      name: String(body.name ?? body.title ?? previous?.name ?? ""),
      slug: String(body.slug ?? previous?.slug ?? ""),
      websiteUrl: String(body.websiteUrl ?? previous?.websiteUrl ?? ""),
      feedUrl: String(body.feedUrl ?? previous?.feedUrl ?? ""),
      sourceType: String(body.sourceType ?? previous?.sourceType ?? "manual"),
      sourceCategory: String(body.sourceCategory ?? previous?.sourceCategory ?? "official"),
      language: String(body.language ?? previous?.language ?? "fa"),
      country: String(body.country ?? previous?.country ?? "IR"),
      defaultArticleType: String(body.defaultArticleType ?? previous?.defaultArticleType ?? "news"),
      defaultCategoryId: typeof body.defaultCategoryId === "number" ? body.defaultCategoryId : previous?.defaultCategoryId ?? null,
      trustLevel: String(body.trustLevel ?? previous?.trustLevel ?? "medium"),
      fetchIntervalMinutes: Number(body.fetchIntervalMinutes ?? previous?.fetchIntervalMinutes ?? 60),
      backfillDays: Number(body.backfillDays ?? previous?.backfillDays ?? 7),
      maxBackfillItems: Number(body.maxBackfillItems ?? previous?.maxBackfillItems ?? 20),
      requiresReview: true,
      allowAutoPublish: false,
      isActive: Boolean(body.isActive ?? previous?.isActive),
      respectRobots: Boolean(body.respectRobots ?? previous?.respectRobots ?? true),
      connectionStatus: String(body.connectionStatus ?? previous?.connectionStatus ?? "needs_configuration"),
      termsNotes: String(body.termsNotes ?? previous?.termsNotes ?? ""),
      parserKey: String(body.parserKey ?? previous?.parserKey ?? "rss-generic"),
      accuracy: Number(body.accuracy ?? previous?.accuracy ?? 1),
      modifiedAt: new Date().toISOString().slice(0, 19).replace("T", " ")
    };

    fallbackContentSources = action === "add"
      ? [...fallbackContentSources, saved]
      : fallbackContentSources.map((source) => (source.id === id ? saved : source));

    return {
      responseStatus: 1,
      response: {
        items: [saved],
        total: 1
      },
      message: "Content source fallback item was saved in memory until database seed is applied."
    };
  }

  if (resource === "content-sources" && action === "delete") {
    const id = Number(parseBody(bodyText).id);
    fallbackContentSources = fallbackContentSources.map((source) => (
      source.id === id ? { ...source, accuracy: 2, modifiedAt: new Date().toISOString().slice(0, 19).replace("T", " ") } : source
    ));
    return {
      responseStatus: 1,
      response: { items: [{ id, accuracy: 2 }], total: 1 },
      message: "Content source fallback item was deleted in memory until database seed is applied."
    };
  }

  if (resource === "content-sources" && action === "fetch") {
    const id = Number(parseBody(bodyText).id);
    const item = fallbackContentSources.find((source) => source.id === id);
    return {
      responseStatus: item?.sourceType === "rss" ? 1 : 0,
      response: {
        items: item ? [{ fetched: 0, inserted: 0, duplicates: 0, source: item.name }] : [],
        total: item ? 1 : 0
      },
      message: item?.sourceType === "rss"
        ? "برای دریافت واقعی باید جدول‌های دیتابیس backend فعال باشند."
        : "این منبع RSS فعال ندارد و نیازمند تنظیم دستی است."
    };
  }

  if (resource === "source-items" && action === "loadPage") {
    return {
      responseStatus: 1,
      response: { items: [], total: 0 },
      message: "No incoming items are available until content source tables are seeded and sources are fetched."
    };
  }

  return null;
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ resource: string; action: string }> }
) {
  const bodyText = await request.text();

  try {
    const { resource, action } = await context.params;
    const response = await fetch(
      `${backendApiBaseUrl}/api/admin/${encodeURIComponent(resource)}/${encodeURIComponent(action)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: bodyText,
        cache: "no-store"
      }
    );

    const payload = await response.json();
    const fallback = fallbackAdminResponse(resource, action, bodyText);

    if ((!response.ok || payload.responseStatus === 0) && fallback) {
      return NextResponse.json(fallback, { status: 200 });
    }

    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    const { resource, action } = await context.params;
    const fallback = fallbackAdminResponse(resource, action, bodyText);
    if (fallback) {
      return NextResponse.json(fallback, { status: 200 });
    }

    return NextResponse.json(
      {
        responseStatus: 0,
        response: { items: [], total: 0 },
        message: error instanceof Error ? error.message : "Admin API request failed"
      },
      { status: 502 }
    );
  }
}
