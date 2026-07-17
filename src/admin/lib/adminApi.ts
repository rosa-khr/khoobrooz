"use client";

import type { Accuracy } from "@/admin/data/adminMockData";

export type AdminResource = "menus" | "categories" | "pages" | "services" | "articles" | "news" | "tags" | "world-clocks" | "content-sources" | "source-items";
export type AdminApiServiceAction = {
  id: number;
  name: string;
  title: string;
  method: "POST";
  path: string;
  scope: "Public" | "Admin";
  request: Record<string, unknown>;
  response: Record<string, unknown>;
  status: "active" | "planned";
};

export type AdminApiServiceGroup = {
  id: number;
  serviceName: string;
  title: string;
  description: string;
  actions: AdminApiServiceAction[];
};

export type AdminMenuRecord = {
  id: number;
  title: string;
  parentId: number | null;
  parentTitle: string | null;
  url: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  level: 1 | 2 | 3;
  isPublished: boolean;
  accuracy: Accuracy;
  modifiedAt: string;
};

export type AdminContentRecord = {
  id: number;
  title: string;
  headline: string;
  categoryId: number | null;
  category: string | null;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  content: string;
  approve: boolean;
  isPublished: boolean;
  accuracy: Accuracy;
  scheduledAt: string | null;
  modifiedAt: string;
  tagIds?: number[];
  tagTitles?: string[];
};

export type AdminCategoryRecord = {
  id: number;
  title: string;
  parentId: number | null;
  parentTitle: string | null;
  type: "encyclopedia" | "news" | "circular" | string;
  slug: string;
  summary: string;
  contentTop: string;
  contentBottom: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  coverImageUrl: string;
  sortOrder: number;
  isPublished: boolean;
  isIndexable: boolean;
  accuracy: Accuracy;
  modifiedAt: string;
};

export type AdminSimpleRecord = {
  id: number;
  title: string;
  slug: string;
  content?: string;
  seoTitle?: string;
  seoDescription?: string;
  summary?: string;
  description?: string;
  cta?: string;
  href?: string;
  isPublished?: boolean;
  accuracy: Accuracy;
  modifiedAt: string;
};

export type AdminCountryRecord = {
  id: number;
  nameFa: string;
  nameEn: string;
  iso2: string;
  iso3: string;
  capital: string | null;
  continent: string;
};

export type AdminCityOption = {
  id: number;
  city: string;
  cityEn: string;
  timezone: string;
  isTradeCity?: boolean;
};

export type AdminWorldClockRecord = {
  id: number;
  countryId: number | null;
  cityId: number | null;
  city: string;
  country: string;
  countryCode: string | null;
  continent: string;
  timezone: string;
  marketLabel: string | null;
  sortOrder: number;
  isPublished: boolean;
  accuracy: Accuracy;
  modifiedAt: string;
};

export type AdminContentSourceRecord = {
  id: number;
  title: string;
  name: string;
  slug: string;
  websiteUrl: string;
  feedUrl: string;
  sourceType: "rss" | "atom" | "api" | "scraper" | "manual";
  sourceCategory: "official" | "news_agency" | "trade_media" | "international";
  language: string;
  country: string;
  defaultArticleType: "news" | "circular" | "regulation" | "official_notice";
  defaultCategoryId: number | null;
  defaultCategory: string | null;
  trustLevel: "official" | "high" | "medium" | "low";
  fetchIntervalMinutes: number;
  backfillDays: number;
  maxBackfillItems: number;
  requiresReview: boolean;
  allowAutoPublish: boolean;
  isActive: boolean;
  respectRobots: boolean;
  connectionStatus: "ready" | "needs_configuration" | "manual_required" | "disabled" | "error";
  termsNotes: string;
  parserKey: string;
  lastFetchedAt: string | null;
  lastSuccessfulFetchAt: string | null;
  lastErrorAt: string | null;
  lastErrorMessage: string;
  accuracy: Accuracy;
  modifiedAt: string;
};

export type AdminSourceItemRecord = {
  id: number;
  title: string;
  sourceId: number;
  sourceName: string;
  sourceUrl: string;
  originalTitle: string;
  originalSummary: string;
  originalContent: string;
  originalImageUrl: string;
  originalAuthor: string;
  originalLanguage: string;
  sourcePublishedAt: string | null;
  fetchedAt: string;
  detectedContentType: "news" | "circular" | "regulation" | "official_notice";
  suggestedCategoryId: number | null;
  suggestedCategory: string | null;
  relevanceScore: number;
  processingStatus: "pending_review" | "approved" | "published" | "rejected" | "duplicate" | "archived" | "failed" | "filtered_out";
  duplicateOfId: number | null;
  articleId: number | null;
  newsId: number | null;
  circularNumber: string;
  issuer: string;
  issuedAt: string | null;
  effectiveAt: string | null;
  attachmentUrl: string;
  officialPageUrl: string;
  validityStatus: string;
  reviewTitle: string;
  slug: string;
  summary: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  selectedImageUrl: string;
  accuracy: Accuracy;
  modifiedAt: string;
};

export type AdminGridRecord = AdminMenuRecord | AdminCategoryRecord | AdminContentRecord | AdminSimpleRecord | AdminWorldClockRecord | AdminContentSourceRecord | AdminSourceItemRecord;

type AdminApiResponse<T> = {
  responseStatus: 0 | 1;
  response: {
    items: T[];
    total: number;
  };
  message?: string;
};

const adminApiBaseUrl = "";
const defaultGridRequest = {
  pageing: {
    pageNumbber: 1,
    PageSize: 15
  },
  sorting: [],
  filters: {}
};
const lookupRequest = {
  pageing: {
    pageNumbber: 1,
    PageSize: 300
  },
  sorting: [],
  filters: {}
};

async function adminPost<T>(resource: AdminResource | "api-services" | "countries", action: string, body: Record<string, unknown> = {}) {
  const response = await fetch(`${adminApiBaseUrl}/api/admin/${resource}/${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const payload = (await response.json()) as AdminApiResponse<T>;

  if (!response.ok || payload.responseStatus === 0) {
    throw new Error(payload.message ?? "Admin API request failed.");
  }

  return payload;
}

export async function loadAdminPage(resource: AdminResource) {
  return adminPost<AdminGridRecord>(resource, "loadPage", defaultGridRequest);
}

export async function loadAdminLookup(resource: AdminResource, filters: Record<string, unknown> = {}) {
  return adminPost<AdminGridRecord>(resource, "loadPage", { ...lookupRequest, filters });
}

export async function loadApiServiceCatalog() {
  return adminPost<AdminApiServiceGroup>("api-services", "loadPage", defaultGridRequest);
}

export async function loadAdminCountries() {
  return adminPost<AdminCountryRecord>("countries", "loadPage", lookupRequest);
}

export async function loadAdminCountryCities(countryId: number) {
  return adminPost<AdminCityOption>("countries", "cities", { countryId });
}

export async function findAdminRecord(resource: AdminResource, id: string) {
  return adminPost<AdminGridRecord>(resource, "find", { id: Number(id) });
}

export async function saveAdminRecord(resource: AdminResource, action: "add" | "update", body: Record<string, unknown>) {
  return adminPost<AdminGridRecord>(resource, action, body);
}

export async function deleteAdminRecord(resource: AdminResource, id: number) {
  return adminPost<{ id: number; accuracy: 2 }>(resource, "delete", { id });
}

export async function runAdminResourceAction(resource: AdminResource, action: string, body: Record<string, unknown>) {
  return adminPost<AdminGridRecord>(resource, action, body);
}
